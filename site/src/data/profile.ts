/**
 * ============================================================================
 *  单一内容源 / Single source of content
 * ----------------------------------------------------------------------------
 *  学术页中英文内容在这个文件里。以后新增论文、项目、经历，只改这里即可，
 *  不需要动任何组件。改完运行 `npm run build && npm run deploy`。
 *
 *  Bilingual academic content lives here. To add a publication / project /
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
   * ICP 备案号。页脚自动显示并链接到工信部查询系统；留空则不显示。
   * 2026-09-11 取得：豫ICP备2026043356号-1
   */
  icp: '豫ICP备2026043356号-1',
  title: {
    en: 'Shizhao Gao — Multimodal Representation Learning & Reasoning',
    zh: '高世钊 — 多模态表征学习与推理',
  } satisfies L,
  description: {
    en: 'M.Eng. candidate interested in multimodal representation learning and reasoning, building on temporal modeling and efficient video-language understanding. CVPR 2026 Findings first author and CVPR Compute Gold Star recipient.',
    zh: '人工智能硕士研究生，关注多模态表征学习与推理，研究基础涵盖时序建模与高效视频语言理解。CVPR 2026 Findings 独立一作，获 CVPR Compute Gold Star。',
  } satisfies L,
};

/* ------------------------------------------------------------------ 身份 */

export const identity = {
  name: { en: 'Shizhao Gao', zh: '高世钊' } satisfies L,
  /** 名字下方那一行 */
  tagline: {
    en: 'How do multimodal models turn information into <em>understanding</em>?',
    zh: '多模态模型如何把信息转化为<em>理解</em>？',
  } satisfies L,
  intro: {
    en: 'M.Eng. candidate in Artificial Intelligence at Fujian Agriculture and Forestry University, jointly trained at the Quanzhou Institute of Equipment Manufacturing, Haixi Institute, Chinese Academy of Sciences, with expected graduation in June 2027. My background is in <strong>temporal representation learning and efficient video-language understanding</strong>: self-supervised repetitive action counting, test-time computation, and visual evidence selection. These experiences motivate my broader interest in how multimodal models represent, integrate, and reason over information. During my Ph.D., I hope to deepen my understanding of learning, model design, and reasoning, developing methods whose benefits extend across architectures and contexts.',
    zh: '福建农林大学人工智能专业硕士研究生，中国科学院海西研究院泉州装备制造研究所联合培养，预计 2027 年 6 月毕业。研究基础是<strong>时序表征学习与高效视频语言理解</strong>，包括自监督重复动作计数、测试时计算和视觉证据选择。这些经历让我进一步关注多模态模型如何表征、整合并利用信息进行推理。博士阶段，我希望深入研究学习机制、模型设计与推理，探索能够跨架构、跨情境迁移的方法。',
  } satisfies L,
  /** 头部身份标签 */
  chips: [
    { en: 'CVPR 2026 Findings · First Author', zh: 'CVPR 2026 Findings · 独立一作' },
    { en: 'CVPR Compute Gold Star', zh: 'CVPR Compute Gold Star' },
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
    value: '2',
    label: { en: 'Published / accepted', zh: '篇已发表 / 录用' } satisfies L,
    note: { en: '5 more under review', zh: '另有 5 篇在审' } satisfies L,
  },
  {
    value: '0.129',
    label: { en: 'MAE on RepCount', zh: 'RepCount MAE' } satisfies L,
    note: { en: 'Label-free SOTA, beats supervised', zh: '无标注 SOTA，超过监督基线' } satisfies L,
  },
  {
    value: '+3.15',
    label: { en: 'Accuracy gain (pp)', zh: '准确率提升（百分点）' } satisfies L,
    note: { en: 'vs. uniform sampling, similar token cost', zh: '相比均匀采样，输入 Token 成本接近' } satisfies L,
  },
  {
    value: '9,015',
    label: { en: 'Video QA questions', zh: '个视频问答问题' } satisfies L,
    note: { en: 'Evaluated across 5 video datasets', zh: '覆盖 5 个视频数据集' } satisfies L,
  },
];

/* -------------------------------------------------------------- 研究方向 */

/** Editorial adaptation of Statement of Research Interests.md, not a claim of completed work. */
export const researchInterests = {
  introduction: {
    en: 'My long-term interest is multimodal representation learning and reasoning: how models organize information, acquire useful structure, and use it reliably across changing contexts.',
    zh: '我的长期兴趣是多模态表征学习与推理：模型如何组织信息、习得有用的结构，并在变化的情境中可靠地运用它们。',
  } satisfies L,
  question: {
    en: 'Beyond what a model sees, what determines <em>what it understands</em>?',
    zh: '除了让模型看见什么，还有什么决定了<em>它能理解什么</em>？',
  } satisfies L,
  status: { en: 'Questions for my Ph.D.', zh: '博士阶段希望探索的问题' } satisfies L,
  diagramLabel: { en: 'Representations, learning and computation shape reasoning together.', zh: '表征、学习与计算，共同塑造推理能力。' } satisfies L,
  reasoning: { en: 'Reasoning', zh: '推理' } satisfies L,
  connection: { en: 'Three connected directions', zh: '三个相互关联的方向' } satisfies L,
  explore: { en: 'Explore a question', zh: '展开一个研究问题' } satisfies L,
  inquiryLabel: { en: 'What I want to understand', zh: '我想理解' } satisfies L,
  approachLabel: { en: 'How I hope to investigate', zh: '我希望如何探索' } satisfies L,
  directions: [
    {
      id: 'representation', number: '01', accent: 'gold',
      label: { en: 'Representation', zh: '表征' } satisfies L,
      tabLabel: { en: 'Represent', zh: '表征' } satisfies L,
      title: { en: 'What information survives?', zh: '什么信息被保留下来？' } satisfies L,
      summary: { en: 'Reasoning depends on relationships, temporal dependencies, and change. I want to understand how visual and linguistic representations preserve and organize this structure.', zh: '推理依赖关系、时序依赖与变化。我想理解视觉和语言表征如何保留并组织这些结构。' } satisfies L,
      inquiry: { en: 'What is retained or lost as inputs are processed, and how do visual and linguistic information interact?', zh: '输入经过处理后，什么被保留、什么被丢失？视觉与语言信息又如何在内部表征中交互？' } satisfies L,
      approach: { en: 'Investigate structured or adaptive representations, starting with temporal relationships and changes in video. I would compare what different representations retain and how interventions affect reasoning, then examine whether those benefits transfer across tasks and models.', zh: '从视频中的时序关系与变化入手，探索结构化或自适应表征。我希望比较不同表征保留了哪些信息、对其进行干预后推理行为如何变化，再考察收益能否跨任务与模型迁移。' } satisfies L,
      keywords: [{ en: 'Temporal structure', zh: '时序结构' }, { en: 'Cross-modal interaction', zh: '跨模态交互' }, { en: 'Information retention', zh: '信息保留' }] satisfies L[],
    },
    {
      id: 'learning', number: '02', accent: 'teal',
      label: { en: 'Learning', zh: '学习' } satisfies L,
      tabLabel: { en: 'Learn', zh: '学习' } satisfies L,
      title: { en: 'How is useful structure learned?', zh: '有用的结构如何被学到？' } satisfies L,
      summary: { en: 'Representation quality is shaped by learning. I hope to study how architectures, training objectives, and learning mechanisms influence what models acquire and how they use it.', zh: '表征质量由学习过程塑造。我希望研究架构、训练目标与学习机制如何影响模型获取什么，以及如何运用它。' } satisfies L,
      inquiry: { en: 'Can models learn relationships and transformations that language does not explicitly describe, and transfer them to unfamiliar tasks?', zh: '模型能否学到语言没有明确描述的关系与变换，并将这些能力迁移到陌生任务？' } satisfies L,
      approach: { en: 'Explore predictive and self-supervised objectives that encourage models to capture relationships and transformations beyond explicit language descriptions. I would connect these objectives with model design and study how the resulting representations support cross-modal integration and unfamiliar tasks.', zh: '探索预测式与自监督目标，让模型捕捉显式语言描述之外的关系与变换。我希望将这些目标与模型设计结合，研究形成的表征如何支持跨模态整合，以及如何应对陌生任务。' } satisfies L,
      keywords: [{ en: 'Self-supervision', zh: '自监督学习' }, { en: 'Predictive objectives', zh: '预测式目标' }, { en: 'Model design', zh: '模型设计' }] satisfies L[],
    },
    {
      id: 'computation', number: '03', accent: 'violet',
      label: { en: 'Computation', zh: '计算' } satisfies L,
      tabLabel: { en: 'Compute', zh: '计算' } satisfies L,
      title: { en: 'When is more computation useful?', zh: '何时值得投入更多计算？' } satisfies L,
      summary: { en: 'More available information does not always mean more useful evidence. I want to understand when further processing improves reasoning, and how to allocate a limited budget.', zh: '可用信息更多，不一定意味着有效证据更多。我想理解何时进一步处理能够改善推理，以及有限预算应如何分配。' } satisfies L,
      inquiry: { en: 'Can better representations reduce the need for additional inference? Can adaptive computation compensate for what a model has not learned?', zh: '更好的表征能否减少额外推理的需求？自适应计算能否弥补模型尚未学到的能力？' } satisfies L,
      approach: { en: 'Study evidence selection and adaptive computation together, building on my frame-sufficiency and routing work. I would compare when extra processing helps across models and investigate whether stronger representations reduce the need for additional inference or change where it is most useful.', zh: '以帧充分性与路由工作为基础，将证据选择和自适应计算结合起来。我希望跨模型比较额外处理何时有效，并研究更强的表征能否减少额外推理需求，或改变计算最有价值的位置。' } satisfies L,
      keywords: [{ en: 'Test-time computation', zh: '测试时计算' }, { en: 'Evidence selection', zh: '证据选择' }, { en: 'Learning × inference', zh: '学习 × 推理' }] satisfies L[],
    },
  ],
  evidenceLabel: { en: 'Where these questions began', zh: '这些问题从何而来' } satisfies L,
  evidence: [
    {
      number: '01', accent: 'gold', marker: 'CVPR 2026 Findings',
      title: { en: 'Learning temporal structure', zh: '从时序中学习结构' } satisfies L,
      text: { en: 'Self-supervised counting taught me to look for structure that can be learned without explicit labels.', zh: '自监督动作计数让我关注：没有显式标注时，模型仍能学到怎样的结构。' } satisfies L,
      href: '#project-period-adaptive',
      link: { en: 'Count What Repeats', zh: '周期自适应动作计数' } satisfies L,
    },
    {
      number: '02', accent: 'teal', marker: { en: '+3.15 pp · comparable token cost', zh: '+3.15 个百分点 · Token 成本接近' } satisfies L,
      title: { en: 'Making computation count', zh: '让计算转化为收益' } satisfies L,
      text: { en: 'Across 9,015 questions, better accuracy than uniform sampling motivated questions about how evidence is used.', zh: '在 9,015 个问题上优于均匀采样的结果，让我进一步追问模型如何利用证据。' } satisfies L,
      href: '#project-test-time-scaling',
      link: { en: 'Test-time scaling research', zh: '测试时扩展研究' } satisfies L,
    },
    {
      number: '03', accent: 'violet', marker: 'Qwen2.5-VL → LLaVA-Video',
      title: { en: 'A gain that did not transfer', zh: '一次未能迁移的收益' } satisfies L,
      text: { en: 'A routing strategy worked on one model but not another. What differs in their representations and computation?', zh: '路由策略在一个模型上有效，却未迁移到另一个。它们的表征与计算机制有何不同？' } satisfies L,
      href: '#project-frame-sufficiency',
      link: { en: 'Frame sufficiency & routing', zh: '帧充分性与自适应路由' } satisfies L,
    },
  ],
  method: {
    title: { en: 'Better results. Clearer explanations.', zh: '改善结果，也解释原因。' } satisfies L,
    text: { en: 'I want to understand why a method succeeds or fails, using controlled comparisons across architectures, tasks, and compute budgets, and analyses of what internal representations retain.', zh: '我希望通过跨架构、跨任务与跨计算预算的受控比较，结合内部表征分析，理解一种方法为何有效、又为何失效。' } satisfies L,
    axes: [{ en: 'Across architectures', zh: '跨架构' }, { en: 'Across tasks', zh: '跨任务' }, { en: 'Across budgets', zh: '跨预算' }] satisfies L[],
  },
};

/* --------------------------------------------------------------- 已发表 */

export const publications = [
  {
    year: '2026',
    venue: 'CVPR 2026 Findings',
    status: { en: 'Published', zh: '已发表' } satisfies L,
    venueFull: { en: 'IEEE/CVF Conference on Computer Vision and Pattern Recognition', zh: 'IEEE/CVF 计算机视觉与模式识别会议' } satisfies L,
    title: 'Count What Repeats: Period-Adaptive Multi-Scale Consistency for Self-Supervised Repetitive Action Counting',
    authors: [
      { name: 'Shizhao Gao', me: true },
      { name: 'Jun Li', me: false },
      { name: 'Qiming Li', me: false, corresponding: true },
    ],
    role: { en: 'First author', zh: '第一作者' } satisfies L,
    summary: {
      en: 'A self-supervised framework that adapts to changing action periods instead of assuming a fixed one, combining multi-scale cycle consistency with an action-similarity objective and a multi-expert consensus counting stage. Reaches 0.129 MAE / 0.842 OBO on RepCount and 0.098 MAE / 0.879 OBO on Countix — outperforming prior supervised baselines while using no count annotations.',
      zh: '一个自监督框架：不再假设周期固定，而是自适应动作周期变化，将多尺度循环一致性、动作相似性目标与多专家共识计数流程结合。在 RepCount 上取得 0.129 MAE / 0.842 OBO，Countix 上取得 0.098 MAE / 0.879 OBO——在完全不使用计数标注的前提下超过既有监督基线。',
    } satisfies L,
    awards: [
      {
        en: 'CVPR Compute Gold Star · recognition for computational efficiency',
        zh: 'CVPR Compute Gold Star · 计算效率方面的认可',
      } satisfies L,
      { en: 'Poster presented at CVPR 2026, Denver, CO, USA', zh: '于 CVPR 2026（美国丹佛）展示论文海报' } satisfies L,
    ],
    resources: [
      { label: { en: 'Paper', zh: '论文' } satisfies L, href: 'https://openaccess.thecvf.com/content/CVPR2026F/papers/Gao_Count_What_Repeats_Period-Adaptive_Multi-Scale_Consistency_for_Self-Supervised_Repetitive_Action_CVPRF_2026_paper.pdf' },
    ],
  },
  {
    year: '',
    venue: 'Pattern Recognition',
    status: { en: 'Accepted', zh: '已录用' } satisfies L,
    venueFull: { en: 'Pattern Recognition', zh: 'Pattern Recognition' } satisfies L,
    title: 'TWCRAC: Leveraging Temporal Cycle Consistency and Dynamic Thresholding for Robust Repetitive Action Counting',
    authors: [
      { name: 'Jun Li', me: false },
      { name: 'Shizhao Gao', me: true },
      { name: 'Tianwen Hu', me: false },
      { name: 'Yinhui Xie', me: false },
      { name: 'Zhouhua Liu', me: false },
      { name: 'Qiming Li', me: false },
    ],
    role: { en: 'Second author', zh: '第二作者' } satisfies L,
    summary: {
      en: 'Research on robust repetitive action counting using temporal cycle consistency and dynamic thresholding. Accepted by Pattern Recognition.',
      zh: '结合时序循环一致性与动态阈值开展鲁棒重复动作计数研究，已被 Pattern Recognition 录用。',
    } satisfies L,
    awards: [],
    resources: [],
  },
];

/* -------------------------------------------------------------- 在投论文
 *  按学术惯例与双盲政策，此处只列研究方向与投稿状态，不公开具体标题。
 *  Per double-blind policy, submissions are listed by direction and status
 *  only — titles are withheld until acceptance.
 * ------------------------------------------------------------------------ */


/* ------------------------------------------------------------ 读博的理由
 *  全站唯一一段不谈成果、只谈动机的文字。放在「关于」之后、「联系」之前。
 * ------------------------------------------------------------------------ */

export const statement = {
  eyebrow: { en: 'Why a Ph.D.', zh: '为什么读博' } satisfies L,
  text: {
    en: 'I want to build more capable models — and better understand <em>how they learn and use information</em>.',
    zh: '我希望构建能力更强的模型，也更深入地理解<em>它们如何学习和运用信息</em>。',
  } satisfies L,
  note: {
    en: 'A Ph.D. is the opportunity to connect my experience in video understanding with deeper questions about multimodal learning and reasoning, and leave work that others can build on.',
    zh: '博士阶段，我希望把视频理解的研究积累与多模态学习、推理中的深层问题联系起来，留下一些别人能接着往下做的工作。',
  } satisfies L,
};

/* ---------------------------------------------------------------- 科研项目 */

export const projects = [
  {
    id: 'test-time-scaling',
    title: { en: 'Query-Axis Scaling for Video-Language Models', zh: '视频语言模型的查询轴扩展（Query-Axis Scaling）' } satisfies L,
    kind: { en: 'First author · Manuscript in preparation', zh: '第一作者 · 稿件准备中' } satisfies L,
    period: { en: '2026', zh: '2026' } satisfies L,
    accent: 'teal',
    problem: {
      en: 'Can the scope of questions sharing a visual observation become a new dimension of test-time scaling? I investigate how joint observation across questions changes the accuracy–compute trade-off.',
      zh: '共享视觉观察的问题范围，能否成为测试时扩展的新维度？我研究跨问题的联合观察如何改变准确率与计算成本之间的权衡。',
    } satisfies L,
    approach: {
      en: 'Jointly select evidence for multiple questions about one video, encode the shared visual observation once, and reuse it for question-specific answers. Evaluated on Qwen3-VL-8B across 9,015 questions from five video datasets, with budget analyses, ablations, and transfer evaluation on Qwen2.5-VL-7B.',
      zh: '联合选择同一视频下多个问题所需的证据，共享视觉观察的编码，并复用于各问题的独立回答。在 Qwen3-VL-8B 上以 5 个视频数据集、9,015 个问题进行评测，开展预算分析、消融与 Qwen2.5-VL-7B 迁移评估。',
    } satisfies L,
    results: [
      { k: { en: 'vs. uniform sampling', zh: '相比均匀采样' }, v: { en: '+3.15 pp accuracy · comparable input-token cost', zh: '准确率 +3.15 个百分点 · 输入 Token 成本接近' } },
      { k: { en: 'vs. query-adaptive keyframes', zh: '相比查询自适应关键帧基线' }, v: { en: '+2.11 pp accuracy · 72.23% fewer input tokens', zh: '准确率 +2.11 个百分点 · 输入 Token 减少 72.23%' } },
    ],
    outcome: {
      en: 'The evaluation shows improved video understanding at a comparable input-token cost to uniform sampling, and higher accuracy with fewer input tokens than the query-adaptive keyframe baseline. The manuscript is in preparation; these input-token results are not measurements of end-to-end latency or FLOP savings.',
      zh: '评测表明，在接近均匀采样的输入 Token 成本下可以提升视频理解准确率；相较查询自适应关键帧基线，则以更少输入 Token 获得更高准确率。目前稿件准备中；这里的输入 Token 结果不等同于端到端时延或 FLOPs 节省。',
    } satisfies L,
    resources: [],
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
      { k: 'Qwen2.5-VL', v: { en: '−18.0% FLOPs · near-baseline accuracy', zh: 'FLOPs −18.0% · 准确率接近基线' } },
      { k: 'LLaVA-Video', v: { en: 'Gain did not transfer', zh: '收益未迁移，明确适用边界' } },
    ],
    outcome: {
      en: 'Saved 18.0% FLOPs for Qwen at near-baseline accuracy under an independent-forward-pass cost model; the gain did not transfer to LLaVA. Released model adapters, automated tests, CI, sanitized experiment artifacts, and data/licensing documentation for reproducible evaluation.',
      zh: '在独立前向计算成本模型下，Qwen 以接近基线的准确率节省 18.0% FLOPs；该收益未迁移至 LLaVA。开源模型适配器、自动化测试、CI、脱敏实验产物与数据/许可证说明，支持可复现评测。',
    } satisfies L,
    resources: [
      { label: { en: 'View on GitHub', zh: '查看仓库' } satisfies L, href: 'https://github.com/maple1999/frame-sufficiency-video-vlms' },
    ],
  },
  {
    id: 'period-adaptive',
    title: { en: 'Self-Supervised Counting, Action Quality Assessment & Anomaly Detection', zh: '自监督计数、动作质量评估与异常检测' } satisfies L,
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
      en: 'Published at CVPR 2026 Findings and awarded a CVPR Compute Gold Star. I led problem formulation, method design, the PyTorch implementation, experiments, ablations, and writing. The research now extends to action quality assessment and abnormal-action detection, with an industry collaboration established to advance technical validation and application in real business settings.',
      zh: '成果发表于 CVPR 2026 Findings，并获 CVPR Compute Gold Star。我主导问题定义、方法设计、PyTorch 实现、实验、消融分析及论文撰写。在重复动作计数基础上，进一步开展动作质量评估与异常动作检测研究，并建立企业横向合作，推进真实业务场景下的技术验证与应用。',
    } satisfies L,
    resources: [
      { label: { en: 'Read the paper', zh: '阅读论文' } satisfies L, href: 'https://openaccess.thecvf.com/content/CVPR2026F/papers/Gao_Count_What_Repeats_Period-Adaptive_Multi-Scale_Consistency_for_Self-Supervised_Repetitive_Action_CVPRF_2026_paper.pdf' },
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
      en: 'Contributed problem formulation, implementation and evaluation for ongoing work on skeleton-based action understanding.',
      zh: '参与骨架动作理解研究的问题定义、代码实现与实验评测。',
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
        en: 'Developed a server management system and an LLM API aggregation platform for the research group; maintain shared GPU servers, coordinate compute allocation, and resolve environment issues.',
        zh: '为课题组开发服务器管理系统和大模型 API 聚合平台；维护共享 GPU 服务器、协调算力分配并排查环境问题。',
      } satisfies L,
      {
        en: 'Build reproducible training and evaluation pipelines end to end: containerized environments, automated tests, CI, versioned experiment artifacts, and licensing documentation.',
        zh: '端到端构建可复现的训练与评测流程：容器化环境、自动化测试、CI、版本化实验产物与许可证说明。',
      } satisfies L,
      {
        en: 'Built the Nano-TCC deployment pipeline from PyTorch through ONNX to TensorRT FP16 on Jetson Orin Nano 8 GB, sustaining approximately 35 FPS and completing a four-hour stability test without crashes. The manuscript is under review at IEEE TMC.',
        zh: '完成 Nano-TCC 从 PyTorch、ONNX 到 TensorRT FP16 的端侧部署链路，在 Jetson Orin Nano 8 GB 上持续运行约 35 FPS，通过 4 小时无崩溃稳定性测试；论文在 IEEE TMC 审稿中。',
      } satisfies L,
      {
        en: 'This site is part of that habit: statically generated, bilingual, self-hosted on a Tencent Cloud VM behind nginx, deployed by a single scripted command.',
        zh: '这个网站本身也是这种习惯的一部分：静态生成、中英双语、自托管于腾讯云并由 nginx 提供服务，一条脚本命令完成部署。',
      } satisfies L,
    ],
  },
};

/* ------------------------------------------------------------ 导师推荐信
 *  只摘录最能说明问题的句子，完整信件挂 PDF。
 *  公开前请确认两位导师都同意——信里含他们的机构邮箱。
 * ------------------------------------------------------------------------ */

export const recommendations = [
  {
    name: { en: 'Prof. Jun Li', zh: '李俊 研究员' } satisfies L,
    title: { en: 'Professor', zh: '研究员 · 博士生导师' } satisfies L,
    affiliation: {
      en: 'Quanzhou Institute of Equipment Manufacturing, Haixi Institute, CAS',
      zh: '中国科学院海西研究院泉州装备制造研究所',
    } satisfies L,
    relation: {
      en: 'Primary research supervisor since Sep 2024',
      zh: '2024 年 9 月起任主要科研导师',
    } satisfies L,
    accent: 'gold',
  },
  {
    name: { en: 'Assoc. Prof. Qiming Li', zh: '李琦铭 副研究员' } satisfies L,
    title: { en: 'Associate Professor', zh: '副研究员' } satisfies L,
    affiliation: {
      en: 'Quanzhou Institute of Equipment Manufacturing, Haixi Institute, CAS',
      zh: '中国科学院海西研究院泉州装备制造研究所',
    } satisfies L,
    relation: {
      en: 'Day-to-day supervisor; corresponding author on all current papers',
      zh: '日常科研导师；现有全部论文的通讯作者',
    } satisfies L,
    accent: 'teal',
  },
];

/* ---------------------------------------------------------------- 技能栈 */

export const skills = [
  {
    group: { en: 'Video & Multimodal Models', zh: '视频与多模态模型' } satisfies L,
    items: ['Qwen3-VL', 'Qwen2.5-VL', 'LLaVA-Video', 'InternVL', 'Transformers', 'Long-video QA', 'Test-time scaling', 'Confidence routing', 'Cross-model evaluation', 'Input-token accounting', 'FLOP analysis'],
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
  { year: '2026', text: { en: 'CVPR Compute Gold Star', zh: 'CVPR Compute Gold Star' } satisfies L, highlight: true },
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
    text: { en: 'Developed a server management system and an LLM API aggregation platform; maintain shared GPU servers and coordinate compute allocation across the group.', zh: '开发服务器管理系统与大模型 API 聚合平台，维护实验室共享 GPU 服务器并协调团队算力分配。' } satisfies L,
  },
];

/* ---------------------------------------------------------------- 证书 */

export const certifications = [
  { en: 'Software Design Engineer — China Computer Technology and Software Professional Qualification (Intermediate)', zh: '软件设计师 — 计算机技术与软件专业技术资格（软考中级）' } satisfies L,
  { en: 'English — academic reading and writing, technical documentation, and everyday communication', zh: '英语 — 学术阅读与写作、技术文档及日常交流' } satisfies L,
];

/* -------------------------------------------------------------- 界面文案 */

export const ui = {
  nav: [
    { id: 'research', en: 'Research', zh: '研究' },
    { id: 'publications', en: 'Publications', zh: '论文' },
    { id: 'projects', en: 'Projects', zh: '项目' },
    { id: 'engineering', en: 'Engineering', zh: '工程' },
    { id: 'references', en: 'References', zh: '推荐' },
    { id: 'about', en: 'About', zh: '关于' },
  ],
  sections: {
    research: {
      eyebrow: { en: 'Research interests', zh: '研究兴趣' } satisfies L,
      title: { en: 'From seeing to reasoning', zh: '从看见，到理解与推理' } satisfies L,
    },
    publications: {
      eyebrow: { en: 'Publications', zh: '论文' } satisfies L,
      title: { en: 'Selected publications', zh: '代表性论文' } satisfies L,
      publishedLabel: { en: 'Published / Accepted', zh: '已发表 / 已录用' } satisfies L,
      underReviewLabel: { en: 'Under review', zh: '在审论文' } satisfies L,
      underReviewNote: {
        en: 'Ongoing work spans video-language inference and temporal representation learning.',
        zh: '正在开展视频语言推理与时序表征学习方面的研究。',
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
    references: {
      eyebrow: { en: 'References', zh: '推荐' } satisfies L,
      title: { en: 'What my supervisors say', zh: '导师的评价' } satisfies L,
      readLetter: { en: 'Read the full letter', zh: '阅读完整推荐信' } satisfies L,
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
      en: 'Designed and built by Shizhao Gao. Self-hosted behind nginx.',
      zh: '由高世钊设计并开发，nginx 自托管。',
    } satisfies L,
    rights: { en: 'All rights reserved.', zh: '保留所有权利。' } satisfies L,
  },
};
