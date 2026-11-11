# mapletech.top — 个人主页

高世钊的个人主页，使用 Astro 静态生成。学术页支持中英双语，求职页为中文双岗位展示。

### 2026-11-11：学术主页改版

- 默认播放与项目介绍更新：`20261111T013325375Z`（上一版 `20261111T012841562Z`）。两个演示进入可见区域后默认轮播步骤；减少动画偏好下去掉过渡效果，但仍轮播，保留暂停与下一步。两个 VLM 项目左侧新增背景、问题难点、研究关注点和工作范围，收起具体证据选择、评分与路由实现描述；中英文同步，现有示意与实验数字保留。构建、学术页双语深浅主题布局及演示交互检查通过。
- 两个 VLM 方法动态演示已发布：`20261111T012841562Z`（上一版 `20261111T011759446Z`）。`VlmDemo.astro` / `scripts/vlm-demo.ts` / `styles/vlm-demo.css` 分别维护双语界面、四步播放状态及独立样式。Query-axis 可切换 1–3 个问题的共享范围，路由可切换有把握/不确定情境；支持自动播放、暂停、键盘下一步，离屏或后台暂停，减少动画偏好默认静止，无 JS 保留方法图。这些是方法流程示意，不调用模型，不生成或改写实验结果。`node scripts/check-vlm-demos.mjs [baseURL]` 验证交互、自动播放、暂停、离屏、打印、无 JS 和 1440 / 375 / 320px 双语布局；原学术页全量检查也已通过。
- Query-Axis Scaling 更新已发布：`20261111T011759446Z`（上一版 `20261111T011005723Z`）。中英标题、sharing scope 解释、联合选证据/共享编码/独立回答示意及学习目标的泛化问题已同步；现有结果数字不变。双语深浅主题 1440 / 768 / 375 / 320px 检查通过，sitemap 为两个学术页标注实际更新日。
- 缓存排查：`deploy/audit-academic-cache.py` 从源站与服务器 DNS 入口测试 18 种请求，`site/scripts/check-academic-cache.mjs` 从开发机公网测试 10 种请求。斜杠、无斜杠、index.html、UTM、旧版本参数、Googlebot/ChatGPT-User 标识均返回与当前构建 SHA256 相同的正文，无 AAAI 或旧论文式目录；均为 `Cache-Control: no-cache`。旧 ETag 返回 200 新正文，没有遗留预压缩 HTML，DNS 指向 `122.51.4.253`。没有复现服务器混发旧页，无需修改 nginx。开发机证据见 `site/.shots/academic-cache-audit.json`；第三方抓取缓存与历史索引无法通过这些检查确认已刷新。
- 目录吸顶修复已发布：`20261111T011005723Z`（上一版 `20261111T010218088Z`）。学术页使用 `overflow-x: clip`，侧栏设置 `align-self: start`，避免滚动容器与网格拉伸使 sticky 失效。桌面目录固定在顶栏下方，手机端横向目录吸顶；双语深浅主题 1440 / 768 / 375 / 320px 已验证滚动后的目录位置、可见性和点击命中。
- 已发布版本：`20261111T010218088Z`；上一版 `20261110T141851535Z` 留作回滚。构建校验、双语深浅主题 1440 / 768 / 375 / 320px 布局及交互检查通过；正式站页面和四份 CV 返回 200，两封推荐信原地址返回 404。外部浏览器在正式域名的 375px 双语深浅主题、键盘、深链、无 JS、图片/CV 与推荐信撤下检查也已通过。
- 当前结构为 About → Research Highlights → Publications → Research Interests → Background → Contact；保持原深浅主题和字体。首屏展示多模态表征学习与推理定位、CVPR Findings 第一作者与 Pattern Recognition 第二作者成果。当前研究与博士阶段希望探索的问题分开表述。
- 三个代表项目直接展开，结果无需切换；方法说明、论文/代码入口前置，补充细节一键展开。CVPR 图 2 和图 5 从作者的官方论文 PDF 渲染裁取，位于 `site/public/research/`，未改写图内数据；其余示意为网页原生 HTML/CSS。
- 网页（含求职页）已清理投稿会议身份关联，完整推荐信及摘录不再公开。原 PDF 保留在被 Git 忽略的 `.private/references/`；构建与部署检查会拒绝再次发布推荐信。旧版本作为服务器回滚备份保留，不是当前站点的公开目录。
- 用户明确要求自行修改 CV，本站此次不修改四份公开 CV。替换新版 PDF 前，旧 CV 内容仍可被访问。旧 GitHub Pages 仍在线且内容过时；依照项目约定，此次不更新或向它推送。
- 用户已于 2026-11-11 明确要求采用 Query-Axis Scaling：突出 sharing scope，多问题联合证据选择 → 共享视觉编码 → 分别回答；保留现有 +2.11 pp / −72.23% 结果。研究兴趣进一步说明学习目标如何形成超出原有任务与监督条件的可泛化表征。
- 当前组件为 `AcademicPage.astro`、`ResearchHighlights.astro`、`Publications.astro`，主内容源为 `data/academic.ts` 与 `profile.ts`，独立样式为 `styles/academic.css`。旧 `Paper*.astro` 与 `academic-paper.*` 不再用于正式页。下方历史记录保留用于追溯。

### 2026-11-11：自动访问拦截与汇报过滤

- 邮件标题已加入 IP 属地：`访问汇总 · 国家／地区 · 城市 · 页数 · 时长 · 附件数`。复用现有中文 IP 查询结果，城市缺失时回退到省／州，相同名称去重，查询失败显示“属地未知”；正文保留完整属地与 IP。`deploy/visit-notify/update-subject.py` 校验旧文件哈希、备份并替换 `sessions.py`，仅重启本站 `visit-notify.service`，状态 active；备份 `/var/backups/mapletech/visit-subject-20261111T021702Z/`。10 项单元测试通过，未发送测试邮件，未修改 SMTP 配置、会话库或 nginx。
- 正式域名 www HTTPS 的本站路径对 ForestEngine、zgrab、censys、nuclei、sqlmap 及列出的批量采集工具返回 403；完整规则见 `deploy/bot-guard-maps.conf`，已内嵌同步到 `deploy/mapletech.conf`。基于明确的 User-Agent 标识，不按国家、大学 IP、VPN 或未知时长封禁。
- Google/Bing 搜索索引与链接预览保持可访问，访问汇报仍过滤已识别机器人。仅请求首页和 favicon 不再确认有效访问；正常浏览器计时、PDF 请求保留；已有待发送会话也重新检查机器人标识。
- 规则仅用于 www HTTPS 的明确本站路径；默认/IP 虚拟主机、ACME、`/playground/`、其他应用及公共 snippet 未改动。9 项汇报测试通过，线上普通浏览器/搜索爬虫返回 200，扫描器返回 403。
- 安装脚本 `deploy/install-bot-guard.py` 会核对旧代码哈希、备份、执行 `nginx -t`、平滑 reload nginx、重启本站 `visit-notify` 并检查响应，失败自动回滚。成功备份：`/var/backups/mapletech/bot-guard-20261110T161056Z/`。脚本是本次一次性迁移，已安装后不能重复运行；SMTP 配置与会话库不覆盖。首次部署的即时探测早于 nginx 新 worker 接管，已自动回滚，随后补充等待生效检查并成功部署。
- User-Agent 可以伪装，此规则不能保证识别所有自动化；缺少计时仍不能单独判断为机器人。

## 日常速查：更新简历与部署到 TXyun

**在本地 PowerShell 中执行部署命令：**

```powershell
cd E:\personal_project\personal_web\site
npm run deploy
```

脚本自动构建、校验、上传新版本并切换正式站，保留上一版供回滚；发布后检查失败会自动恢复上一版。仅发布到 **TXyun / https://www.mapletech.top**，不更新 GitHub Pages，不修改 nginx 配置，也不重启其他服务。

运行前需具备本机 Node.js / npm、Python、项目依赖，以及 `C:\Users\maple\.codex\skills\ssh-skill\scripts` 中的 SSH 工具；本机 SSH 配置中的 `TXyun` 别名须可连接服务器。当前开发机已使用这套配置完成部署。

### 更新简历 PDF

先替换本地 `E:\personal_project\personal_web\site\public\cv\` 中对应文件，**保持文件名不变**，再运行上面的部署命令。

| 简历 | 文件名 |
|------|--------|
| 英文学术简历 | `Shizhao_Gao_CV_EN.pdf` |
| 中文学术简历 | `Shizhao_Gao_CV_ZH.pdf` |
| 产品经理简历 | `Shizhao_Gao_Product_Manager_ZH.pdf` |
| 视觉算法工程师简历 | `Shizhao_Gao_Vision_Engineer_ZH.pdf` |

仅替换项目根目录里的原始 PDF 不会更新网站，实际发布的是 `site/public/cv/` 中的副本。PDF 更新不会自动修改网页正文，正文需要在对应内容源中另行更新。

### 本地与服务器路径

| 用途 | 路径 |
|------|------|
| 本地项目源码 | `E:\personal_project\personal_web` |
| 本地部署命令执行目录 | `E:\personal_project\personal_web\site` |
| 本地静态构建产物 | `E:\personal_project\personal_web\site\dist` |
| TXyun 网站目录 | `/var/www/mapletech` |
| TXyun 在线简历目录 | `/var/www/mapletech/cv/` |
| TXyun 实际版本目录 | `/var/www/mapletech.releases/<版本时间>/` |
| TXyun nginx 站点配置 | `/etc/nginx/sites-available/mapletech` |

`/var/www/mapletech` 是指向当前版本的符号链接，部署后会更新指向。服务器存放的是静态构建产物，源码在本地维护。需要确认当前实际目录时，可在服务器终端执行只读命令：

```bash
readlink -f /var/www/mapletech
```

**Xftp 上传权限说明：**正式版本由 `root` 拥有，使用 `ubuntu` 登录 Xftp 时，直接覆盖网站中的 PDF 会因权限不足而失败。日常更新请使用“替换本地 PDF → `npm run deploy`”流程；只改服务器文件会在下次部署时被本地版本覆盖。

## 当前维护状态（2026-09-10）

- `www.mapletech.top` 已通过 ICP 备案。后续开发和部署以 **TXyun / https://www.mapletech.top** 为目标，不再更新 GitHub Pages 主页。
- HTTPS 名称不匹配问题已修复：此前域名返回的是服务器 IP 证书；现在使用独立的 Let's Encrypt 域名证书，SAN 为 `www.mapletech.top`，本次有效期至 **2026-12-09 12:12:39 UTC**。
- 域名证书位于 `/etc/letsencrypt/live/www.mapletech.top/`。本站 HTTP 页面自动 301 跳转到相同路径和查询参数的 HTTPS 地址；ACME 验证路径及 `/playground/` 保留原有 HTTP 行为。
- 原有 IP 证书、默认虚拟主机、`/playground/` 代理及其他应用服务保持原样。这里只新增了本站域名虚拟主机，并平滑加载 nginx。
- 本站独立续期任务为 `mapletech-cert-renew.timer` / `mapletech-cert-renew.service`，每天 04:20、16:20 后随机 15 分钟内运行，只处理 `www.mapletech.top`。网络失败时每 15 分钟重试，2 小时内最多启动 4 次。
- TXyun 直连 ACME 接口当前不通，因此本站续期进程使用已有的 `http://127.0.0.1:7890` 代理。代理服务及其配置未调整，原有 `snap.certbot.renew.timer` 也保留。成功续期后沿用已有 deploy hook 平滑加载 nginx。
- 本次 nginx 原配置备份位于 `/var/backups/mapletech/tls-20260910/`；本地对应配置保存在 `deploy/mapletech.conf` 和 `deploy/mapletech-cert-renew.*`。
- 验证结果：外网 HTTPS 证书链校验通过；中英文首页返回 200；HTTP 页面跳转保留路径和查询参数；原有 `/playground/`、8080、8787 的响应保持一致。已完成一次 **生产环境真实续签**，并确认 nginx 提供的新证书指纹与续签产物相同。测试环境的 `--dry-run` 曾遇到 ACME 连接中断和验证节点连接超时，未通过完整模拟；公网 ACME 路径已单独验证，续期任务保留重试机制。

仅检查本站续期状态：

```bash
systemctl list-timers --all mapletech-cert-renew.timer
systemctl status mapletech-cert-renew.service
journalctl -u mapletech-cert-renew.service
```

## 当前网站与发布方式

- **2026-11-10 学术页缓存校验修复**：用户反馈仍看到旧版；公网 `/academic/` HTML 的 SHA256 与当前构建完全一致，但此前没有明确的 Cache-Control。已仅在 www HTTPS 虚拟主机为 `/academic/`、`/academic/index.html`、`/academic/zh/`、`/academic/zh/index.html` 增加精确匹配的 `expires -1` 规则，返回 `Cache-Control: no-cache`，保留限流和继承的安全响应头。原配置备份于 `/var/backups/mapletech/academic-cache-20261110T142326Z/`，`nginx -t` 通过后平滑 reload；未改公共 snippet、其他服务和静态资源缓存。旧浏览器缓存需强制刷新一次或通过带版本参数的链接访问。修复脚本为 `deploy/fix-academic-cache.py`。
- **2026-11-10 内容扩充与实验结果直观展示已上线**：当前版本 `20261110T141851535Z`（UTC），目录 `/var/www/mapletech.releases/20261110T141851535Z`；回滚版本 `/var/www/mapletech.releases/20261110T140823158Z`。双语补充研究动机、技术实现、个人贡献与博士阶段探索路径。Experiments 删除基线和数据集下拉菜单：两种基线对比、RepCount / Countix 结果直接并列，手机端上下排列；三项研究仍可一键切换。构建、双语深浅主题、320–1440px、键盘、无 JS、打印及发布链接检查通过。
- **2026-11-10 已发布当前学术页与新版中英简历**：正式版本 `20261110T140823158Z`（UTC），当前目录 `/var/www/mapletech.releases/20261110T140823158Z`；回滚版本 `/var/www/mapletech.releases/20260922T012258835Z`。以下同日“本地更新／尚未部署”条目记录的是发布前的迭代，现已一并上线。发布脚本构建与站点检查通过；公网中英文学术页、深浅主题、手机布局、实验切换、章节导航与附录深链检查通过。首页、求职页、四份简历、robots、sitemap 返回 200，缺失页返回 404；未调整 nginx 或其他服务。
- 2026-11-10 修正学术页排版：统一章节标题与留白、限制长段落行宽；中等屏宽下研究路径改为行式布局、实验区改为上下排列；手机端简历按钮独占一行，研究与邮件链接在下一行对齐。调整论文元信息、在审列表、附录头像和标题的布局，横向目录自动显示当前章节。`check-research.mjs` 增加 `--layout` 截图诊断模式及活动章节可见性检查。本地构建与响应式验证通过，尚未部署。
- 2026-11-10 进一步调整为申请展示文案：删除首屏实验脚注及数字旁的脚注标记，移除实验区来源说明，将条件解释改为个人贡献。方法区突出设计、实现与实验推进；比较基线、论文署名和发表状态继续明确，完整实验条件保留在项目详情。双语同步，本地更新，尚未部署。
- 2026-11-10 按首屏快速判断的需求精简学术页：首屏优先显示姓名、2027 博士申请、VLM 研究定位、CVPR 2026 Findings 一作、Pattern Recognition 二作录用和测试时计算结果，再提供简历与联系入口。压缩摘要，移除重复标签、侧栏装饰和研究关系图；方法区改为文字行，实验与研究兴趣保留切换功能。主阅读文字约 17–18px，主要辅助文字至少 14px，提高深浅主题对比度。保留五章结构，仍为本地预览，尚未部署。
- 2026-11-10 学术页本地改为论文式阅读结构：Abstract → Introduction → Methodology → Experiments → Conclusion，另保留完整论文列表和可展开的背景、项目、工程与推荐材料。桌面侧边目录与移动端横向目录跟随章节；实验区可切换三项研究、比较基线及数据集，仅呈现简历和项目记录中的汇总结果。正文组织在 `data/academic-paper.ts` 与四个 `Paper*.astro` 组件；样式为 `styles/academic-paper.css`，交互为 `scripts/academic-paper.ts`；研究兴趣交互移入 Conclusion，旧 `#research` 锚点仍可用。附录内项目链接会自动展开，支持直接深链、键盘、无 JS 和打印。已检查中英文、深浅主题及 1440 / 768 / 375 / 320px；尚未部署。
- 2026-11-10 将根目录 `Statement of Research Interests.md` 改编融入中英文学术页：首屏与简介体现多模态表征学习和推理；研究区用表征／学习／计算三个可切换问题、联动关系图、已有工作来源及研究方法串联长期兴趣。正文与双语内容在 `profile.ts` 的 `researchInterests`，呈现在 `Research.astro`，专属样式和交互为 `styles/research.css`、`scripts/research.ts`。三个方向标注为博士阶段希望探索的问题，已有结果链接到对应项目；无 JS 时完整呈现所有方向，支持键盘、减少动画及打印。原始 Markdown 保留为内容依据，不作为网页附件。本条为本地更新记录，尚未部署。
- 2026-11-10 本地同步新版中英文学术简历：根目录中文源文件由 `Shizhao_Gao_CV_2027PHD.pdf` 统一命名为 `Shizhao_Gao_CV_ZH.pdf`，英文仍为 `Shizhao_Gao_CV_EN.pdf`；两份发布副本在 `site/public/cv/`，原下载地址保持不变。学术页同步测试时扩展研究（5 个数据集、9,015 个问题）、TWCRAC 的 Pattern Recognition 录用状态、IJCV 第一作者署名，以及科研工程与合作经历。入口主页同步学术摘要；论文统计为 2 篇已发表／录用、5 篇在审，另有 1 项研究稿件准备中。本条记录本地内容更新，不代表已部署。
- 2026-09-22 已发布访问汇总版本 `20260922T012258835Z`（UTC）；回滚版本为 `/var/www/mapletech.releases/20260911T052029426Z`。通知服务已从即时提醒改为访问结束后的会话摘要，详见下方“访问汇总 v2”。
- 2026-09-11 已发布页脚备案号、去 Astro 文案与主页波浪线交互版本 `20260911T052029426Z`（服务器 UTC 时间）；上一版位于 `/var/www/mapletech.releases/20260911T014957787Z`。中英入口、双语学术、求职及四份简历页面访问检查通过；公网已确认五个页面均显示备案号、页脚不再提及 Astro、入口主页波浪线为 Canvas。
- `/`：中文入口主页；`/en/`：英文入口主页。两页共用 `HomePage.astro`，内容源为 `home.ts`，互为 hreflang 翻译。可选择学术或求职，也可直接选择学术语言或求职岗位；页面顶部可切换语言与主题。右侧波浪线为 Canvas 绘制（`scripts/home-wave.ts`）：波长沿 x 轴渐变、波峰打点、持续缓慢流动，首次进入时从左到右画出；鼠标靠近时局部振幅放大、波形向指针弯曲，离开后平滑复原。减少动态效果时只画一帧且不响应指针；无 JS 时回退为静态 SVG。
- 入口主页与求职页复用学术页的设计系统（`global.css`：暗色优先、可切浅色、Instrument Serif + Inter、金色 / 青色强调色），三类页面视觉一致；主题偏好共用同一个 localStorage 键，跨页面保持。论文式布局样式仅用于学术页。
- `/academic/`：英文学术主页；`/academic/zh/`：中文学术主页。两页共用 `AcademicPage.astro`，当前内容源为 `profile.ts` 与 `academic.ts`。学术及求职页顶部姓名标识返回总主页。
- 旧 `/zh/` 用静态页面跳转到 `/academic/zh/`，保留查询参数和锚点。根路径无论是否携带旧章节锚点（如 `/#top`），都显示入口主页；不自动转去学术页。
- www HTTPS 虚拟主机仅对 `/` 和 `/index.html` 设置 `expires -1`，返回 `Cache-Control: no-cache`，使首页在后续访问时重新校验；保留安全响应头和原限流。其他路由、字体等静态资源缓存保持原策略。本次配置备份：`/var/backups/mapletech/home-entry-20260910T142400Z/mapletech.conf`，已通过 `nginx -t` 并平滑 reload。
- `/career/`：中文求职主页。`?role=product` 直达产品经理（AI / B 端），`?role=vision` 直达视觉算法工程师（视频理解 / 多模态）。学术页与求职页互不链接，只通过顶部姓名标识回到总主页分流；章节导航跟随当前岗位。
- 岗位切换：首屏下方是两张岗位卡组成的切换器（岗位名、一句定位、三项亮点数字），滚过导航栏后吸顶并收缩为紧凑态。吸顶盒的占位高度由脚本固定为展开高度，只有内部条收缩，避免与浏览器滚动锚定互相触发导致抖动；紧凑态文字上下等距。切换时高亮块滑动、整页强调色在金色与青色间平滑过渡，当前内容朝离开方向退场，新岗位的首屏文案、档案卡、指标与各章节依次入场，关键指标数字从 0 计数到位。支持键盘、快速连续操作、浏览器历史及减少动态效果设置。
- 每个岗位面板包含：首屏标语与快速档案卡（目标岗位、经验 / 代表成果、学历、院校、证书 / 部署）、四项关键指标、「为什么是我」三条个人优势、「岗位匹配」对照表（五条常见招聘要求与对应证据，可跳转到证据章节）、工作经历、项目实践、能力与背景、联系方式。产品经理先看工作经历，视觉算法先看项目。视觉算法方向含 Nano-TCC 端侧实时动作计数系统（Jetson Orin Nano、TensorRT FP16、端到端平均延迟 16.5 ms、峰值 41.0 FPS、4 小时压测）与端侧部署能力。
- 求职内容依据 `高世钊_产品经理简历.pdf` 与 `高世钊_视觉算法工程师简历.pdf`，维护于 `site/src/data/career.ts` 和 `career-roles.ts`；学术内容继续使用 `profile.ts`。
- 对外求职 PDF：`site/public/cv/Shizhao_Gao_Product_Manager_ZH.pdf`、`Shizhao_Gao_Vision_Engineer_ZH.pdf`。更新时分别替换对应文件。
- Astro、canonical、robots 与 sitemap 已统一为 `https://www.mapletech.top`，正式站允许收录。sitemap 包含中英入口、双语学术和求职五个页面，入口两页与学术两页各自互为翻译；旧 `/zh/` 不再收录。旧 GitHub Pages workflow 已移除，没有向 GitHub 推送。
- `site.icp` 已填入 `豫ICP备2026043356号-1`（2026-09-11），所有页面页脚显示并链接到工信部查询系统；页脚不再提及 Astro。构建校验会检查每个页面的备案号。

在 `site/` 中执行：

```powershell
npm run build # 含页面关系、资源、SEO、双简历、端侧成果与 ID 校验
node node_modules/astro/astro.js preview --host 127.0.0.1 --port 4323
node scripts/check-career.mjs http://127.0.0.1:4323 # 独立无头 Edge：中英入口、主题跨页、岗位切换与响应式检查
node scripts/check-research.mjs http://localhost:4321 # 学术页：双语、主题、目录、详情深链、响应式、无 JS、打印与撤下的推荐信
npm run deploy # 仅 TXyun，使用本机 ssh-skill 的 TXyun 别名
```

部署脚本先上传独立版本至 `/var/www/mapletech.releases/<版本时间>/`，再切换 `/var/www/mapletech` 链接；首次发布将旧静态目录保留为 `legacy-<版本时间>`。保留旧哈希资源以兼容缓存中的页面。切换后检查 HTTPS 页面、两份岗位简历、学术简历与 404；失败自动恢复上一版。整个内容发布流程不修改 nginx 配置、不操作其他服务。

如需手动回滚，使用 ssh-skill 上传 `site/scripts/release-site.py`，以 `sudo python3 <脚本路径> rollback /var/www/mapletech.releases/<上一版本>` 执行；上一版本目录由发布输出提供。只允许使用本站 releases 下的真实版本目录。

## 访问汇总 v2（2026-09-22）

访客连续 **5 分钟没有活动**后，通过原发件账号给 **gsz199911@163.com** 发送一封汇总邮件，包含首次访问、最后活动、会话跨度、前台可见时长、站内页面浏览顺序及各页时长、附件点击与 HTTP 文件请求。保留 IP、归属地、运营商和机构网络线索；机构线索不代表访客个人身份。

- 范围：中英入口、双语学术页、求职页；产品经理与视觉算法视图分别记录。附件包括四份简历和两份推荐信。不会读取访客在其他网站上的活动或表单输入；上报路径仅保留允许的岗位参数。
- 浏览器每 15 秒上报累计前台可见时间，隐藏或离开时补报；后台不累计，长时间休眠不按整段时间计入。以单个标签页的短期随机会话 ID 汇总；重新打开或静默超过 5 分钟可能形成新会话。
- 时长是估算，不代表专注阅读。禁用 JavaScript、阻止采集或网络中断可能导致缺失；无浏览器计时时标注“未知”，不会把最后一个页面虚构成固定停留时长。
- PDF 在线预览也会请求文件；同文件 60 秒内连续分段读取合为一组。邮件区分“点击”和“HTTP 文件请求”，不声称已完整下载或保存。多标签归属不明确时不强行把请求计入某个会话。
- 每日最多 40 封，超限摘要延后处理；会话及发送状态保留 7 天，重启继续处理。发送失败最多重试 6 轮，失败记录保留供排查。旧 `dedupe_hours` 不再控制新版摘要，避免同 IP 后续访问被吞掉；保留旧机房 IP 过滤设置，但它只是启发式过滤，可能漏掉使用代理的真实访客。

实现与维护路径：

| 用途 | 路径 |
|------|------|
| 浏览器采集源码 | `site/src/scripts/visit.js` |
| 构建时注入脚本 | `site/scripts/inject-visit.mjs`（由 `npm run build` 调用） |
| 公网采集入口 | `POST https://www.mapletech.top/_visit`，返回 204，无新增监听端口 |
| 服务入口 / 汇总逻辑 | `/opt/visit-notify/notify.py` / `sessions.py` |
| SMTP 配置 | `/opt/visit-notify/config.json`（原配置与凭据未更改） |
| 持久化会话、日志游标及发信状态 | `/opt/visit-notify/sessions.sqlite3`（600 权限，含 WAL 辅助文件） |
| 升级备份 | `/var/backups/mapletech/visit-notify-20260922-v2/` |

只读排查命令（服务器终端）：

```bash
systemctl status visit-notify --no-pager
journalctl -u visit-notify -n 50 --no-pager
```

本地验证：在项目根目录执行 `python -m unittest discover -s deploy/visit-notify -p test_sessions.py -v`；在 `site/` 中构建并启动 preview 后执行 `node scripts/check-visit.mjs`。浏览器测试拦截采集请求，不发送邮件。2026-09-22 已完成公网入库验证，并发送一封标题为“【升级测试】个人网站访问汇总”的模拟示例，SMTP 已接受。

采集脚本及简短统计说明只注入构建产物，不修改学术页源文件。`npm run dev` 不包含该注入步骤，请用 build + preview 验证。新增页面或附件时，同步更新注入路径和 `sessions.py` 的页面／附件白名单。

升级只为 www HTTPS 虚拟主机新增 `/_visit` 精确路由，公共 snippet 与全局 nginx 配置未改。nginx 通过配置检查后平滑 reload，只重启 `visit-notify`；其他服务保持运行。若要回滚通知功能，先恢复备份中的 `notify.py` 和 `mapletech.conf`，通过 `nginx -t` 后平滑 reload，再重启 `visit-notify`，并将静态站回滚到上述上一版本；保留新 SQLite 数据供排查。

## 以下为备案前的历史部署说明（截至 2026-08-28）

以下“主站”“镜像”“备案待通过”等描述记录旧状态；当前维护目标与证书状态以上一节为准。旧版曾使用一套源码发布到两个地方。

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

## 五、旧版访问邮件提醒（历史记录，现用上方 v2）

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
| **机房 IP** | **`ip-api` 的 `hosting` 字段为真则丢弃。高级爬虫会用无头浏览器加载 CSS 字体、骗过上一层，但骗不过 IP 归属——没有真人从 DigitalOcean 的实例上浏览网页。高校和企业网络永远不会被标为 hosting，不会误伤目标读者** |
| 去重 + 配额 | 同一 IP 在 `dedupe_hours`（默认 6h）内只提醒一次；每日 `daily_limit`（默认 40）封上限，保护 163 账号 |

实测效果：

```
只请求 /（伪造 Chrome UA）             → 丢弃（只取了 HTML，判定为机器人）
请求 / + CSS + 字体（同一 IP）          → 发出提醒
AWS / DigitalOcean / 腾讯云 等机房 IP   → 丢弃（hosting=true）
清华 CERNET 166.111.4.100            → 放行 ✅（教育网不会被标为 hosting）
```

`skip_hosting` 在 `config.json` 里可关（默认开）。

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

## 六、扫描流量与防护（为什么没上 Cloudflare）

公网 IP 上线即被全网扫描器发现，这是常态而非攻击。14.5 小时的实测：

| | |
|---|---|
| 总请求 | 2077，独立 IP 191 |
| **404（探测不存在的路径）** | **1783，占 86%** |
| 两个 Google Cloud IP | 1378 次，占 66% |
| 真实浏览器会话 | 约 18 次 |

### Cloudflare 在这里没用

**这些流量全部直接打 IP `122.51.4.253`，不经过域名。** Cloudflare 的防护建立在
DNS 代理之上——流量必须经由域名解析到 Cloudflare 才会被过滤。任何人知道源站 IP
就能完全绕过它。所以接入 Cloudflare 对当前这批流量的拦截率是 **0%**。

即便备案后把域名挂上 Cloudflare，源站 IP 仍然直接暴露，还需要把服务器防火墙
配成只接受 Cloudflare 回源 IP 段，才谈得上有效。

另外，人机验证（Turnstile / Managed Challenge）**必然会打断首次访问的真人**——
这正是它的工作方式。对一个面向潜在博导的学术主页来说，让对方先做一次验证码
是在赶客，得不偿失。

### 实际采取的措施（对真人完全无感）

```nginx
# conf.d/mapletech-limits.conf —— 限流区（http 上下文）
limit_req_zone  $binary_remote_addr zone=mapletech_req:10m rate=60r/m;
limit_conn_zone $binary_remote_addr zone=mapletech_conn:10m;

# snippets/mapletech-common.conf —— 探测路径直接断连
location ~* "\.(php|phtml|asp|aspx|jsp|cgi|bak|sql|env|ini|conf)$"  { access_log off; return 444; }
location ~* "^/(wp-|\.git|\.env|@vite|_profiler|actuator|cgi-bin/|…)" { access_log off; return 444; }
```

- `return 444` 直接断开连接、不返回任何字节，省带宽也降低扫描器对本机的兴趣
- 限流 60r/m：真人一次页面加载约 6 个请求，差两个数量级；扫描器会被削掉
- 这两类探测路径**不记日志**，access.log 体积下降约 86%，也不影响 visit-notify
  （它们不是子资源）

实测：`/`、`/zh/`、`/_astro/*`、`/fonts/*`、`/cv/*`、`/playground/` 全部 200；
`/wp-login.php`、`/.env`、`/@vite/env`、`/_profiler/phpinfo` 全部断连。

---

## 七、域名 www.mapletech.top 的现状

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

## 八、备案通过后：把域名切成主站

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

## 九、内容上需要确认的地方

- **在投论文只写了研究方向，没写标题**（按双盲评审惯例）。你的 CV 里是有完整标题的，
  网站是刻意不同步——如果希望网站也放标题，改 `profile.ts` 的 `underReview` 即可。
- **出生日期、手机号没有放到公开页面**（CV 里有），避免被爬虫抓取用于身份信息拼接。
- **成绩单没有公开**，也没有进入 Git 仓库（`.gitignore` 已排除根目录所有 PDF）。
- **⚠️ 两封推荐信已公开上站**（引文 + 完整 PDF 下载）。**发布前请务必征得李俊、李琦铭
  两位老师同意**——信件是他们署名的文字，且 PDF 里含两人的机构邮箱
  （`junli@fjirsm.ac.cn`、`qimingli@fjirsm.ac.cn`），公开后会被爬虫抓取。
  只想保留引文、不公开完整信件的话，删掉 `profile.ts` 里 `recommendations` 的
  `letter` 字段和 `site/public/letters/` 目录即可。
- 另需留意：部分博士项目要求推荐信由推荐人直接提交、申请人不得查阅，
  公开信件在某些招生流程里可能不合适，建议先确认目标项目的规定。
- 首屏 slogan、`identity.intro` 自述、各项目的「问题 / 方法 / 结果」叙述，
  是根据你的 CV 与附录改写的，**建议逐句过一遍**，确保语气和事实都符合你本人的表达。

---

## 十、目录结构

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
│   ├── public/                 # 字体、简历 PDF、推荐信、favicon、分享图
│   └── scripts/
│       ├── deploy.mjs          # 部署到腾讯云镜像（未纳入公开仓库）
│       ├── shoot.mjs           # 截图回归
│       └── diagnose.mjs        # 页面运行时诊断
├── deploy/                     # 服务器配置（未纳入公开仓库）
│   ├── mapletech*.conf         # nginx 站点配置
│   └── visit-notify/           # 访问邮件提醒（守护进程 + systemd 单元）
└── *.pdf / *.jpg               # 原始简历与照片素材（未纳入公开仓库）
```
