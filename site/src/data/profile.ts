/**
 * ============================================================================
 *  单一内容源 / Single source of content
 * ----------------------------------------------------------------------------
 *  全站中英文内容都在这个文件里。以后新增论文、项目、经历，只改这里即可，
 *  不需要动任何组件。改完运行 `npm run build && npm run deploy`。
 *
 *  All bilingual site content lives here. To add a publication / project /
 *  role, edit this file only — no component changes needed.
 * ============================================================================
 */

/** 一段中英文对照文本 / A single bilingual string. */
export type L = { en: string; zh: string };

/* ---------------------------------------------------------------- 站点基础 */

export const site = {
  url: 'https://www.mapletech.top',
  /** 用于 <html lang>、hreflang、OG locale */
  locales: { en: 'en', zh: 'zh-CN' },
  /**
   * ICP 备案号。备案通过后把号码填进来，页脚会自动显示并链接到工信部查询系统。
   * 留空则不显示。例如：'闽ICP备2026000000号-1'
   */
  icp: '',
  title: {
    en: 'Shizhao Gao — Video Understanding & Efficient Multimodal Inference',
    zh: '高世钊 — 视频理解与高效多模态推理',
  } satisfies L,
  description: {
    en: 'CVPR 2026 Findings first author and CVPR Compute Gold Star recipient. M.Eng. researcher in self-supervised temporal modeling, human-centric action analysis, and efficient video-language model inference — with four years of product and systems engineering behind it.',
    zh: 'CVPR 2026 Findings 独立一作，CVPR Compute Gold Star 获得者。研究自监督时序建模、人体动作分析与视频语言模型高效推理，并有四年产品与系统工程实践。',
  } satisfies L,
};

/* ------------------------------------------------------------------ 身份 */

export const identity = {
  name: { en: 'Shizhao Gao', zh: '高世钊' } satisfies L,
  /** 名字下方那一行 */
  tagline: {
    en: 'I study what video-language models actually need to <em>see</em> — and how to make them pay for only that.',
    zh: '我研究视频语言模型究竟需要<em>看见</em>多少——以及怎样让它只在必要处花算力。',
  } satisfies L,
  intro: {
    en: "M.Eng. candidate in Artificial Intelligence, jointly trained at the Quanzhou Institute of Equipment Manufacturing, Chinese Academy of Sciences. My research asks how far video understanding can go <strong>without labels</strong> and <strong>without waste</strong>: self-supervised temporal modeling that learns repetition structure on its own, and inference strategies that spend compute only where a model actually needs it. Right now I'm most interested in adaptive visual-token allocation, efficient multimodal reasoning, and whether efficiency gains actually <em>transfer</em> across video-language architectures under realistic compute budgets. Before returning to research I spent nearly two years as a product engineer shipping server platforms at enterprise scale — that engineering instinct still shapes how I build: reproducible pipelines, measured cost, honest negative results.",
    zh: '人工智能专业硕士研究生，中国科学院海西研究院泉州装备制造研究所联合培养。我的研究关心视频理解能在<strong>没有标注</strong>、<strong>没有浪费</strong>的前提下走多远：让模型自己学会重复结构的自监督时序建模，以及只在真正需要时才花算力的推理策略。目前最感兴趣的方向是自适应视觉 Token 分配、高效多模态推理，以及在真实算力预算下，效率收益究竟能否<em>迁移</em>到不同的视频语言模型架构上。读研之前，我做了近两年产品工程师，交付过企业级服务器平台——那段工程训练至今影响我做研究的方式：可复现的流程、算得清的成本、如实报告的负面结果。',
  } satisfies L,
  /** 头部身份标签 */
  chips: [
    { en: 'CVPR 2026 Findings · First Author', zh: 'CVPR 2026 Findings · 独立一作' },
    { en: 'CVPR Compute Gold Star · Top 5%', zh: 'CVPR Compute Gold Star · 前 5%' },
    { en: 'Chinese Academy of Sciences', zh: '中国科学院联合培养' },
  ] satisfies L[],
  location: { en: 'Quanzhou / Fuzhou, China', zh: '中国 · 泉州 / 福州' } satisfies L,
  /** 求职/申请状态，显示在页脚 CTA */
  availability: {
    en: 'Applying for Ph.D. positions starting 2027 · Open to research collaborations',
    zh: '正在申请 2027 年入学博士项目 · 欢迎科研合作',
  } satisfies L,
};

/* ------------------------------------------------------------------ 链接 */

export const links = {
  email: 'gsz1999@fafu.edu.cn',
  scholar: 'https://scholar.google.com/citations?user=5qjLbA0AAAAJ',
  github: 'https://github.com/maple1999',
  orcid: 'https://orcid.org/0009-0009-1131-3735',
  orcidId: '0009-0009-1131-3735',
  cv: {
    en: '/cv/Shizhao_Gao_CV_EN.pdf',
    zh: '/cv/Shizhao_Gao_CV_ZH.pdf',
  },
};

/* ------------------------------------------------------- 首屏关键数字 */

export const metrics = [
  {
    value: '8',
    label: { en: 'Papers', zh: '篇论文' } satisfies L,
    note: { en: '4 as first author', zh: '其中 4 篇独立一作' } satisfies L,
  },
  {
    value: '0.129',
    label: { en: 'MAE on RepCount', zh: 'RepCount MAE' } satisfies L,
    note: { en: 'Label-free SOTA, beats supervised', zh: '无标注 SOTA，超过监督基线' } satisfies L,
  },
  {
    value: '18.0%',
    label: { en: 'FLOPs saved', zh: 'FLOPs 节省' } satisfies L,
    note: { en: 'VideoLLM routing, near-baseline accuracy', zh: 'VideoLLM 路由，准确率接近基线' } satisfies L,
  },
  {
    value: '100+',
    label: { en: 'Engineering projects', zh: '个工程项目' } satisfies L,
    note: { en: 'Server platforms delivered, ¥30M orders', zh: '服务器平台交付，3000 万订单' } satisfies L,
  },
];

/* -------------------------------------------------------------- 研究方向 */

export const researchAreas = [
  {
    id: 'counting',
    index: '01',
    title: { en: 'Repetitive Action Counting', zh: '重复动作计数' } satisfies L,
    summary: {
      en: 'Teaching models to count repetitions with no count labels at all. Real motion speeds up and slows down mid-video, which quietly breaks the fixed-period assumption almost every prior method rests on. I model period adaptively across multiple temporal scales, so the structure of repetition is learned rather than assumed.',
      zh: '让模型在完全没有计数标注的情况下学会数重复。真实动作会在视频中途忽快忽慢，而几乎所有既有方法都默认周期固定——这个假设一旦失效，计数就崩了。我在多个时间尺度上自适应地建模周期，让重复结构被学出来，而不是被假设出来。',
    } satisfies L,
    keywords: ['Self-supervised learning', 'Temporal cycle consistency', 'Multi-scale modeling', 'Period adaptation'],
    keywordsZh: ['自监督学习', '时序循环一致性', '多尺度建模', '周期自适应'],
  },
  {
    id: 'skeleton',
    index: '02',
    title: { en: 'Skeleton-Based Action Understanding', zh: '骨架动作理解' } satisfies L,
    summary: {
      en: 'Skeleton representations inherit whatever the camera happened to be doing. I use gravity as a stable external reference to decouple viewpoint from motion semantics, and model anomaly as a <em>relational</em> property — because what makes one person\'s behaviour abnormal is usually the people around them.',
      zh: '骨架表示会把相机的姿态一并继承下来。我用重力方向作为稳定的外部参考，把视角与动作语义解耦；同时把异常建模为一种<em>关系</em>属性——因为一个人的行为是否异常，往往取决于他周围的人。',
    } satisfies L,
    keywords: ['View-robust recognition', 'Gravity-aware decoupling', 'Multi-person anomaly', 'Graph modeling'],
    keywordsZh: ['视角鲁棒识别', '重力感知解耦', '多人异常检测', '图建模'],
  },
  {
    id: 'videollm',
    index: '03',
    title: { en: 'Efficient Video-Language Inference', zh: '视频语言模型高效推理' } satisfies L,
    summary: {
      en: 'Most VideoLLM pipelines sample frames densely or on a fixed budget, with no evidence that the frames are <em>sufficient</em>. I measure minimum sufficient frame sets directly, then route uncertain examples to larger budgets — spending compute where the model is actually unsure, and reporting plainly where the strategy fails to transfer.',
      zh: '多数 VideoLLM 采用密集或固定预算的抽帧，却没有任何证据说明这些帧是否<em>足够</em>。我直接度量最小充分帧集，再把不确定的样本路由到更大的帧预算——算力花在模型真正拿不准的地方，同时如实报告这套策略在哪个模型上失效。',
    } satisfies L,
    keywords: ['Frame sufficiency', 'Confidence routing', 'Visual token masking', 'FLOP profiling'],
    keywordsZh: ['帧充分性', '置信度路由', '视觉 Token Masking', 'FLOP 分析'],
  },
];

/* --------------------------------------------------------------- 已发表 */

export const publications = [
  {
    year: '2026',
    venue: 'CVPR 2026 Findings',
    venueFull: { en: 'IEEE/CVF Conference on Computer Vision and Pattern Recognition', zh: 'IEEE/CVF 计算机视觉与模式识别会议' } satisfies L,
    title: 'Count What Repeats: Period-Adaptive Multi-Scale Consistency for Self-Supervised Repetitive Action Counting',
    authors: [
      { name: 'Shizhao Gao', me: true },
      { name: 'Jun Li', me: false },
      { name: 'Qiming Li', me: false, corresponding: true },
    ],
    role: { en: 'First author · Sole student author', zh: '独立一作 · 唯一学生作者' } satisfies L,
    summary: {
      en: 'A self-supervised framework that adapts to changing action periods instead of assuming a fixed one, combining multi-scale cycle consistency with an action-similarity objective and a multi-expert consensus counting stage. Reaches 0.129 MAE / 0.842 OBO on RepCount and 0.098 MAE / 0.879 OBO on Countix — outperforming prior supervised baselines while using no count annotations.',
      zh: '一个自监督框架：不再假设周期固定，而是自适应动作周期变化，将多尺度循环一致性、动作相似性目标与多专家共识计数流程结合。在 RepCount 上取得 0.129 MAE / 0.842 OBO，Countix 上取得 0.098 MAE / 0.879 OBO——在完全不使用计数标注的前提下超过既有监督基线。',
    } satisfies L,
    awards: [
      {
        en: 'CVPR Compute Gold Star — top 5% across Main Track and Findings, awarded for compute efficiency and reproducibility',
        zh: 'CVPR Compute Gold Star — 评选涵盖 Main Track 与 Findings，入选比例前 5%，表彰计算效率与可复现性',
      } satisfies L,
      { en: 'Poster presented at CVPR 2026, Denver, CO, USA', zh: '于 CVPR 2026（美国丹佛）展示论文海报' } satisfies L,
    ],
    resources: [
      { label: { en: 'Paper', zh: '论文' } satisfies L, href: 'https://openaccess.thecvf.com/content/CVPR2026F/papers/Gao_Count_What_Repeats_Period-Adaptive_Multi-Scale_Consistency_for_Self-Supervised_Repetitive_Action_CVPRF_2026_paper.pdf' },
    ],
  },
];

/* -------------------------------------------------------------- 在投论文
 *  按学术惯例与双盲政策，此处只列研究方向与投稿状态，不公开具体标题。
 *  Per double-blind policy, submissions are listed by direction and status
 *  only — titles are withheld until acceptance.
 * ------------------------------------------------------------------------ */

export const underReview = [
  {
    venue: 'IEEE TMC',
    venueFull: { en: 'IEEE Transactions on Mobile Computing', zh: 'IEEE Transactions on Mobile Computing' } satisfies L,
    tier: { en: 'CCF-A', zh: 'CCF-A · 中科院二区 Top' } satisfies L,
    topic: { en: 'Resource-aware on-device repetition sensing for mobile edge devices', zh: '面向移动边缘设备的资源感知端侧重复动作感知' } satisfies L,
    role: { en: 'First author · Sole student author', zh: '独立一作 · 唯一学生作者' } satisfies L,
    status: { en: 'Under review', zh: 'Under review' } satisfies L,
  },
  {
    venue: 'IJCV',
    venueFull: { en: 'International Journal of Computer Vision', zh: 'International Journal of Computer Vision' } satisfies L,
    tier: { en: 'CCF-A', zh: 'CCF-A' } satisfies L,
    topic: { en: 'Semantic-guided representation decoupling for self-supervised repetitive counting', zh: '面向自监督重复计数的语义引导表征解耦' } satisfies L,
    role: { en: 'Student co-author · Sole student author', zh: '学生二作 · 唯一学生作者' } satisfies L,
    status: { en: 'Under review', zh: 'Under review' } satisfies L,
  },
  {
    venue: 'AAAI 2027',
    venueFull: { en: 'AAAI Conference on Artificial Intelligence', zh: 'AAAI 人工智能大会' } satisfies L,
    tier: { en: 'CCF-A', zh: 'CCF-A' } satisfies L,
    topic: { en: 'View-robust skeleton action recognition', zh: '视角鲁棒的骨架动作识别' } satisfies L,
    role: { en: 'First author · Sole student author', zh: '独立一作 · 唯一学生作者' } satisfies L,
    status: { en: 'Under review', zh: '已投稿 · 审稿中' } satisfies L,
  },
  {
    venue: 'AAAI 2027',
    venueFull: { en: 'AAAI Conference on Artificial Intelligence', zh: 'AAAI 人工智能大会' } satisfies L,
    tier: { en: 'CCF-A', zh: 'CCF-A' } satisfies L,
    topic: { en: 'Multi-person skeleton anomaly detection', zh: '多人骨架异常检测' } satisfies L,
    role: { en: 'First author · Sole student author', zh: '独立一作 · 唯一学生作者' } satisfies L,
    status: { en: 'Under review', zh: '已投稿 · 审稿中' } satisfies L,
  },
  {
    venue: 'Pattern Recognition',
    venueFull: { en: 'Pattern Recognition', zh: 'Pattern Recognition' } satisfies L,
    tier: { en: 'JCR Q1', zh: '中科院一区 Top' } satisfies L,
    topic: { en: 'Temporal cycle consistency with dynamic thresholding for robust counting', zh: '结合动态阈值的时序循环一致性鲁棒计数' } satisfies L,
    role: { en: 'Student co-author', zh: '学生二作' } satisfies L,
    status: { en: 'Revision submitted', zh: '已返修' } satisfies L,
  },
  {
    venue: 'Pattern Recognition',
    venueFull: { en: 'Pattern Recognition', zh: 'Pattern Recognition' } satisfies L,
    tier: { en: 'JCR Q1', zh: '中科院一区 Top' } satisfies L,
    topic: { en: 'Global multi-geometric feature learning for repetitive counting', zh: '面向重复计数的全局多几何特征学习' } satisfies L,
    role: { en: 'Student co-author', zh: '学生二作' } satisfies L,
    status: { en: 'Revision submitted', zh: '已返修' } satisfies L,
  },
  {
    venue: 'IEEE TCSVT',
    venueFull: { en: 'IEEE Transactions on Circuits and Systems for Video Technology', zh: 'IEEE Transactions on Circuits and Systems for Video Technology' } satisfies L,
    tier: { en: 'JCR Q1', zh: '中科院一区 Top' } satisfies L,
    topic: { en: 'Flexible graph-based modeling with adaptive node interaction', zh: '自适应节点交互的柔性图建模' } satisfies L,
    role: { en: 'Student co-author', zh: '学生二作' } satisfies L,
    status: { en: 'Under review', zh: 'Under review' } satisfies L,
  },
];

/* ------------------------------------------------------------ 读博的理由
 *  全站唯一一段不谈成果、只谈动机的文字。放在「关于」之后、「联系」之前。
 * ------------------------------------------------------------------------ */

export const statement = {
  eyebrow: { en: 'Why a Ph.D.', zh: '为什么读博' } satisfies L,
  text: {
    en: "I'm not setting out to change the world. I would like to move <em>one field</em> — a little, and in the right direction — and leave behind work that other people can pick up and build on. That is the whole reason I want to do a Ph.D.",
    zh: '我没想过要改变世界。我希望能推动<em>一个领域</em>——哪怕只有一点，往好的方向——并留下一些别人能接着往下做的工作。这就是我想读博的全部理由。',
  } satisfies L,
};

/* ---------------------------------------------------------------- 科研项目 */

export const projects = [
  {
    id: 'period-adaptive',
    title: { en: 'Period-Adaptive Self-Supervised Repetitive Action Counting', zh: '周期自适应自监督重复动作计数' } satisfies L,
    kind: { en: "M.Eng. thesis project · Lead", zh: '硕士学位论文课题 · 主要完成人' } satisfies L,
    period: { en: 'Sep 2024 — Present', zh: '2024.09 — 至今' } satisfies L,
    accent: 'gold',
    problem: {
      en: 'Prior repetitive-counting methods assume a fixed period per video. Real actions accelerate and decelerate mid-sequence, so that assumption fails exactly where counting matters most — and most methods additionally require dense count annotations.',
      zh: '既有重复计数方法默认单个视频内周期固定。真实动作会在序列中途加速或减速，这个假设恰恰在最需要准确计数的地方失效；同时多数方法还依赖密集的计数标注。',
    } satisfies L,
    approach: {
      en: 'Period-adaptive multi-scale temporal cycle consistency paired with an action-similarity objective, learning repetition structure from unlabeled skeleton sequences, and a multi-expert consensus stage that turns learned structure into a count.',
      zh: '周期自适应的多尺度时序循环一致性，配合动作相似性目标，从无标注骨架序列中学习重复结构；再由多专家共识流程把学到的结构转换为计数结果。',
    } satisfies L,
    results: [
      { k: 'RepCount', v: '0.129 MAE · 0.842 OBO' },
      { k: 'Countix', v: '0.098 MAE · 0.879 OBO' },
    ],
    outcome: {
      en: 'Published at CVPR 2026 Findings and awarded a CVPR Compute Gold Star. I led problem formulation, method design, the full PyTorch implementation, all experiments and ablations, and the manuscript.',
      zh: '成果发表于 CVPR 2026 Findings，并获 CVPR Compute Gold Star。我主导了问题定义、方法设计、完整 PyTorch 实现、全部实验与消融分析及论文撰写。',
    } satisfies L,
    resources: [
      { label: { en: 'Read the paper', zh: '阅读论文' } satisfies L, href: 'https://openaccess.thecvf.com/content/CVPR2026F/papers/Gao_Count_What_Repeats_Period-Adaptive_Multi-Scale_Consistency_for_Self-Supervised_Repetitive_Action_CVPRF_2026_paper.pdf' },
    ],
  },
  {
    id: 'frame-sufficiency',
    title: { en: 'Frame Sufficiency & Adaptive Routing for VideoLLMs', zh: '视频语言模型的帧充分性与自适应路由' } satisfies L,
    kind: { en: 'Independent research · Open source', zh: '独立研究 · 开源项目' } satisfies L,
    period: { en: '2026', zh: '2026' } satisfies L,
    accent: 'teal',
    problem: {
      en: 'VideoLLM evaluation samples frames densely or on a fixed budget. Nobody checks whether those frames are sufficient — so compute is spent uniformly on questions of wildly different difficulty.',
      zh: 'VideoLLM 评测普遍采用密集或固定预算抽帧，却没人验证这些帧是否充分——结果是难度差异极大的问题，算力却被均匀地平摊了。',
    } satisfies L,
    approach: {
      en: 'Measured minimum sufficient frame sets across 1,336 LongVideoBench validation examples on Qwen2.5-VL and LLaVA-Video, then built visual-token masking, answer-option scoring, and nested confidence routing that escalates only uncertain examples to larger frame budgets.',
      zh: '在 1,336 个 LongVideoBench 验证样本上，对 Qwen2.5-VL 与 LLaVA-Video 度量最小充分帧集，并设计视觉 Token Masking、答案选项评分与嵌套置信度路由——只把不确定的样本升级到更大的帧预算。',
    } satisfies L,
    results: [
      { k: 'Qwen2.5-VL', v: '−18.0% FLOPs, near-baseline accuracy' },
      { k: 'LLaVA-Video', v: 'Did not transfer — reported as a limit' },
    ],
    outcome: {
      en: 'Shipped as a reproducible package: model adapters, automated tests, CI, sanitized experiment artifacts, and full data/licensing documentation. The negative transfer result is reported as prominently as the positive one — a cross-model boundary is a finding, not a failure.',
      zh: '以可复现工程包交付：模型适配器、自动化测试、CI、脱敏实验产物与完整的数据/许可证说明。跨模型未迁移的结论与正面结果同等醒目地呈现——适用边界本身就是一个发现，而不是一次失败。',
    } satisfies L,
    resources: [
      { label: { en: 'View on GitHub', zh: '查看仓库' } satisfies L, href: 'https://github.com/maple1999/frame-sufficiency-video-vlms' },
    ],
  },
  {
    id: 'skeleton',
    title: { en: 'Skeleton-Based Action Understanding', zh: '骨架动作理解' } satisfies L,
    kind: { en: 'CAS Project 2024QZC001R · Core member', zh: '中科院项目 2024QZC001R · 核心成员' } satisfies L,
    period: { en: 'Sep 2024 — Present', zh: '2024.09 — 至今' } satisfies L,
    accent: 'violet',
    problem: {
      en: 'Skeleton action representations are entangled with the camera coordinate frame, so recognition degrades under viewpoint change. And multi-person anomaly detection typically scores each person in isolation, discarding the social context that defines abnormality.',
      zh: '骨架动作表示与相机坐标系纠缠在一起，视角一变识别性能就下降；而多人异常检测通常孤立地评估每个人，丢掉了真正定义"异常"的社会情境。',
    } satisfies L,
    approach: {
      en: 'Gravity-aware view decoupling with adaptive feature modulation to strip camera dependence while preserving motion semantics; and gated, dynamic inter-person dependency modeling so that social context can shape the anomaly score.',
      zh: '用重力感知的视角解耦与自适应特征调制，剥离相机依赖同时保留动作语义；并对人与人之间的依赖关系做门控动态建模，让社会情境参与异常判定。',
    } satisfies L,
    results: [
      { k: { en: 'Contribution', zh: '承担工作' }, v: { en: 'Shared preprocessing, spatiotemporal representation, training & evaluation pipelines', zh: '共享预处理、时空表征、训练与评测流程' } },
    ],
    outcome: {
      en: 'The two methodological directions led to two AAAI 2027 submissions, both as first author.',
      zh: '两条方法路线形成两篇 AAAI 2027 投稿，均为独立一作。',
    } satisfies L,
    resources: [],
  },
];

/* ------------------------------------------------------ 工程与产品经历 */

export const engineering = {
  intro: {
    en: 'Before research, I shipped. Nearly two years as a product engineer on enterprise server platforms, then a product-management stint on a bank financial-guarantee system, and a student software company I ran through my undergraduate degree. That background is why my research ships with tests, CI, and a cost model rather than a folder of scripts.',
    zh: '做研究之前，我先做交付。近两年企业级服务器平台产品工程师，之后是银行电子保函系统的产品经理实习，本科期间还带过一家学生软件公司。正因如此，我的科研代码交付时带着测试、CI 和成本模型，而不是一堆散落的脚本。',
  } satisfies L,
  roles: [
    {
      org: { en: 'Wuhan Yangtze Computing Technology', zh: '武汉长江计算科技有限公司' } satisfies L,
      title: { en: 'Product Engineer', zh: '产品工程师' } satisfies L,
      period: { en: 'Jun 2022 — Jan 2024', zh: '2022.06 — 2024.01' } satisfies L,
      points: [
        {
          en: 'Translated customer technical specifications into server configurations, product adaptation plans, validation programs, and delivery schemes across <strong>100+ enterprise and public-sector projects</strong>.',
          zh: '将客户技术规范转化为服务器配置、产品适配方案、验证计划与交付方案，累计参与 <strong>100 余个企业与公共部门项目</strong>。',
        } satisfies L,
        {
          en: 'Led compatibility validation and system integration for high-density computing platforms, coordinating R&D, supply chain, quality, manufacturing, and sales.',
          zh: '主导高密度计算平台的兼容性验证与系统集成，协调研发、供应链、质量、生产与销售团队。',
        } satisfies L,
        {
          en: 'The platform I drove through product introduction reached <strong>¥30M in initial order volume</strong>.',
          zh: '主导导入的产品线在上线初期获得 <strong>3,000 万元订单</strong>。',
        } satisfies L,
      ],
      tags: ['Server platforms', 'System integration', 'Hardware validation', 'Cross-team delivery'],
      tagsZh: ['服务器平台', '系统集成', '硬件验证', '跨团队交付'],
    },
    {
      org: { en: 'Fujian Tianhe Zhongcheng Technology', zh: '福建天和众诚科技发展有限公司' } satisfies L,
      title: { en: 'Product Manager (Intern)', zh: '产品经理实习生' } satisfies L,
      period: { en: 'Oct 2024 — Apr 2025', zh: '2024.10 — 2025.04' } satisfies L,
      points: [
        {
          en: 'Designed process flows, business rules, role-permission models, and exception handling for a <strong>bank electronic financial-guarantee product</strong>, converting business needs into structured requirements, functional boundaries, and acceptance criteria.',
          zh: '负责<strong>银行电子保函产品</strong>的流程、业务规则、角色权限与异常场景设计，将业务需求转化为结构化需求、功能边界与验收标准。',
        } satisfies L,
        {
          en: 'Coordinated product, engineering, and business teams through design review, integration testing, acceptance, and launch — <strong>delivered one month ahead of schedule with no major production defects</strong>.',
          zh: '协调产品、研发与业务团队完成方案评审、联调、验收与上线推进——<strong>项目提前 1 个月交付，且未出现重大线上缺陷</strong>。',
        } satisfies L,
      ],
      tags: ['Requirements design', 'FinTech', 'Access control', 'Release management'],
      tagsZh: ['需求设计', '金融科技', '权限模型', '上线管理'],
    },
    {
      org: { en: 'Jiuli (Wuhan) Software — student venture', zh: '九黎（武汉）软件开发公司 · 学生创业团队' } satisfies L,
      title: { en: 'Founder & Lead', zh: '总负责人' } satisfies L,
      period: { en: '2018 — 2022', zh: '2018 — 2022' } satisfies L,
      points: [
        {
          en: 'Ran an on-campus software venture end to end: sourcing and scoping outsourced projects, allocating the team, and shipping <strong>mini-programs, websites, and management systems</strong> as a hands-on developer.',
          zh: '完整运营校内软件创业团队：承接与拆解外包项目、统筹人力分工，并作为开发者参与<strong>小程序、网站与管理系统</strong>的实现交付。',
        } satisfies L,
      ],
      tags: ['Full-stack', 'Mini-program', 'Team leadership', 'Client delivery'],
      tagsZh: ['全栈开发', '小程序', '团队管理', '客户交付'],
    },
  ],
  /** 科研工程能力（区别于业务工程） */
  infra: {
    title: { en: 'Research Engineering & Infrastructure', zh: '科研工程与基础设施' } satisfies L,
    points: [
      {
        en: 'Maintain shared laboratory GPU servers and allocate compute across concurrent projects — scheduling, environment isolation, and failure triage for the whole group.',
        zh: '负责实验室共享 GPU 服务器运维与跨项目算力分配——任务调度、环境隔离与故障排查。',
      } satisfies L,
      {
        en: 'Build reproducible training and evaluation pipelines end to end: containerized environments, automated tests, CI, versioned experiment artifacts, and licensing documentation.',
        zh: '端到端构建可复现的训练与评测流程：容器化环境、自动化测试、CI、版本化实验产物与许可证说明。',
      } satisfies L,
      {
        en: 'Deploy models to resource-constrained edge hardware via ONNX and TensorRT, with explicit FLOP and latency budgets — the engineering core of the on-device sensing work under review at IEEE TMC.',
        zh: '通过 ONNX 与 TensorRT 将模型部署到资源受限的边缘硬件，并设定明确的 FLOP 与时延预算——这是 IEEE TMC 在投端侧感知工作的工程内核。',
      } satisfies L,
      {
        en: 'This site is part of that habit: statically generated, bilingual, self-hosted on a Tencent Cloud VM behind nginx, deployed by a single scripted command.',
        zh: '这个网站本身也是这种习惯的一部分：静态生成、中英双语、自托管于腾讯云并由 nginx 提供服务，一条脚本命令完成部署。',
      } satisfies L,
    ],
  },
};

/* ---------------------------------------------------------------- 技能栈 */

export const skills = [
  {
    group: { en: 'Video & Multimodal Models', zh: '视频与多模态模型' } satisfies L,
    items: ['Qwen2.5-VL', 'LLaVA-Video', 'InternVL', 'Transformers', 'LongVideoBench', 'Frame scaling', 'Confidence routing', 'FLOP profiling'],
  },
  {
    group: { en: 'Deep Learning & Vision', zh: '深度学习与视觉' } satisfies L,
    items: ['PyTorch', 'MMAction2', 'OpenCV', 'NumPy', 'Pandas', 'Self-supervised learning', 'Temporal modeling', 'Pose & skeleton analysis'],
  },
  {
    group: { en: 'Systems & Deployment', zh: '系统与部署' } satisfies L,
    items: ['Python', 'C++', 'Linux', 'Git', 'Docker', 'CUDA', 'ONNX', 'TensorRT', 'nginx', 'CI/CD'],
  },
  {
    group: { en: 'Product & Delivery', zh: '产品与交付' } satisfies L,
    items: ['Requirements engineering', 'Technical specification', 'Acceptance testing', 'Cross-team coordination', 'Full-stack web', 'Mini-program'],
  },
];

/* ---------------------------------------------------------------- 教育 */

export const education = [
  {
    school: { en: 'Fujian Agriculture and Forestry University', zh: '福建农林大学' } satisfies L,
    joint: { en: 'Jointly trained at the Quanzhou Institute of Equipment Manufacturing, Haixi Institute, Chinese Academy of Sciences', zh: '中国科学院海西研究院泉州装备制造研究所联合培养' } satisfies L,
    degree: { en: 'M.Eng. in Artificial Intelligence', zh: '人工智能 · 工程硕士' } satisfies L,
    dept: { en: 'College of Mechanical and Electrical Engineering', zh: '机电工程学院' } satisfies L,
    period: { en: 'Sep 2024 — Jun 2027 (expected)', zh: '2024.09 — 2027.06（预计）' } satisfies L,
    location: { en: 'Fuzhou / Quanzhou, China', zh: '中国 · 福州 / 泉州' } satisfies L,
    detail: {
      en: 'Thesis: <em>Research on Weakly Supervised Repetitive Action Counting Methods Based on Action Similarity</em>. Advisors: Prof. Jun Li and Assoc. Prof. Qiming Li. Ranked top 10% in comprehensive assessment.',
      zh: '学位论文：《基于动作相似性的弱监督重复动作计数方法研究》。导师：李俊研究员、李琦铭副研究员。综测专业前 10%。',
    } satisfies L,
  },
  {
    school: { en: 'South-Central Minzu University', zh: '中南民族大学' } satisfies L,
    joint: null,
    degree: { en: 'B.Eng. in Software Engineering', zh: '软件工程 · 工学学士' } satisfies L,
    dept: { en: 'School of Computer Science', zh: '计算机科学学院' } satisfies L,
    period: { en: 'Sep 2018 — Jun 2022', zh: '2018.09 — 2022.06' } satisfies L,
    location: { en: 'Wuhan, China', zh: '中国 · 武汉' } satisfies L,
    detail: {
      en: 'Ranked top 10% in comprehensive assessment. Multiple academic scholarships; provincial awards in the "Internet+" and "Challenge Cup" innovation competitions. Led an on-campus software venture throughout the degree.',
      zh: '综测专业前 10%。多次获学业奖学金；获"互联网+"省级三等奖、"挑战杯"省级三等奖。本科期间全程负责校内软件创业团队。',
    } satisfies L,
  },
];

/* ------------------------------------------------------------ 荣誉与服务 */

export const honors = [
  { year: '2026', text: { en: 'CVPR Compute Gold Star — top 5% across Main Track and Findings', zh: 'CVPR Compute Gold Star — 涵盖 Main Track 与 Findings，入选前 5%' } satisfies L, highlight: true },
  { year: '2025', text: { en: 'Academic Scholarship, Chinese Academy of Sciences', zh: '中国科学院学业奖学金' } satisfies L, highlight: false },
  { year: '2025', text: { en: 'Third Prize, "Huawei Cup" China Graduate Mathematical Contest in Modeling — Team Leader', zh: '"华为杯"中国研究生数学建模竞赛全国三等奖 — 队长' } satisfies L, highlight: false },
  { year: '2018–2022', text: { en: 'Undergraduate academic scholarships; provincial third prizes in "Internet+" and "Challenge Cup"', zh: '本科学业奖学金多次；"互联网+"、"挑战杯"省级三等奖' } satisfies L, highlight: false },
];

export const service = [
  {
    title: { en: 'Peer Review', zh: '同行评审' } satisfies L,
    text: { en: 'Reviewer for <em>Image and Vision Computing</em>, 2026.', zh: '担任 <em>Image and Vision Computing</em> 期刊审稿人，2026。' } satisfies L,
  },
  {
    title: { en: 'Undergraduate Mentoring', zh: '本科生指导' } satisfies L,
    text: { en: 'Mentored capstone thesis students through problem scoping, method selection, experiment planning, and technical writing.', zh: '指导本科毕业设计，协助完成研究问题拆解、方法选择、实验规划与论文写作。' } satisfies L,
  },
  {
    title: { en: 'Intern Supervision', zh: '实习生指导' } satisfies L,
    text: { en: 'Supervised interns on research software development and conference-paper preparation — task decomposition, coding milestones, experimental reporting, manuscript feedback.', zh: '指导实习生进行科研代码开发与会议论文撰写——任务拆解、编码里程碑、实验汇报与稿件反馈。' } satisfies L,
  },
  {
    title: { en: 'Lab Infrastructure', zh: '实验室基础设施' } satisfies L,
    text: { en: 'Maintain shared GPU servers and coordinate compute allocation across the group, keeping team workflows reproducible.', zh: '负责实验室共享 GPU 服务器运维与算力分配协调，保障团队工作流可复现。' } satisfies L,
  },
];

/* ---------------------------------------------------------------- 证书 */

export const certifications = [
  { en: 'Software Design Engineer — China Computer Technology and Software Professional Qualification (Intermediate)', zh: '软件设计师 — 计算机技术与软件专业技术资格（软考中级）' } satisfies L,
  { en: 'English — professional working proficiency in technical documentation, academic reading and research writing', zh: '英语 — 具备技术文档、学术阅读与科研写作的专业工作能力' } satisfies L,
];

/* -------------------------------------------------------------- 界面文案 */

export const ui = {
  nav: [
    { id: 'research', en: 'Research', zh: '研究' },
    { id: 'publications', en: 'Publications', zh: '论文' },
    { id: 'projects', en: 'Projects', zh: '项目' },
    { id: 'engineering', en: 'Engineering', zh: '工程' },
    { id: 'about', en: 'About', zh: '关于' },
  ],
  sections: {
    research: {
      eyebrow: { en: 'Research', zh: '研究' } satisfies L,
      title: { en: 'Three questions I keep returning to', zh: '我反复回到的三个问题' } satisfies L,
    },
    publications: {
      eyebrow: { en: 'Publications', zh: '论文' } satisfies L,
      title: { en: 'Selected publications', zh: '代表性论文' } satisfies L,
      publishedLabel: { en: 'Published', zh: '已发表' } satisfies L,
      underReviewLabel: { en: 'Under review & revision', zh: '在投与返修' } satisfies L,
      underReviewNote: {
        en: 'Titles are withheld while under review, in line with double-blind policy. Full details available on request or in my CV.',
        zh: '依照双盲评审惯例，在投论文暂不公开具体标题。完整信息可查阅简历或来信索取。',
      } satisfies L,
      scholarCta: { en: 'All publications on Google Scholar', zh: '在 Google Scholar 查看全部论文' } satisfies L,
    },
    projects: {
      eyebrow: { en: 'Projects', zh: '项目' } satisfies L,
      title: { en: 'Work in depth', zh: '深入的工作' } satisfies L,
      problemLabel: { en: 'The problem', zh: '问题' } satisfies L,
      approachLabel: { en: 'Approach', zh: '方法' } satisfies L,
      outcomeLabel: { en: 'Outcome', zh: '结果' } satisfies L,
    },
    engineering: {
      eyebrow: { en: 'Engineering', zh: '工程' } satisfies L,
      title: { en: 'Not only a researcher', zh: '不只是一个研究者' } satisfies L,
    },
    about: {
      eyebrow: { en: 'About', zh: '关于' } satisfies L,
      title: { en: 'Background', zh: '背景' } satisfies L,
      educationLabel: { en: 'Education', zh: '教育背景' } satisfies L,
      honorsLabel: { en: 'Honors & Awards', zh: '荣誉与奖项' } satisfies L,
      serviceLabel: { en: 'Service & Mentoring', zh: '学术服务与指导' } satisfies L,
      skillsLabel: { en: 'Technical Skills', zh: '技术能力' } satisfies L,
      certLabel: { en: 'Certifications & Languages', zh: '证书与语言' } satisfies L,
    },
    contact: {
      eyebrow: { en: 'Contact', zh: '联系' } satisfies L,
      title: { en: 'Get in touch', zh: '取得联系' } satisfies L,
      body: {
        en: 'I read every email. If you are a prospective advisor, a collaborator, or simply curious about the work, write to me directly.',
        zh: '每一封邮件我都会读。无论你是潜在的导师、合作者，还是单纯对这些工作感兴趣，都欢迎直接来信。',
      } satisfies L,
    },
  },
  actions: {
    downloadCv: { en: 'Download CV', zh: '下载简历' } satisfies L,
    email: { en: 'Email me', zh: '发送邮件' } satisfies L,
    scholar: { en: 'Google Scholar', zh: 'Google Scholar' } satisfies L,
    github: { en: 'GitHub', zh: 'GitHub' } satisfies L,
    orcid: { en: 'ORCID', zh: 'ORCID' } satisfies L,
    switchLang: { en: '中文', zh: 'EN' } satisfies L,
    switchLangTitle: { en: '切换到中文', zh: 'Switch to English' } satisfies L,
    toggleTheme: { en: 'Toggle theme', zh: '切换主题' } satisfies L,
    backToTop: { en: 'Back to top', zh: '回到顶部' } satisfies L,
    scrollHint: { en: 'Scroll', zh: '向下滚动' } satisfies L,
  },
  footer: {
    built: {
      en: 'Designed and built by Shizhao Gao. Statically generated with Astro, self-hosted behind nginx.',
      zh: '由高世钊设计并开发。Astro 静态生成，nginx 自托管。',
    } satisfies L,
    rights: { en: 'All rights reserved.', zh: '保留所有权利。' } satisfies L,
  },
};
