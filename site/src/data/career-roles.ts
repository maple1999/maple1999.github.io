import { career, type CareerProject } from './career';

/** 视频大模型自适应路由：两个岗位都展示，只是编号与角度不同。 */
const routing: CareerProject = {
  id: 'video-routing', number: '02', name: '视频大模型自适应路由',
  subtitle: '推理效率评测 · 独立研究 / 开源项目', status: '已完成评测', period: '2026',
  audience: '1,336 个 LongVideoBench 验证样本 · Qwen2.5-VL / LLaVA-Video',
  question: '在保证回答质量的前提下，视频大模型到底需要看多少帧？',
  flowTitle: '实验与评估链路', flow: ['帧充分性分析', '视觉 Token Masking', '答案选项评分', '置信度路由', '跨模型验证'],
  work: '独立设计嵌套置信度路由，评估最小充分帧数与计算成本；实现模型适配器、自动化测试与 CI，提供脱敏实验产物、数据及许可证说明。',
  evidence: '在独立前向成本模型下，Qwen 接近基线准确率时节省 18.0% FLOPs，为模型选型及准确率与计算成本的权衡提供依据。',
  nextLabel: '适用边界', next: '收益未迁移至 LLaVA-Video；18.0% 为特定成本模型下的 FLOPs 节省，不等同于实际端到端延迟降低。',
  technologies: ['Qwen2.5-VL / LLaVA-Video', 'Transformers', 'LongVideoBench', 'FLOP 分析 / CI'],
  results: [
    { k: 'Qwen2.5-VL', v: '−18.0% FLOPs · 准确率接近基线' },
    { k: 'LLaVA-Video', v: '收益未迁移 · 明确适用边界' },
  ],
  link: { label: '查看开源仓库', href: 'https://github.com/maple1999/frame-sufficiency-video-vlms' },
};

const counting: CareerProject = {
  id: 'repetition-counting', number: '01', name: '周期自适应重复动作计数',
  subtitle: '第一作者 / 主要完成人 · 算法研究项目', status: 'CVPR 2026 Findings', period: '2024.09 — 至今',
  audience: '自监督学习 · 无标注骨架序列 · 人体动作分析',
  question: '当动作速度不断变化，如何摆脱固定周期假设和计数标签依赖？',
  flowTitle: '方法与实现', flow: ['骨架序列输入', '周期自适应', '多尺度循环一致性', '动作相似性学习', '多专家共识计数'],
  work: '主导问题定义、方法设计与代码实现，完成端到端 PyTorch 训练、评测、消融分析及论文撰写，验证自监督时序建模方案。',
  evidence: 'RepCount 达到 0.129 MAE / 0.842 OBO，Countix 达到 0.098 MAE / 0.879 OBO，超过既有监督基线。成果获 CVPR 2026 Findings 录用（独立一作、唯一学生作者）及 CVPR Compute Gold Star。',
  nextLabel: '成果与复现', next: '已在会议展示海报。围绕计算效率、可复现性与完整消融评测组织研究产物。',
  technologies: ['PyTorch', '自监督时序建模', '骨架动作分析', '多尺度一致性'],
  results: [
    { k: 'RepCount', v: '0.129 MAE · 0.842 OBO' },
    { k: 'Countix', v: '0.098 MAE · 0.879 OBO' },
  ],
  link: { label: '阅读论文', href: 'https://openaccess.thecvf.com/content/CVPR2026F/papers/Gao_Count_What_Repeats_Period-Adaptive_Multi-Scale_Consistency_for_Self-Supervised_Repetitive_Action_CVPRF_2026_paper.pdf' },
};

/** Nano-TCC：视觉算法简历中的工程部署项目，是区别于纯研究背景的关键优势。 */
const nanoTcc: CareerProject = {
  id: 'nano-tcc', number: '03', name: 'Nano-TCC 端侧实时动作计数系统',
  subtitle: '工程部署项目 · 独立一作 / IEEE TMC 在审', status: 'IEEE TMC 在审', period: '2025 — 2026',
  audience: 'Jetson Orin Nano 8 GB · USB 摄像头 · 离线运行、零视频上传',
  question: '把自监督计数模型压到端侧，能否在 25 W 功耗下同时做到实时、稳定、不掉精度？',
  flowTitle: '部署链路', flow: ['USB 摄像头', 'MediaPipe 姿态提取', '轻量 Transformer', '在线计数', 'PyTorch → ONNX → TensorRT FP16'],
  work: '实现完整端侧链路与 PyTorch → ONNX → TensorRT FP16 部署；采用 CPU/GPU 异步流水线、静态内存复用与限长队列旧帧丢弃优化时延与吞吐。',
  evidence: '计数模型 0.72M 参数、FP16 体积 1.4 MB；25 W 模式、416×320、Skip=2 配置下端到端平均延迟 16.5 ms、P99 20.2 ms，峰值吞吐 41.0 FPS。实机持续运行约 35 FPS，4 小时压测无崩溃、内存稳定在约 2.5 GB；FP16 部署后 RepCount MAE 0.091。',
  nextLabel: '验证的平衡', next: '精度、时延与运行稳定性三者同时成立，而不是只优化其中一项；这是面向真实设备的算法工程能力。',
  technologies: ['Jetson Orin Nano', 'TensorRT FP16 / ONNX', 'MediaPipe', 'CUDA 异步流水线', '4 小时压测'],
  results: [
    { k: '端到端延迟', v: '平均 16.5 ms · P99 20.2 ms' },
    { k: '吞吐', v: '峰值 41.0 FPS · 持续约 35 FPS' },
    { k: '模型', v: '0.72M 参数 · FP16 1.4 MB' },
    { k: 'RepCount MAE', v: '0.091（FP16 部署后）' },
  ],
};

export const roles = [
  {
    ...career, id: 'product', short: '产品经理', specialty: 'AI / B 端',
    pitch: '懂技术边界，也能把方案推到上线。',
    highlights: [{ v: '100+', k: 'B 端项目' }, { v: '3,000 万', k: '上线初期订单' }, { v: 'CVPR 一作', k: 'AI 技术判断' }],
    statement: ['理解技术，', '让产品走到交付。'],
    profileLabel: '技术背景 × 产品实践',
    summary: '具备 2 年以上企业级产品与解决方案经验，参与 100+ B 端项目。从银行金融产品的需求拆解、PRD、研发协同到上线验收，也能用 Python 独立完成 AI 原型与模型评测。',
    projectHeading: '从用户问题，到可验证的产品。',
    projectIntro: '独立构建 AI 应用，也用实验评估模型能力与成本。',
    backgroundHeading: '连接业务需求与技术实现。',
    contactHeading: '聊聊 AI 产品的新机会。',
    contactIntro: '如果你正在寻找兼具技术理解与产品交付经验的伙伴，欢迎联系。',
    /** 章节顺序：产品经理先看工作经历 */
    order: ['experience', 'projects'] as const,
    projects: [
      { ...career.projects[1], number: '01' },
      { ...routing, number: '02' },
      { ...career.projects[0], number: '03' },
    ],
  },
  {
    ...career, id: 'vision', short: '视觉算法工程师', specialty: '视频理解 / 多模态',
    pitch: '从论文方法到 Jetson 实机，精度与时延一起交付。',
    highlights: [{ v: 'CVPR 2026', k: 'Findings 独立一作' }, { v: '0.129', k: 'RepCount MAE' }, { v: '16.5 ms', k: '端侧延迟' }],
    role: '视觉算法工程师（视频理解 / 多模态）',
    resume: '/cv/Shizhao_Gao_Vision_Engineer_ZH.pdf',
    statement: ['理解视频，', '从方法走向部署。'],
    profileLabel: '视频理解 × 多模态 × 端侧部署',
    summary: '人工智能硕士在读，聚焦视频理解、人体动作分析与多模态模型。CVPR 2026 Findings 独立一作，获 CVPR Compute Gold Star；具备算法设计、PyTorch 训练与消融评测经验，并完成 Jetson 端侧 TensorRT 部署与实机验证，能结合准确率、时延和资源开销优化视觉系统。',
    strengthsHeading: '为什么是我',
    facts: [
      { k: '目标岗位', v: '视觉算法工程师（视频理解 / 多模态）' },
      { k: '代表成果', v: 'CVPR 2026 Findings 独立一作 · CVPR Compute Gold Star' },
      { k: '学历', v: '人工智能 · 专业硕士 · 2027 年 6 月毕业' },
      { k: '院校', v: '福建农林大学 · 中国科学院海西研究院联合培养' },
      { k: '部署', v: 'Jetson Orin Nano · TensorRT FP16 · 实机验证' },
    ],
    fit: {
      heading: '对照视觉算法工程师岗位的常见要求',
      intro: '左列是招聘要求里常见的几项，右列是我对应的经历与证据。',
      items: [
        { need: '视频理解 / 人体动作分析', evidence: '周期自适应自监督重复动作计数，RepCount 0.129 MAE / 0.842 OBO，超过既有监督基线，CVPR 2026 Findings 独立一作。', anchor: 'projects' },
        { need: '模型训练、消融与评测', evidence: '主导 PyTorch 实现、训练、消融与评测全流程；获 CVPR Compute Gold Star（计算效率与可复现性）。', anchor: 'projects' },
        { need: '多模态 / 视频语言模型', evidence: '在 1,336 个 LongVideoBench 样本上评测 Qwen2.5-VL 与 LLaVA-Video，置信度路由在接近基线准确率时节省 18.0% FLOPs，并明确跨模型边界。', anchor: 'projects' },
        { need: '模型部署与推理优化', evidence: 'Jetson Orin Nano：PyTorch → ONNX → TensorRT FP16，端到端平均延迟 16.5 ms、峰值 41.0 FPS，4 小时压测无崩溃。', anchor: 'projects' },
        { need: '工程规范与团队协作', evidence: '开源模型适配器、自动化测试与 CI；负责实验室 GPU 服务器运维；此前 100+ 企业项目交付经历。', anchor: 'background' },
      ],
    },
    strengths: [
      { title: 'CVPR 2026 Findings 独立一作', text: '周期自适应自监督重复动作计数，RepCount 0.129 MAE 超过既有监督基线；获 CVPR Compute Gold Star（计算效率与可复现性）。' },
      { title: '算法到消融的完整研究链路', text: '主导问题定义、方法设计、PyTorch 实现、训练与消融评测；另有 7 篇论文在投或返修，其中 3 篇独立一作。' },
      { title: 'Jetson 端侧部署与实机验证', text: 'PyTorch → ONNX → TensorRT FP16，端到端平均延迟 16.5 ms、峰值 41.0 FPS，4 小时压测无崩溃，精度、时延与稳定性同时成立。' },
    ],
    outcomes: [
      { value: 'CVPR', unit: '2026', label: 'Findings 独立一作', note: 'Count What Repeats · 已录用' },
      { value: 'Gold', unit: 'Star', label: 'CVPR Compute 认可', note: '计算效率与可复现性' },
      { value: '0.129', unit: 'MAE', label: 'RepCount 计数误差', note: '同时取得 0.842 OBO' },
      { value: '16.5', unit: 'ms', label: 'Jetson 端到端延迟', note: 'TensorRT FP16 · 峰值 41.0 FPS' },
    ],
    experienceHeading: '算法之外，也懂交付。',
    experienceIntro: '两段产品与工程经历，让我习惯用需求、时延与资源约束来看算法。',
    projectHeading: '让方法经得起实验与设备的检验。',
    projectIntro: '从自监督动作计数、视频语言模型的效率边界，到 Jetson 上跑通的端侧系统。',
    backgroundHeading: '算法研究与工程实现并行。',
    contactHeading: '聊聊视觉与多模态的新机会。',
    contactIntro: '期待视频理解、人体动作分析、多模态算法与端侧部署相关机会，欢迎交流研究与工程问题。',
    order: ['projects', 'experience'] as const,
    projects: [counting, routing, nanoTcc],
    capabilities: [
      { number: '01', title: '视觉与深度学习', text: '围绕人体动作构建时序表示，完成模型训练、消融及精度与计算量评测。', items: ['PyTorch / OpenCV / MMAction2', '重复动作计数 / 骨架动作识别', '多人异常检测 / 自监督时序建模', '多模态特征对齐'] },
      { number: '02', title: '多模态与模型评测', text: '研究视频信息充分性，量化模型准确率与计算成本之间的关系。', items: ['Qwen2.5-VL / LLaVA-Video / InternVL', 'Transformers / LongVideoBench', '视觉 Token Masking / 置信度路由', '答案选项评分 / FLOP 分析'] },
      { number: '03', title: '工程与端侧部署', text: '从训练评测到设备上的实时系统，兼顾时延、吞吐、内存与运行稳定性。', items: ['Python / C++ / CUDA / Docker / Linux', 'ONNX / TensorRT FP16 · Jetson 端侧部署', '时延 / 吞吐 / 内存分析与压测', '实验室 GPU 服务器运维与资源分配'] },
    ],
    research: {
      ...career.research,
      label: '论文与学术成果',
      status: '持续开展时序表征学习、骨架动作理解与端侧推理研究。担任 Image and Vision Computing 期刊审稿人。',
    },
  },
];

export type CareerRole = (typeof roles)[number];
