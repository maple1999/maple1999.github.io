"""Persistent, first-party visit summaries, fed by the existing nginx log.

No listener/port is opened. SMTP credentials stay in the existing config.json.
"""
import hashlib
import ipaddress
import json
import os
import re
import sqlite3
import time
from datetime import datetime
from email.header import Header
from email.mime.text import MIMEText
from email.utils import formataddr, formatdate
from urllib.parse import parse_qs, urlsplit

import notify as legacy

PAGES = {'/': '中文入口', '/en/': '英文入口', '/academic/': '英文学术页',
         '/academic/zh/': '中文学术页', '/career/': '求职页',
         '/career/?role=product': '求职 · 产品经理', '/career/?role=vision': '求职 · 视觉算法工程师', '/zh/': '旧中文入口'}
FILES = {
    '/cv/Shizhao_Gao_CV_EN.pdf': '英文学术简历',
    '/cv/Shizhao_Gao_CV_ZH.pdf': '中文学术简历',
    '/cv/Shizhao_Gao_Product_Manager_ZH.pdf': '产品经理简历',
    '/cv/Shizhao_Gao_Vision_Engineer_ZH.pdf': '视觉算法工程师简历',
    '/letters/Recommendation_Qiming_Li.pdf': '推荐信 · Qiming Li',
    '/letters/Recommendation_Jun_Li.pdf': '推荐信 · Jun Li',
}
ID = re.compile(r'^[a-f0-9]{32}$')


def page_path(raw):
    parsed = urlsplit(raw)
    if parsed.scheme or parsed.netloc:
        return None
    path = parsed.path.removesuffix('index.html').rstrip('/') + '/'
    if path not in PAGES:
        return None
    if path == '/career/':
        role = parse_qs(parsed.query).get('role', [''])[0]
        if role in ('product', 'vision'):
            path += '?role=' + role
    return path


def stamp(rec):
    return datetime.strptime(rec['ts'], '%d/%b/%Y:%H:%M:%S %z').timestamp()


def browser(rec):
    try:
        if not ipaddress.ip_address(rec['ip']).is_global:
            return False
    except ValueError:
        return False
    ua = rec['ua']
    return 'Mozilla' in ua and not legacy.BOT_RE.search(ua)


def duration(seconds):
    seconds = max(0, round(seconds))
    return f'{seconds // 60} 分 {seconds % 60} 秒'


class Collector:
    def __init__(self, path, cfg):
        self.cfg = cfg
        self.db = sqlite3.connect(path)
        self.db.row_factory = sqlite3.Row
        self.db.executescript('''
          PRAGMA journal_mode=WAL;
          CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
          CREATE TABLE IF NOT EXISTS sessions (
            key TEXT PRIMARY KEY, ip TEXT, ua TEXT, first REAL, last REAL,
            kind TEXT, confirmed INTEGER, status TEXT DEFAULT 'pending',
            retry REAL DEFAULT 0, attempts INTEGER DEFAULT 0, data TEXT);
          CREATE INDEX IF NOT EXISTS session_lookup ON sessions(ip, ua, status, last);
        ''')
        self.idle = max(60, int(cfg.get('session_idle_seconds', 300)))

    def meta(self, key, default=None):
        row = self.db.execute('SELECT value FROM meta WHERE key=?', (key,)).fetchone()
        return json.loads(row[0]) if row else default

    def put_meta(self, key, value):
        self.db.execute('INSERT OR REPLACE INTO meta VALUES (?,?)', (key, json.dumps(value)))

    def recent(self, rec, now):
        return self.db.execute("SELECT * FROM sessions WHERE ip=? AND ua=? AND status='pending' AND last>=? ORDER BY last DESC", (rec['ip'], rec['ua'], now - self.idle)).fetchall()

    def new(self, key, rec, now, kind):
        if self.db.execute("SELECT count(*) FROM sessions WHERE status='pending'").fetchone()[0] >= 1000:
            return None
        row = dict(key=key, ip=rec['ip'], ua=rec['ua'], first=now, last=now, kind=kind, confirmed=0,
                   status='pending', retry=0, attempts=0, data=json.dumps({'pages': {}, 'files': {}}))
        self.db.execute('INSERT INTO sessions VALUES (:key,:ip,:ua,:first,:last,:kind,:confirmed,:status,:retry,:attempts,:data)', row)
        return row

    def save(self, row, data):
        row = dict(row)
        row['data'] = json.dumps(data, ensure_ascii=False)
        self.db.execute('UPDATE sessions SET first=:first,last=:last,kind=:kind,confirmed=:confirmed,status=:status,retry=:retry,attempts=:attempts,data=:data WHERE key=:key', row)

    def ingest(self, rec):
        if not rec or not browser(rec) or len(rec['path']) > 2048:
            return
        try:
            now = stamp(rec)
        except (ValueError, KeyError):
            return
        parsed = urlsplit(rec['path'])
        if parsed.path == '/_visit':
            self.beacon(rec, parsed, now)
            return
        if rec['method'] != 'GET' or rec['status'] not in ('200', '206', '304'):
            return
        path = parsed.path
        page = page_path(rec['path'])
        if not page and path not in FILES and not legacy.ASSET_RE.match(path):
            return
        recent = self.recent(rec, now)
        if legacy.ASSET_RE.match(path):
            for row in recent:
                if row['kind'] == 'log' and now - row['last'] <= 25:
                    self.db.execute('UPDATE sessions SET confirmed=1 WHERE key=?', (row['key'],))
            return
        # A beacon follows page GET: avoid duplicate page counts in JS sessions.
        if page and any(row['kind'] == 'client' for row in recent):
            return
        if len(recent) > 1:  # Shared IP/browser: do not guess which tab fetched a PDF.
            return
        row = dict(recent[0]) if recent else self.new(hashlib.sha256(f"log:{rec['ip']}:{rec['ua']}:{now}".encode()).hexdigest(), rec, now, 'log')
        if not row:
            return
        data = json.loads(row['data'])
        row['last'] = max(row['last'], now)
        if page and len(data['pages']) < 100:
            data['pages'][f'log-{now}-{page}'] = dict(path=page, first=now, last=now, seconds=None, seq=0)
        if path in FILES:
            row['confirmed'] = 1
            item = data['files'].setdefault(path, dict(clicks=0, requests=0, last_request=0))
            # PDF viewers make many range requests. Count fetch groups, not chunks.
            if now - item['last_request'] > 60:
                item['requests'] += 1
            item['last_request'] = now
        self.save(row, data)

    def beacon(self, rec, parsed, now):
        if rec['status'] != '204' or rec['method'] != 'POST':
            return
        ref = urlsplit(rec['ref'])
        if ref.hostname != 'www.mapletech.top' or not page_path(ref.path):
            return
        try:
            params = parse_qs(parsed.query, strict_parsing=True, max_num_fields=12)
            if any(len(values) != 1 for values in params.values()):
                return
            p = {key: values[0] for key, values in params.items()}
            if p.get('v') != '2' or not ID.fullmatch(p.get('sid', '')) or not ID.fullmatch(p.get('pid', '')):
                return
            path = page_path(p['p'])
            number, seconds = int(p['n']), int(p['t'])
            if not path or number < 1 or number > 100000 or not 0 <= seconds <= 86400:
                return
            if p['e'] not in ('start', 'tick', 'pause', 'resume', 'end', 'download'):
                return
            if p['e'] == 'download' and p.get('f') not in FILES:
                return
        except (ValueError, KeyError):
            return
        key = hashlib.sha256(f"{p['sid']}:{rec['ip']}:{rec['ua']}".encode()).hexdigest()
        row = self.db.execute('SELECT * FROM sessions WHERE key=?', (key,)).fetchone()
        if row and row['status'] != 'pending':
            return  # Tombstone: retried/late beacons cannot resend a completed summary.
        if not row:
            pending = [r for r in self.recent(rec, now) if r['kind'] == 'log' and now - r['last'] <= 30]
            if len(pending) == 1:
                self.db.execute("UPDATE sessions SET key=?,kind='client' WHERE key=?", (key, pending[0]['key']))
                row = self.db.execute('SELECT * FROM sessions WHERE key=?', (key,)).fetchone()
            else:
                row = self.new(key, rec, now, 'client')
        if not row:
            return
        row = dict(row)
        data = json.loads(row['data'])
        for vid, item in list(data['pages'].items()):
            if vid.startswith('log-') and item['path'].split('?')[0] == path.split('?')[0] and abs(now - item['last']) <= 30:
                del data['pages'][vid]
        pages = data['pages']
        if p['pid'] not in pages and len(pages) >= 100:
            return
        item = pages.setdefault(p['pid'], dict(path=path, first=now, last=now, seconds=0, seq=0))
        seen = item.setdefault('seen', [])
        if item['path'] != path or number in seen or number <= item['seq'] - 256:
            return
        seen.append(number)
        item['seen'] = sorted(seen)[-256:]
        # Cumulative counters tolerate lost heartbeats without counting retries twice.
        item.update(last=max(item['last'], now), seconds=max(item['seconds'], min(seconds, max(0, now-item['first'])+30)), seq=max(item['seq'], number))
        row.update(last=max(row['last'], now), confirmed=1)
        if p['e'] == 'download':
            data['files'].setdefault(p['f'], dict(clicks=0, requests=0, last_request=0))['clicks'] += 1
        self.save(row, data)

    def due(self, now):
        return self.db.execute("SELECT * FROM sessions WHERE status='pending' AND last<=? AND retry<=? ORDER BY last LIMIT 10", (now-self.idle, now)).fetchall()

    def flush(self, now=None, sender=None, geo_lookup=None):
        now = now or time.time()
        sender = sender or legacy.send_email
        geo_lookup = geo_lookup or legacy.geolocate
        today = datetime.fromtimestamp(now, legacy.CST).strftime('%Y-%m-%d')
        if self.meta('day') != today:
            self.put_meta('day', today)
            self.put_meta('sent_today', 0)
        for original in self.due(now):
            row = dict(original)
            data = json.loads(row['data'])
            # Recheck pending sessions after a filter upgrade as well as new requests.
            if not browser(row) or not row['confirmed'] or (not data['pages'] and not data['files']):
                row['status'] = 'filtered'
            elif self.meta('sent_today', 0) >= self.cfg['daily_limit']:
                # Defer instead of sending immediately or dropping the summary.
                break
            else:
                geo = geo_lookup(row['ip'])
                if self.cfg.get('skip_hosting', True) and geo.get('hosting'):
                    row['status'] = 'filtered'
                else:
                    msg = build_email(self.cfg, row, geo, self.meta('sent_today', 0)+1)
                    if sender(self.cfg, msg):
                        row['status'] = 'sent'
                        self.put_meta('sent_today', self.meta('sent_today', 0)+1)
                        legacy.log(f"会话摘要已发送 {row['key'][:12]}，页面 {len(data['pages'])}，附件 {len(data['files'])}")
                    else:
                        row['attempts'] += 1
                        row['retry'] = now + min(3600, 300 * 2**min(row['attempts']-1, 4))
                        if row['attempts'] >= 6:
                            row['status'] = 'failed'
                            legacy.log(f"会话摘要重试耗尽 {row['key'][:12]}，保留记录待检查")
            self.save(row, data)
            self.db.commit()
        self.db.execute('DELETE FROM sessions WHERE last<?', (now-7*86400,))
        self.db.commit()


def build_email(cfg, row, geo, seq):
    data = json.loads(row['data'])
    pages = sorted(data['pages'].values(), key=lambda p: p['first'])
    visible = sum(p['seconds'] or 0 for p in pages)
    location = ' · '.join(geo.get(k, '') for k in ('country', 'regionName', 'city') if geo.get(k)) or '未知'
    subject_places = [' '.join(str(value).split()) for value in
                      (geo.get('country'), geo.get('city') or geo.get('regionName')) if value]
    subject_location = ' · '.join(dict.fromkeys(subject_places)) or '属地未知'
    org = geo.get('org') or geo.get('isp') or '未知'
    inst = legacy.identify_institution(geo, geo.get('reverse', ''))
    local = lambda ts: datetime.fromtimestamp(ts, legacy.CST).strftime('%Y-%m-%d %H:%M:%S')
    lines = [f"{cfg['site_label']} · 访问结束汇总", '', f"首次访问：{local(row['first'])}", f"最后活动：{local(row['last'])}",
             f"会话跨度：{duration(row['last']-row['first'])}（不含发送前等待）",
             f"前台可见时长：{duration(visible) if row['kind']=='client' else '未知（未收到浏览器计时）'}",
             f"页面浏览：{len(pages)} 次 / {len(set(p['path'] for p in pages))} 个页面或岗位视图",
             f"IP：{row['ip']}", f"归属地：{location}", f"组织／运营商：{org}"]
    if inst:
        lines.append('机构网络线索：'+inst+'（不代表访客个人身份）')
    lines += ['', '浏览顺序与各页前台停留：']
    for i, item in enumerate(pages, 1):
        value = duration(item['seconds']) if item['seconds'] is not None else '未知'
        lines.append(f"{i}. {local(item['first'])}  {PAGES.get(item['path'], item['path'])}  | {value}\n   https://www.mapletech.top{item['path']}")
    lines += ['', '附件点击／文件请求：']
    for path, item in data['files'].items():
        lines.append(f"- {FILES[path]}：点击 {item['clicks']} 次；HTTP 文件请求 {item['requests']} 组\n  https://www.mapletech.top{path}")
    if not data['files']:
        lines.append('本次未观测到附件点击或请求。')
    lines += ['', '统计说明：连续 5 分钟无活动后汇总；以单个标签页会话为主，不识别访客真实身份。',
              '前台可见时长为估算，不等同于专注阅读；后台、断网、拦截脚本或关闭浏览器会造成缺失。',
              '文件请求含 PDF 在线预览与分段读取；点击或请求不代表已完整下载、保存。多标签归属不明确时不强行合并。',
              '仅统计本个人站内页面与列出的附件，不读取其他网站、输入内容或任意查询参数。',
              f"会话：{row['key'][:12]} | 今日第 {seq} 封（上限 {cfg['daily_limit']}）"]
    msg = MIMEText('\n'.join(lines), 'plain', 'utf-8')
    msg['Subject'] = Header(f"{'🎓 ' if inst else ''}访问汇总 · {subject_location} · {len(pages)} 页 · {duration(visible) if row['kind']=='client' else '时长未知'} · {len(data['files'])} 附件", 'utf-8')
    msg['From'] = formataddr((str(Header('个人网站访问汇总', 'utf-8')), cfg['smtp_user']))
    msg['To'] = cfg['mail_to']
    msg['Date'] = formatdate(localtime=True)
    return msg


def run():
    cfg = legacy.load_config()
    collector = Collector(os.path.join(legacy.BASE, 'sessions.sqlite3'), cfg)
    os.chmod(os.path.join(legacy.BASE, 'sessions.sqlite3'), 0o600)
    # Carry over daily SMTP quota, not the old IP-based dedupe window.
    if collector.meta('day') is None:
        state = legacy.load_state()
        collector.put_meta('day', state.get('day', ''))
        collector.put_meta('sent_today', state.get('sent_today', 0))
        collector.db.commit()
    path = cfg['log_path']
    handle = None
    legacy.log(f'会话汇总 v2 启动：{collector.idle}s 无活动后发信；每日上限 {cfg["daily_limit"]}')
    while True:
        try:
            stat = os.stat(path)
            if handle is None:
                handle, inode = legacy.open_log(path)
                cursor = collector.meta('cursor', {})
                if cursor.get('inode') == inode and 0 <= cursor.get('offset', -1) <= stat.st_size:
                    handle.seek(cursor['offset'])
                elif cursor:
                    handle.seek(0)  # New rotated log: include requests already written.
                else:
                    handle.seek(0, os.SEEK_END)  # Do not email historical pre-upgrade visits.
            elif stat.st_ino == os.fstat(handle.fileno()).st_ino and stat.st_size < handle.tell():
                handle.seek(0)  # copytruncate rotation.
            eof = False
            with collector.db:
                for _ in range(500):
                    start = handle.tell()
                    line = handle.readline()
                    if not line:
                        eof = True
                        break
                    if not line.endswith('\n'):
                        handle.seek(start)
                        break
                    try:
                        collector.ingest(legacy.parse_line(line.rstrip('\n')))
                    except (ValueError, KeyError, OverflowError):
                        continue
                collector.put_meta('cursor', dict(inode=os.fstat(handle.fileno()).st_ino, offset=handle.tell()))
            if eof and os.stat(path).st_ino != os.fstat(handle.fileno()).st_ino:
                # Drain the old descriptor before switching to the new rotated log.
                handle.close()
                handle = None
            collector.flush()
            time.sleep(2)
        except FileNotFoundError:
            time.sleep(2)


if __name__ == '__main__':
    run()
