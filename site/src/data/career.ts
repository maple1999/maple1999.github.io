/**
 * 求职页独立内容源，依据《高世钊_产品经理简历.pdf》与《高世钊_视觉算法工程师简历.pdf》；与学术页分别维护。
 * 这里是产品经理方向的基础内容，视觉算法方向在 career-roles.ts 中覆盖差异字段。
 */
export interface CareerProject {
  id: string;
  number: string;
  name: string;
  subtitle: string;
  status: string;
  /** 状态是否表示仍在进行（影响徽标样式） */
  ongoing?: boolean;
  period?: string;
  audience: string;
  question: string;
  flowTitle: string;
  flow: string[];
  work: string;
  evidence: string;
  nextLabel: string;
  next: string;
  technologies: string[];
  /** 侧栏结果指标 */
  results: { k: string; v: string }[];
  link?: { label: string; href: string };
}

export const career = {
  name: '高世钊',
  role: '产品经理（AI / B 端）',
  title: '高世钊 · 产品经理 / 视觉算法工程师 | 求职主页',
  description: '高世钊的中文求职主页，可切换产品经理（AI / B 端）与视觉算法工程师（视频理解 / 多模态）方向，查看岗位经历、项目成果、端侧部署实践及对应简历。',
  email: 'gsz199911@163.com',
  phone: '176-2455-4479',
  phoneHref: 'tel:+8617624554479',
  github: 'https://github.com/maple1999',
  githubLabel: 'maple1999',
  resume: '/cv/Shizhao_Gao_Product_Manager_ZH.pdf',
  summary: '人工智能硕士在读，有 B 端金融产品与服务器产品交付经验，也亲手构建 AI 应用。我关注模型能解决什么问题，以及如何把它变成可开发、可验证、可交付的产品方案。',
  degree: '人工智能硕士在读',
  school: '福建农林大学 · 中国科学院海西研究院联合培养',
  graduation: '2027 年 6 月预计毕业',
  availability: '2027 年 6 月预计毕业 · 欢迎联系交流岗位机会',
  nav: [
    { id: 'strengths', label: '为什么是我' },
    { id: 'experience', label: '工作经历' },
    { id: 'projects', label: '项目实践' },
    { id: 'background', label: '能力与背景' },
    { id: 'contact', label: '联系我' },
  ],
  /** 快速档案：HR 十秒内要核对的信息 */
  facts: [
    { k: '目标岗位', v: '产品经理（AI / B 端）' },
    { k: '经验', v: '2 年+ 企业级产品与解决方案 · 100+ B 端项目' },
    { k: '学历', v: '人工智能 · 专业硕士 · 2027 年 6 月毕业' },
    { k: '院校', v: '福建农林大学 · 中国科学院海西研究院联合培养' },
    { k: '证书', v: '软件设计师（软考中级）' },
  ],
  /** 岗位常见要求与对应证据；anchor 指向本岗位面板内的章节 */
  fit: {
    heading: '对照 AI / B 端产品经理岗位的常见要求',
    intro: '左列是招聘要求里常见的几项，右列是我对应的经历与证据。',
    items: [
      { need: '需求分析与 PRD 输出', evidence: '银行电子保函：梳理申请、审核、出函、退保流程，拆解字段规则、状态流转与角色权限，输出 PRD、业务流程图与交互原型。', anchor: 'experience' },
      { need: 'AI 产品理解与技术判断', evidence: 'CVPR 2026 Findings 独立一作；独立评测 Qwen2.5-VL 与 LLaVA-Video 的准确率与计算成本，能判断模型能力边界。', anchor: 'projects' },
      { need: '跨团队推进与按时交付', evidence: '100+ 服务器项目中协调研发、供应链、质量、生产与销售；电子保函项目较原计划提前 1 个月上线，未出现重大线上缺陷。', anchor: 'experience' },
      { need: '动手做原型、验证想法', evidence: '用 Python 独立完成 Motion Coach 与机会情报推送两个 AI 应用，从需求拆解到端到端跑通。', anchor: 'projects' },
      { need: '技术沟通与文档规范', evidence: '参与技术方案与测试用例评审，把业务规则转化为功能边界与验收标准；软件设计师（软考中级）。', anchor: 'background' },
    ],
  },
  /** 个人优势：来自简历首段，按岗位各三条 */
  strengthsHeading: '为什么是我',
  strengths: [
    { title: '2 年+ 企业级产品与解决方案经验', text: '参与 100+ B 端项目，从客户技术规范到配置选型、研发适配、质量验证与交付方案，主导的高密度服务器产品上线初期获 3,000 万元订单。' },
    { title: '金融产品的完整交付闭环', text: '银行电子保函项目从需求拆解、PRD、研发协同到验收上线全程参与，较原计划提前 1 个月上线，未出现重大线上缺陷。' },
    { title: '能亲手验证 AI 能力边界', text: '用 Python 独立完成 AI 原型与模型评测；CVPR 2026 Findings 独立一作，具备从模型能力评估到 AI 产品方案设计的技术基础。' },
  ],
  outcomes: [
    { value: '3,000', unit: '万元', label: '产品上线初期订单', note: '主导高密度服务器产品导入' },
    { value: '100+', unit: '个', label: '累计参与 B 端项目', note: '服务器产品与解决方案交付' },
    { value: '1', unit: '个月', label: '较原计划提前上线', note: '银行电子保函项目' },
    { value: 'CVPR', unit: '2026', label: 'Findings 独立一作', note: '视频理解与重复动作计数' },
  ],
  experienceHeading: '让方案走到交付的那一步。',
  experienceIntro: '从金融业务流程，到服务器产品导入。以需求、协作与结果串起每一次交付。',
  experience: [
    {
      company: '福建天和众诚科技发展有限公司',
      role: '产品经理实习生',
      period: '2024.10 — 2025.04',
      category: 'B 端金融产品',
      title: '把银行电子保函的复杂业务，拆成清晰的产品方案。',
      context: '面向银行、担保机构与企业用户，参与从业务梳理、方案设计到验收上线的完整流程。',
      points: [
        { title: '厘清场景与规则', text: '梳理申请、审核、出函、退保等核心流程，拆解字段规则、状态流转、角色权限与异常场景，形成结构化需求清单。' },
        { title: '连接产品与研发', text: '输出 PRD、业务流程图与交互原型，参与技术方案与测试用例评审，把业务规则转化为功能边界和验收标准，跟进研发联调与问题闭环。' },
        { title: '推进验收与上线', text: '推进业务验收与上线排期，协调研发和业务侧处理阻塞问题。' },
      ],
      result: '较原计划提前 1 个月上线，未出现重大线上缺陷。',
    },
    {
      company: '武汉长江计算科技有限公司',
      role: '产品工程师',
      period: '2022.06 — 2024.01',
      category: '服务器产品与解决方案',
      title: '从客户技术规范，推进到产品导入与规模交付。',
      context: '负责通用服务器产品线，累计参与 100+ 项目，覆盖南方电网、中国电信等集中采购项目。',
      points: [
        { title: '定义可交付方案', text: '将客户技术规范转化为配置选型、研发适配、质量验证及投标、交付方案。' },
        { title: '协调多团队落地', text: '协调研发、供应链、质量、生产和销售，推进适配、测试、整改与验收。' },
        { title: '推动新产品导入', text: '主导高密度服务器产品导入，并协同华为完成方案落地。' },
      ],
      result: '主导导入的高密度服务器产品，上线初期获得 3,000 万元订单。',
    },
  ],
  projects: [
    {
      id: 'motion-coach',
      number: '01',
      name: 'Motion Coach',
      subtitle: 'AI 动作评估产品 · 自主开发',
      status: '开发中',
      ongoing: true,
      audience: '健身与动作训练用户 · Windows 本地应用',
      question: '如何把动作识别能力，转化为用户能看懂、能跟随的实时纠错反馈？',
      flowTitle: '设计的核心用户链路',
      flow: ['摄像头采集', '姿态估计', '动作分段', '模板评分', '纠错反馈'],
      work: '将实时反馈需求拆解为姿态处理、评分逻辑与桌面界面模块，通过接口和数据契约明确模型能力边界、输入输出及功能依赖。',
      evidence: '已完成应用框架、配置系统与 Mock 姿态流程，跑通配置、Mock 姿态及评分反馈链路，预留 GPU 推理接口。',
      nextLabel: '下一步验证',
      next: '接入 GPU 实时推理，重点验证端到端延迟、分段准确率与评分一致性。',
      technologies: ['Python 3.11', 'Ruff / Mypy / Pytest', '可扩展姿态模型接口'],
      results: [
        { k: '产品定义', v: '5 步实时评估链路 · 3 个模块拆解' },
        { k: '当前进展', v: 'Mock 姿态与评分链路已跑通' },
      ],
    },
    {
      id: 'opportunity-intelligence',
      number: '02',
      name: '计算机视觉机会情报',
      subtitle: '信息聚合与智能推送产品 · 独立设计与开发',
      status: '已跑通端到端流程',
      audience: '计算机视觉学习者与求职者',
      question: '竞赛、学术活动和实习机会散落在不同平台，如何每天把相关信息送到用户面前？',
      flowTitle: '已实现的信息处理链路',
      flow: ['多源采集', '清洗与归类', 'AI 翻译摘要', '相关性筛选', '每日推送'],
      work: '独立设计信息产品，将需求拆解为多源采集、日期标准化、分类排序与邮件触达，以 YAML 配置数据源、可信域名和调度参数。',
      evidence: '接入 Kaggle API 与网页采集器，结合 LLM 完成翻译、摘要和相关性筛选，已实现三类信息每日各 Top 3 推送，支持定时任务、异常告警与自动化测试。',
      nextLabel: '持续关注',
      next: '采集成功率与相关性命中率，检验简报对实际信息获取的帮助。',
      technologies: ['LLM / Kaggle API', 'YAML 配置', '定时任务 / 异常告警 / Pytest'],
      results: [
        { k: '覆盖', v: '竞赛 · 学术活动 · 实习三类信息' },
        { k: '交付', v: '每日各 Top 3 邮件简报' },
      ],
    },
  ] satisfies CareerProject[],
  capabilities: [
    { number: '01', title: '产品设计与推进', text: '把用户场景转化为需求与业务规则，再落实为研发边界、验收标准和交付计划。', items: ['需求调研与拆解', 'PRD / 流程图 / 交互原型', '产品方案与技术评审', '项目推进 / 测试验收'] },
    { number: '02', title: 'AI 理解与验证', text: '理解模型评测、能力边界与落地链路，关注 LLM Agent 在检索、工作流和数据分析中的应用。', items: ['LLM Agent / Tool Calling', 'Prompt Engineering / RAG', 'PyTorch / Transformers', 'CLIP / Qwen-VL / MMAction2'] },
    { number: '03', title: '工程实现与协作', text: '能够亲手完成数据处理、API 集成与原型验证，和研发团队讨论实现路径与技术约束。', items: ['Python / C++', 'OpenCV / NumPy / Pandas', 'API 集成 / Linux / Git', '软件设计师 · 软考中级'] },
  ],
  education: [
    {
      school: '福建农林大学',
      degree: '人工智能 · 专业型硕士研究生',
      period: '2024.09 — 2027.06（预计）',
      note: '联合培养：中国科学院海西研究院泉州装备制造研究所',
      detail: '综测前 10%，获中国科学院学业奖学金、“华为杯”研究生数学建模竞赛全国三等奖（队长）。',
    },
    {
      school: '中南民族大学',
      degree: '软件工程 · 工学学士',
      period: '2018.09 — 2022.06',
      note: '计算机科学学院',
      detail: '综测专业前 10%，多次获学业奖学金；获“互联网+”省级三等奖、“挑战杯”省级三等奖。',
    },
  ],
  research: {
    label: '研究为产品提供技术判断',
    venue: 'CVPR 2026 Findings',
    heading: '独立一作 · 已录用',
    text: '基于无标注骨架序列，研究周期自适应多尺度一致性与重复动作计数；获 CVPR Compute Gold Star（计算效率与可复现性），并在会议展示海报。',
    paper: 'Count What Repeats: Period-Adaptive Multi-Scale Consistency for Self-Supervised Repetitive Action Counting',
    status: '持续开展时序表征学习、骨架动作理解与端侧推理研究。担任 Image and Vision Computing 期刊审稿人。',
    link: { label: '阅读论文', href: 'https://openaccess.thecvf.com/content/CVPR2026F/papers/Gao_Count_What_Repeats_Period-Adaptive_Multi-Scale_Consistency_for_Self-Supervised_Repetitive_Action_CVPRF_2026_paper.pdf' },
  },
  venture: {
    title: '更早的产品与团队实践',
    text: '本科期间担任九黎（武汉）软件开发公司校内学生创业团队总负责人，统筹小程序、网站与管理系统外包项目的需求沟通、任务分配、开发、进度管理及交付验收，并参与开发。',
  },
};
