#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
个人主页访问提醒
================
跟随 nginx access.log，把「真人访问」通过网易邮箱发到指定邮箱。

为什么是读日志而不是插在请求链路里：
  读日志和网站服务完全解耦，脚本再怎么出问题都不会拖慢或拖垮网站。

公网 IP 上的服务器每天会被大量扫描器打（zgrab、censys、各种漏洞探测），
所以过滤是这个功能能不能用的关键，而不是可选项：
  1. 只认真正的页面访问（首页 / 中文页），静态资源和探测路径全丢
  2. 按 User-Agent 过滤爬虫与扫描器
  3. 同一 IP 在 dedupe_hours 内只提醒一次
  4. 每日发信上限，保护 163 邮箱不被判定为异常发信而封禁
"""

from __future__ import annotations

import json
import os
import re
import smtplib
import socket
import ssl
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from email.header import Header
from email.mime.text import MIMEText
from email.utils import formataddr, formatdate

BASE = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE, "config.json")
STATE_PATH = os.path.join(BASE, "state.json")

CST = timezone(timedelta(hours=8))


def log(msg: str) -> None:
    print(f"[{datetime.now(CST):%Y-%m-%d %H:%M:%S}] {msg}", flush=True)


# ----------------------------------------------------------------- 配置

def load_config() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    cfg.setdefault("log_path", "/var/log/nginx/access.log")
    cfg.setdefault("dedupe_hours", 6)
    cfg.setdefault("daily_limit", 40)
    cfg.setdefault("smtp_host", "smtp.163.com")
    cfg.setdefault("smtp_port", 465)
    cfg.setdefault("site_label", "个人主页")
    return cfg


# ----------------------------------------------------------------- 状态

def load_state() -> dict:
    try:
        with open(STATE_PATH, "r", encoding="utf-8") as f:
            s = json.load(f)
    except (OSError, ValueError):
        s = {}
    s.setdefault("seen", {})       # ip -> 上次提醒的时间戳
    s.setdefault("day", "")        # 当前统计日期
    s.setdefault("sent_today", 0)
    s.setdefault("offset", 0)      # 日志读取位置
    s.setdefault("inode", 0)
    return s


def save_state(state: dict) -> None:
    tmp = STATE_PATH + ".tmp"
    try:
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(state, f, ensure_ascii=False)
        os.replace(tmp, STATE_PATH)
    except OSError as e:
        log(f"状态写入失败: {e}")


# ------------------------------------------------------------- 日志解析

# nginx 默认 combined 格式
LOG_RE = re.compile(
    r'^(?P<ip>\S+) \S+ \S+ \[(?P<ts>[^\]]+)\] '
    r'"(?P<method>[A-Z]+) (?P<path>[^" ]*)[^"]*" '
    r'(?P<status>\d{3}) (?P<bytes>\S+) "(?P<ref>[^"]*)" "(?P<ua>[^"]*)"'
)

# 只有这些路径算「看了主页」
PAGE_PATHS = {"/", "/index.html", "/zh", "/zh/", "/zh/index.html"}

# 页面渲染资源仅作为弱证据；扫描器也会请求 favicon，不用它确认访问。
ASSET_RE = re.compile(r"^/(_astro/|fonts/|portrait\.)")

# 页面命中后，等这么久看有没有子资源请求跟上来
CONFIRM_WINDOW = 25.0

# 一次完整的页面响应至少这么多字节（gzip 后约 12KB）；0 字节多为扫描器探测
MIN_BODY_BYTES = 1000

# 爬虫 / 扫描器 / 命令行工具
BOT_RE = re.compile(
    r"bot|crawl|spider|slurp|scrap|zgrab|censys|masscan|nmap|nuclei|curl|wget|"
    r"python-requests|python-urllib|go-http|java/|okhttp|libwww|httpclient|"
    r"headless|phantom|playwright|puppeteer|selenium|monitor|uptime|pingdom|"
    r"facebookexternalhit|preview|fetcher|probe|scanner|forestengine|"
    r"sqlmap|nikto|gobuster|dirbuster",
    re.I,
)

PRIVATE_RE = re.compile(
    r"^(10\.|127\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|fe80:)"
)


def parse_line(line: str) -> dict | None:
    m = LOG_RE.match(line)
    return m.groupdict() if m else None


def is_real_visit(rec: dict) -> tuple[bool, str]:
    """
    返回 (是否是候选页面访问, 被丢弃的原因)。
    注意这只是第一道关：还要等子资源请求跟上来才算真人（见 CONFIRM_WINDOW）。
    """
    if rec["method"] != "GET":
        return False, "非 GET"
    if rec["status"] not in ("200", "304"):
        return False, f"状态码 {rec['status']}"

    path = urllib.parse.urlparse(rec["path"]).path
    if path not in PAGE_PATHS:
        return False, "非页面路径"

    # 扫描器常见特征：请求了页面但几乎没收字节就断开
    try:
        if int(rec["bytes"]) < MIN_BODY_BYTES and rec["status"] == "200":
            return False, "响应字节过少"
    except (TypeError, ValueError):
        pass

    ua = rec["ua"].strip()
    if not ua or ua == "-":
        return False, "无 UA"
    if BOT_RE.search(ua):
        return False, "爬虫/扫描器"
    if "Mozilla" not in ua:          # 真实浏览器都带 Mozilla 前缀
        return False, "非浏览器 UA"
    if PRIVATE_RE.match(rec["ip"]):
        return False, "内网 IP"

    return True, ""


# --------------------------------------------------------------- IP 归属

EDU_SUFFIX_RE = re.compile(
    r"\.edu$|\.ac$|"
    r"\.(edu|ac)\.(cn|uk|jp|kr|in|au|nz|sg|hk|tw|za|il|at|be|th|id|ir|ru|pl)$",
    re.I,
)

ORG_EDU_RE = re.compile(
    r"universit|college|institute|academy|research|school|polytech|"
    r"cernet|education|laborator|"
    r"大学|学院|研究所|研究院|科学院|教育网|科研",
    re.I,
)


def geolocate(ip: str, timeout: int = 12) -> dict:
    """ip-api.com 免费接口：45 次/分钟，无需 key。失败返回空 dict。"""
    url = (
        f"http://ip-api.com/json/{ip}"
        "?fields=status,country,regionName,city,isp,org,as,reverse,mobile,proxy,hosting"
        "&lang=zh-CN"
    )
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "visit-notify/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = json.loads(r.read().decode("utf-8"))
        return data if data.get("status") == "success" else {}
    except Exception as e:  # noqa: BLE001 查询失败不应影响提醒本身
        log(f"IP 归属查询失败 {ip}: {e}")
        return {}


def reverse_dns(ip: str, timeout: int = 5) -> str:
    old = socket.getdefaulttimeout()
    socket.setdefaulttimeout(timeout)
    try:
        return socket.gethostbyaddr(ip)[0]
    except Exception:  # noqa: BLE001
        return ""
    finally:
        socket.setdefaulttimeout(old)


def identify_institution(geo: dict, rdns: str) -> str:
    """
    判断是否来自高校/科研机构。命中则返回可读说明，否则返回空串。
    反向域名后缀（.edu.cn / .ac.uk 等）是最可靠的信号，其次看 ASN/组织名。
    """
    host = (rdns or geo.get("reverse") or "").strip(".")
    if host and EDU_SUFFIX_RE.search(host):
        return f"教育/科研域名：{host}"

    for field in ("org", "isp", "as"):
        val = (geo.get(field) or "").strip()
        if val and ORG_EDU_RE.search(val):
            return f"机构网络：{val}"

    return ""


# ----------------------------------------------------------------- 发信

def build_email(cfg: dict, rec: dict, geo: dict, rdns: str, inst: str, seq: int) -> MIMEText:
    path = urllib.parse.urlparse(rec["path"]).path
    page = "中文页" if path.startswith("/zh") else "英文首页"

    loc_parts = [geo.get("country"), geo.get("regionName"), geo.get("city")]
    location = " · ".join(p for p in loc_parts if p) or "未知"
    org = geo.get("org") or geo.get("isp") or "未知"

    flags = []
    if geo.get("mobile"):
        flags.append("移动网络")
    if geo.get("proxy"):
        flags.append("代理/VPN")
    if geo.get("hosting"):
        flags.append("机房/云主机")

    if inst:
        subject = f"🎓 机构访问 · {location} · {org}"
    else:
        subject = f"主页访问 · {location} · {org}"

    lines = [
        f"{cfg['site_label']}收到一次访问。",
        "",
        f"时间：{rec['local_time']}",
        f"页面：{page}（{path}）",
        f"IP：{rec['ip']}",
        f"归属地：{location}",
        f"组织／运营商：{org}",
    ]
    if geo.get("as"):
        lines.append(f"AS：{geo['as']}")
    if rdns:
        lines.append(f"反向域名：{rdns}")
    if inst:
        lines += ["", f"★ 机构识别：{inst}"]
    if flags:
        lines.append(f"网络特征：{'、'.join(flags)}")

    ref = rec["ref"]
    lines += [
        "",
        f"来源：{ref if ref and ref != '-' else '直接访问'}",
        f"User-Agent：{rec['ua']}",
        "",
        "—",
        f"今日第 {seq} 封提醒（上限 {cfg['daily_limit']} 封）。",
        f"同一 IP 在 {cfg['dedupe_hours']} 小时内只提醒一次；爬虫与扫描流量已过滤。",
    ]

    msg = MIMEText("\n".join(lines), "plain", "utf-8")
    msg["Subject"] = Header(subject, "utf-8")
    msg["From"] = formataddr((str(Header("主页访问提醒", "utf-8")), cfg["smtp_user"]))
    msg["To"] = cfg["mail_to"]
    msg["Date"] = formatdate(localtime=True)
    return msg


def send_email(cfg: dict, msg: MIMEText, retries: int = 3) -> bool:
    ctx = ssl.create_default_context()
    for attempt in range(1, retries + 1):
        try:
            with smtplib.SMTP_SSL(
                cfg["smtp_host"], cfg["smtp_port"], context=ctx, timeout=30
            ) as s:
                s.login(cfg["smtp_user"], cfg["smtp_pass"])
                s.sendmail(cfg["smtp_user"], [cfg["mail_to"]], msg.as_string())
            return True
        except Exception as e:  # noqa: BLE001
            log(f"发信失败（第 {attempt}/{retries} 次）: {e}")
            if attempt < retries:
                time.sleep(5 * attempt)
    return False


# ----------------------------------------------------------- 日志跟随

def open_log(path: str):
    f = open(path, "r", encoding="utf-8", errors="replace")
    return f, os.fstat(f.fileno()).st_ino


def notify(cfg: dict, state: dict, rec: dict) -> None:
    """对一次已确认的真人访问做去重、配额检查，然后发信。"""
    now = time.time()
    ip = rec["ip"]

    if now - state["seen"].get(ip, 0) < cfg["dedupe_hours"] * 3600:
        return

    today = datetime.now(CST).strftime("%Y-%m-%d")
    if state["day"] != today:
        state["day"] = today
        state["sent_today"] = 0

    if state["sent_today"] >= cfg["daily_limit"]:
        state["seen"][ip] = now      # 记下，避免次日配额重置后补发一堆
        log(f"已达每日上限，跳过 {ip}")
        return

    geo = geolocate(ip)

    # 机房／云主机 IP：没有真人会从 DigitalOcean 的实例上浏览网页。
    # 高级爬虫会用无头浏览器加载 CSS 和字体，骗过子资源确认那一层，
    # 但骗不过 IP 归属——这是挡住它们最有效的信号。
    # 高校和企业网络永远不会被标为 hosting，所以不会误伤目标读者。
    if cfg.get("skip_hosting", True) and geo.get("hosting"):
        state["seen"][ip] = now
        log(f"丢弃 {ip}（机房/云主机 IP：{geo.get('org') or geo.get('isp') or '未知'}）")
        return

    rec["local_time"] = rec["ts"].split(" ")[0].replace(":", " ", 1)
    rdns = reverse_dns(ip)
    inst = identify_institution(geo, rdns)

    msg = build_email(cfg, rec, geo, rdns, inst, state["sent_today"] + 1)
    if send_email(cfg, msg):
        state["sent_today"] += 1
        tag = "机构" if inst else "普通"
        log(f"已提醒 [{tag}] {ip} {geo.get('city') or ''} {geo.get('org') or ''}")
    else:
        log(f"放弃提醒 {ip}（发信重试均失败）")

    state["seen"][ip] = now          # 成功与否都记下，避免反复重试

    # 清理 7 天前的去重记录
    if len(state["seen"]) > 500:
        cutoff = now - 7 * 86400
        state["seen"] = {k: v for k, v in state["seen"].items() if v > cutoff}


def main() -> None:
    cfg = load_config()
    state = load_state()
    log_path = cfg["log_path"]

    while not os.path.exists(log_path):
        log(f"等待日志文件出现：{log_path}")
        time.sleep(10)

    f, inode = open_log(log_path)

    # 重启后从上次位置继续；日志被轮转过则只看新访问
    if state.get("inode") == inode and state.get("offset", 0) <= os.path.getsize(log_path):
        f.seek(state["offset"])
    else:
        f.seek(0, os.SEEK_END)
    state["inode"] = inode

    # 待确认的页面访问：ip -> {"rec":…, "t": 入队时刻, "ok": 是否已看到子资源}
    pending: dict[str, dict] = {}

    log(
        f"已启动，跟随 {log_path}"
        f"（去重 {cfg['dedupe_hours']}h，每日上限 {cfg['daily_limit']} 封，"
        f"子资源确认窗口 {CONFIRM_WINDOW:.0f}s）"
    )

    def flush(force: bool = False) -> None:
        """窗口到期的条目：加载过子资源的才发信，只取了 HTML 的丢弃。"""
        now = time.monotonic()
        for ip in [k for k, v in pending.items() if force or now - v["t"] > CONFIRM_WINDOW]:
            item = pending.pop(ip)
            if item["ok"]:
                notify(cfg, state, item["rec"])
            else:
                log(f"丢弃 {ip}（只取了 HTML，未加载任何子资源，判定为机器人）")

    while True:
        line = f.readline()

        if not line:
            flush()
            try:
                if os.stat(log_path).st_ino != inode:
                    log("检测到日志轮转，重新打开")
                    f.close()
                    f, inode = open_log(log_path)
                    state["inode"] = inode
                    state["offset"] = 0
            except OSError:
                pass
            state["offset"] = f.tell()
            save_state(state)
            time.sleep(2)
            continue

        rec = parse_line(line.rstrip("\n"))
        if not rec:
            continue

        ip = rec["ip"]
        path = urllib.parse.urlparse(rec["path"]).path

        # 子资源请求 → 确认对应 IP 是真实浏览器
        if ASSET_RE.match(path):
            if ip in pending:
                pending[ip]["ok"] = True
            continue

        ok, _reason = is_real_visit(rec)
        if ok and ip not in pending:
            pending[ip] = {"rec": rec, "t": time.monotonic(), "ok": False}

        flush()


if __name__ == "__main__":
    try:
        from sessions import run
        run()
    except KeyboardInterrupt:
        log("收到中断，退出")
