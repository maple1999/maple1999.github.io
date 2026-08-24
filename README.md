# mapletech.top — 个人主页

高世钊的中英双语学术 / 工程个人主页。Astro 静态生成，一套源码发布到两个地方。

| 站点 | 地址 | 角色 |
|------|------|------|
| **GitHub Pages** | https://maple1999.github.io | **主站**，对外用这个地址，被搜索引擎收录 |
| 腾讯云 | http://122.51.4.253 · https://122.51.4.253 | 镜像，国内访问快；带 `noindex` 不参与收录 |
| 中文页 | 两站均为 `/zh/` | |

> 两个站内容完全相同。为避免搜索引擎判定重复内容互相稀释，只有主站开放收录，
> 镜像站输出 `noindex` 且 robots.txt 全站禁止抓取。备案通过后可以对调（见第五节）。

---

## 一、日常怎么改

### 改内容（最常用）

**所有文字、论文、项目、经历都在一个文件里**：

```
site/src/data/profile.ts
```

中英文成对写在一起（`{ en: '...', zh: '...' }`），改完不需要动任何组件。例如新增一篇论文，
就往 `publications` 数组里加一项；论文中稿了，把它从 `underReview` 移到 `publications`。

### 换简历 PDF

覆盖这两个文件，文件名保持不变：

```
site/public/cv/Shizhao_Gao_CV_EN.pdf
site/public/cv/Shizhao_Gao_CV_ZH.pdf
```

### 换照片

替换 `site/src/assets/portrait.jpg`（正方形，建议 ≥800px）。构建时 Astro 会自动生成
1x/2x 的 WebP，无需手动压缩。社交分享用的那张是 `site/public/portrait.jpg`（600×600）。

### 发布

```bash
# 主站：提交后 GitHub Actions 自动构建发布，约 1–2 分钟
git add -A && git commit -m "update" && git push

# 镜像站：手动部署到腾讯云
cd site && npm run deploy
```

### 本地预览

```bash
cd site
npm run dev        # http://localhost:4321
```

### 截图回归（可选）

```bash
cd site
node scripts/shoot.mjs http://127.0.0.1:4321 ../.shots
```

用本机 Chrome 截取「英文暗色 / 英文浅色 / 中文暗色 / 移动端」四张整页图，并报告横向溢出元素。

---

## 二、一套源码，两个目标

靠两个环境变量区分：

| 变量 | 作用 | 主站 | 镜像站 |
|------|------|------|--------|
| `SITE_URL` | 决定 canonical / hreflang / OG / sitemap 里的绝对地址 | `https://maple1999.github.io` | `http://122.51.4.253` |
| `NOINDEX` | 设为 `1` 时输出 `noindex` + robots 全站禁抓 | 不设 | `1` |

主站的值写在 `.github/workflows/pages.yml`，镜像站的值写在 `site/scripts/deploy.mjs`。
`sitemap.xml` 和 `robots.txt` 都是 Astro 端点动态生成的（`src/pages/`），不是静态文件，
所以会自动跟随构建目标变化。

---

## 三、设计与技术要点

| 方面 | 做法 |
|------|------|
| 框架 | Astro 5，纯静态输出，服务器不需要 Node 运行时 |
| 双语 | `/` 英文、`/zh/` 中文，各自独立静态页（SEO 友好），带 `hreflang` 互链 |
| 字体 | Instrument Serif + Inter **自托管**（91KB），不依赖 Google Fonts —— 国内访问不会卡 |
| 图片 | 人像走 `astro:assets`，构建期生成 1x/2x WebP（550KB → 12KB/49KB） |
| 主题 | 暗色为默认，可切浅色；首屏前的内联脚本决定主题，无闪烁 |
| 首屏动效 | Canvas 周期自适应波形：波长沿 x 轴变化、波峰打点，呼应「重复动作计数」研究主题 |
| 健壮性 | 滚动渐显默认**可见**，脚本接管后才隐藏 —— JS 挂掉也不会白屏；另有 4 秒兜底 |
| 无障碍 | 跳转链接、`prefers-reduced-motion`、`focus-visible`、语义标签、图标 `aria-label` |
| 其他 | 结构化数据（Schema.org Person）、sitemap、robots、自定义 404、打印样式 |

页面体积：HTML 43KB + CSS 25KB + 字体 91KB，gzip 已开。

---

## 四、腾讯云服务器现状

```
nginx :80 / :443  (default_server)
 ├─ /                → /var/www/mapletech        个人主页（静态）
 ├─ /playground/     → 反代 127.0.0.1:8080       原 gpt-image-playground
 └─ /.well-known/    → /var/www/certbot          ACME 证书续期验证

其他端口（未改动）
 :8080  gpt-image-playground（原样保留，仍可直接访问）
 :8787  archive-preview（原样保留）
```

### 部署时改动了什么

1. **`gpt-image-playground.service`（占用 :80 的那个实例）已 stop + disable。**
   同样内容的 `gpt-image-playground-8080.service` 仍在运行，nginx 反代到 `/playground/`，功能没有减少。
   要恢复：`sudo systemctl enable --now gpt-image-playground.service`（需先让出 80 端口）。

2. **`english-tutor` 站点已停用。** 只摘掉了 `sites-enabled` 的软链，
   配置完整保留在 `/etc/nginx/sites-available/english-tutor`。
   恢复：`sudo ln -s /etc/nginx/sites-available/english-tutor /etc/nginx/sites-enabled/`
   —— 注意它也监听 443，恢复前需先解决与本站的端口冲突。

3. **修正了证书续期配置。** 原来 certbot 的 webroot 指向 `/opt/gpt-image-playground/current`，
   靠 :80 上的 `http.server` 提供验证文件。nginx 接管 80 后这条路径失效，续期会失败。
   已改为 `/var/www/certbot`，并用 `certbot renew --dry-run` 验证通过。
   > 证书是 6 天有效期的短效证书，`snap.certbot.renew.timer` 每天两次自动续期，
   > 续期后由 `/etc/letsencrypt/renewal-hooks/deploy/` 里的钩子 reload nginx。

nginx 配置源码在 `deploy/` 下（未纳入公开仓库），服务器上对应：

- `deploy/mapletech.conf` → `/etc/nginx/sites-available/mapletech`
- `deploy/mapletech-common.conf` → `/etc/nginx/snippets/mapletech-common.conf`

---

## 五、访问邮件提醒（visit-notify）

有真人访问主页时，通过 `mail_for_bot@163.com` 给 `gsz199911@163.com` 发一封提醒，
内容包含时间、IP、归属地、组织／运营商、AS、反向域名，以及**是否来自高校／科研机构**。

```
/opt/visit-notify/
├── notify.py       # 守护进程
├── config.json     # 含 SMTP 授权码，chmod 600，不进仓库
└── state.json      # 去重记录 + 当日计数 + 日志读取位置
systemd: visit-notify.service     日志: journalctl -u visit-notify -f
```

### 为什么是读日志，不是插在请求链路里

读 `access.log` 与网站服务完全解耦。脚本崩了、SMTP 挂了、IP 查询超时了，
都不会拖慢或拖垮网站本身。

### 过滤是这个功能的核心

公网 IP 的服务器每天被大量扫描器打——部署当天日志里就有 `zgrab`、端口探测这类请求。
更麻烦的是**扫描器会伪造浏览器 UA**，只靠 UA 过滤挡不住。五层过滤：

| 层 | 规则 |
|----|------|
| 路径 | 只认 `/`、`/zh/` 等页面路径，静态资源、探测路径（`/wp-login.php` 之类）全丢 |
| 字节数 | 响应体 < 1000 字节的丢弃——扫描器常见「连上就断」，真实页面 gzip 后约 12KB |
| UA | 正则过滤爬虫／扫描器／命令行工具；要求带 `Mozilla` 前缀 |
| **子资源确认** | **页面命中后进入 25 秒待确认队列；只有同一 IP 接着请求了 CSS／字体／头像才判定为真人。机器人取完 HTML 就走，这是最有效的一层** |
| 去重 + 配额 | 同一 IP 在 `dedupe_hours`（默认 6h）内只提醒一次；每日 `daily_limit`（默认 40）封上限，保护 163 账号 |

实测效果：

```
只请求 /（伪造 Chrome UA）        → 丢弃（只取了 HTML，判定为机器人）
请求 / + CSS + 字体（同一 IP）     → 发出提醒
```

> ⚠️ **`/_astro/` 和 `/fonts/` 的 `access_log` 必须保持开启。**
> 这两个 location 原本为了让日志干净设了 `access_log off`，结果子资源确认永远拿不到信号。
> 现在已改回记录，`deploy/mapletech-common.conf` 里有注释说明原因，别再关掉。

### 机构识别

优先看反向 DNS 后缀（`.edu.cn` / `.ac.uk` / `.edu` 等，最可靠），
其次匹配 ASN／组织名里的 `universit`、`institute`、`cernet`、`大学`、`研究所` 等关键词。
命中时邮件标题会带 🎓 前缀，方便在手机上一眼区分。

实测清华 IP（166.111.4.100）→ 反向域名 `www.tsinghua.edu.cn`，识别为「教育/科研域名」。

### 改配置

```bash
sudo vi /opt/visit-notify/config.json     # dedupe_hours / daily_limit / mail_to
sudo systemctl restart visit-notify
```

> 授权码只存在服务器上的 `config.json`（600 权限），未进入 Git 仓库。
> 需要更换时在网易邮箱重新生成，改配置后重启服务即可。

### ⚠️ 覆盖范围的重要限制

**这个功能只统计腾讯云镜像站（IP 访问）的流量，统计不到 GitHub Pages 主站。**
GitHub Pages 是纯静态托管，没有服务端、也拿不到访问日志。

而你对外用的、要写进 CV 的地址是 `maple1999.github.io` —— 也就是说
**绝大多数真实访问目前不会触发提醒**。两条路可以补上：

1. 备案通过后域名指向腾讯云，域名成为主站，提醒自然全覆盖；
2. 在 GitHub Pages 页面里加一个指向腾讯云的埋点请求（一行代码），
   访问 github.io 时也会触发提醒。代价是给公开站点引入了跨站请求。

---

## 六、域名 www.mapletech.top 的现状

**服务器侧已经全部就绪，卡在备案上。** 实测结论：

```
DNS          www.mapletech.top → 122.51.4.253      ✅ 已正确解析
nginx        server_name 已含域名                    ✅ 带 Host 头本地请求返回 200 且标题正确
外网访问      → 302 https://dnspod.qcloud.com/static/webblock.html
                                                    ❌ 腾讯云未备案拦截
```

跳转到 `webblock.html` 是腾讯云对未备案域名的网络层拦截，与 nginx 配置无关。
**备案通过后无需再改服务器上的任何东西，域名会自动生效。**

两个待办：

- 裸域 `mapletech.top` 目前没有 A 记录，建议在 DNS 服务商处补一条指向 `122.51.4.253`。
- 想在备案通过前就用上域名，只能走境外托管：GitHub Pages 绑定自有域名**不需要备案**，
  在 `site/public/` 下加 `CNAME` 文件（内容写 `www.mapletech.top`），
  域名 CNAME 解析到 `maple1999.github.io`，证书由 GitHub 自动签发。

---

## 七、备案通过后：把域名切成主站

1. **域名解析**：`mapletech.top` 和 `www.mapletech.top` 的 A 记录指向 `122.51.4.253`。

2. **申请域名证书**：
   ```bash
   sudo certbot certonly --webroot -w /var/www/certbot \
        -d mapletech.top -d www.mapletech.top
   ```
   把 `/etc/nginx/sites-available/mapletech` 里两行 `ssl_certificate*` 换成
   `/etc/letsencrypt/live/mapletech.top/` 下的路径，`sudo nginx -t && sudo systemctl reload nginx`。

3. **主站/镜像对调**：
   - `site/scripts/deploy.mjs`：`SITE_URL` 改成 `https://www.mapletech.top`，**去掉 `NOINDEX`**。
   - `.github/workflows/pages.yml`：`SITE_URL` 保持 github.io，但加上 `NOINDEX: '1'`
     （让 GitHub Pages 变成镜像）。
   - `site/src/data/profile.ts`：填上 `site.icp`（如 `'闽ICP备2026xxxxxx号-1'`），页脚会自动显示。

> 另一条路：GitHub Pages 支持绑定自有域名且**不需要备案**（服务器在境外）。
> 想走这条路的话，在 `site/public/` 下加一个 `CNAME` 文件内容写 `www.mapletech.top`，
> 再把域名 CNAME 解析到 `maple1999.github.io` 即可，证书由 GitHub 自动签发。

---

## 八、内容上需要确认的地方

- **在投论文只写了研究方向，没写标题**（按双盲评审惯例）。你的 CV 里是有完整标题的，
  网站是刻意不同步——如果希望网站也放标题，改 `profile.ts` 的 `underReview` 即可。
- **出生日期、手机号没有放到公开页面**（CV 里有），避免被爬虫抓取用于身份信息拼接。
- **成绩单没有公开**，也没有进入 Git 仓库（`.gitignore` 已排除根目录所有 PDF）。
- **推荐人信息没有放到网站上**——公开导师邮箱需要先征得他们同意。
- 首屏 slogan、`identity.intro` 自述、各项目的「问题 / 方法 / 结果」叙述，
  是根据你的 CV 与附录改写的，**建议逐句过一遍**，确保语气和事实都符合你本人的表达。

---

## 九、目录结构

```
personal_web/
├── .github/workflows/pages.yml # GitHub Pages 自动发布
├── site/                       # 网站源码
│   ├── src/
│   │   ├── data/profile.ts     # ← 所有内容都在这里
│   │   ├── components/         # 各版块组件
│   │   ├── layouts/Base.astro  # 页面外壳：head / 导航 / 页脚 / 脚本
│   │   ├── pages/              # / 、/zh/ 、404、sitemap.xml、robots.txt
│   │   ├── assets/portrait.jpg # 人像原图（构建期自动优化）
│   │   ├── styles/global.css   # 设计系统（配色、排版、组件样式）
│   │   └── lib/i18n.ts         # 取词助手
│   ├── public/                 # 字体、简历 PDF、favicon、分享图
│   └── scripts/
│       ├── deploy.mjs          # 部署到腾讯云镜像（未纳入公开仓库）
│       ├── shoot.mjs           # 截图回归
│       └── diagnose.mjs        # 页面运行时诊断
├── deploy/                     # 服务器配置（未纳入公开仓库）
│   ├── mapletech*.conf         # nginx 站点配置
│   └── visit-notify/           # 访问邮件提醒（守护进程 + systemd 单元）
└── *.pdf / *.jpg               # 原始简历与照片素材（未纳入公开仓库）
```
