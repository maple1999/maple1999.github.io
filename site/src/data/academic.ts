import type { L } from './profile';

export const academic = {
  nav: [
    { id: 'top', en: 'About', zh: '关于我' },
    { id: 'highlights', en: 'Research highlights', zh: '代表研究' },
    { id: 'publications', en: 'Publications', zh: '论文成果' },
    { id: 'interests', en: 'Research interests', zh: '研究兴趣' },
    { id: 'background', en: 'Background', zh: '研究背景' },
    { id: 'contact', en: 'Contact', zh: '联系' },
  ],
  focus: { en: 'Multimodal Representation Learning & Reasoning', zh: '多模态表征学习与推理' } satisfies L,
  intro: {
    en: 'I am interested in how multimodal models learn, organize, and use information to support reliable reasoning. My current research focuses on video-language understanding and efficient test-time computation, building on earlier work in self-supervised temporal representation learning.',
    zh: '我关注多模态模型如何学习、组织和利用信息，以支持可靠推理。目前的研究集中于视频语言理解与高效测试时计算，并以此前的自监督时序表征学习为基础。',
  } satisfies L,
  ambition: {
    en: 'For my Ph.D., I hope to investigate how representations, learning objectives, and model mechanisms shape multimodal reasoning—and what makes these capabilities generalize across tasks and architectures.',
    zh: '博士阶段，我希望研究表征、学习目标与模型机制如何塑造多模态推理能力，以及这些能力如何跨任务、跨架构泛化。',
  } satisfies L,
  trajectory: {
    en: 'From learning the structure of motion to understanding how models use visual evidence.',
    zh: '从学习运动的时序结构，到理解模型如何利用视觉证据。',
  } satisfies L,
  interestsIntro: {
    en: 'Video is my starting point for broader questions about multimodal learning. I want to develop methods and understand why they work, using controlled comparisons across tasks, architectures, and computational budgets.',
    zh: '视频是我探索多模态学习的起点。我希望在提出方法的同时理解方法为何有效，通过跨任务、跨架构、跨计算预算的受控比较寻找更普适的机制。',
  } satisfies L,
  questions: [
    {
      label: { en: 'Learning & representations', zh: '学习与表征' },
      title: { en: 'What should a model preserve?', zh: '模型应保留什么信息？' },
      text: { en: 'How can representations retain relationships and transformations that individual frames or captions miss? I want to investigate how predictive and self-supervised learning objectives can help multimodal models acquire this structure, and keep it useful beyond the tasks and supervision under which it was learned.', zh: '表征如何保留单帧或文字描述未能表达的关系与变化？我希望研究预测式与自监督学习目标如何促使多模态模型获得这些结构，并使其在超出原有学习任务与监督条件的情境下依然有用。' },
    },
    {
      label: { en: 'Reasoning & computation', zh: '推理与计算' },
      title: { en: 'When does more computation help?', zh: '更多计算何时才有帮助？' },
      text: { en: 'How should models decide which evidence needs more processing? I want to understand how learned representations and adaptive computation work together, and why a reasoning strategy can succeed in one architecture but fail in another.', zh: '模型应如何判断哪些证据需要进一步处理？我希望理解已学习的表征与自适应计算如何协同，以及为何同一种推理策略在不同架构中的效果存在差异。' },
    },
  ],
};

export const highlights = [
  {
    id: 'test-time-scaling', visual: 'evidence',
    status: { en: 'Ongoing research · Manuscript in preparation', zh: '进行中的研究 · 稿件准备中' },
    title: { en: 'Query-Axis Scaling for Video-Language Models', zh: '视频语言模型的查询轴扩展（Query-Axis Scaling）' },
    subtitle: { en: 'Scaling visual observation across questions, not just within each question.', zh: '让视觉观察跨问题扩展，而不止于单个问题内部。' },
    question: { en: 'How can a model answer diverse questions about the same video without repeatedly spending computation on redundant visual context?', zh: '面对同一视频中的不同问题，模型如何避免在重复视觉上下文上反复消耗计算，同时保持回答质量？' },
    approach: { en: 'A video can support questions about actions, relationships, and events unfolding over time. These questions may draw on overlapping observations, yet require different evidence to answer well. This makes video understanding a useful setting for studying how models organize and use information under a limited computational budget.', zh: '同一段视频可以引出关于动作、关系和事件演变的多种问题。它们所需的观察可能重叠，但准确回答依赖的证据又各不相同。这使视频理解成为研究模型如何在有限计算预算下组织和利用信息的重要场景。' },
    perspective: [
      { en: 'My focus is the relationship between visual observation and reasoning quality. I investigate whether test-time computation can be used more effectively without additional training, and how the resulting trade-offs change across questions, datasets, and budgets.', zh: '我关注视觉观察与推理质量之间的关系：在不增加训练的前提下，测试时计算能否得到更有效的利用？这种权衡又如何随问题、数据集与预算而变化？' },
      { en: 'The work spans problem formulation, an implemented inference pipeline, and controlled empirical comparisons. Beyond improving a single score, I want to understand when additional visual information is useful—and when processing more of it simply adds cost.', zh: '这项工作涵盖研究问题定义、推理流程实现与受控实验比较。除了提升单一指标，我更希望理解额外视觉信息何时真正有用，以及何时更多处理只带来额外开销。' },
    ],
    metrics: [
      { value: '+2.11 pp', en: 'Video QA accuracy', zh: '视频问答准确率' },
      { value: '−72.23%', en: 'Input tokens', zh: '输入 Token' },
    ],
    comparison: { en: 'Both compared with query-adaptive keyframes.', zh: '均相对于查询自适应关键帧基线。' },
    context: { en: 'Qwen3-VL-8B · 5 datasets · 9,015 questions. Preliminary input-token results; not end-to-end latency.', zh: 'Qwen3-VL-8B · 5 个数据集 · 9,015 个问题。阶段性结果，成本按输入 Token 计，非端到端时延。' },
    detail: { en: 'Evaluation covers five datasets and 9,015 questions, with comparisons across input-token budgets. Against uniform sampling, accuracy improves by 3.15 percentage points at comparable input-token cost. Ongoing work includes budget analyses, ablations, and transfer to Qwen2.5-VL.', zh: '评估覆盖五个数据集与 9,015 个问题，并比较不同输入 Token 预算下的表现。相比均匀采样，在接近的输入 Token 成本下准确率提升 3.15 个百分点。后续工作包括预算分析、消融实验与向 Qwen2.5-VL 的迁移。' },
    resources: [] as { en: string; zh: string; href: string }[],
  },
  {
    id: 'period-adaptive', visual: 'temporal',
    status: { en: 'CVPR 2026 Findings · First author', zh: 'CVPR 2026 Findings · 第一作者' },
    title: { en: 'Count What Repeats', zh: '学习重复动作的时序结构' },
    subtitle: { en: 'Self-supervised temporal representation learning', zh: '自监督时序表征学习' },
    question: { en: 'Can a model learn to count repetitions without count labels, even when the action speeds up or slows down?', zh: '没有计数标注，模型能否在动作加速或减速时依然学会计数？' },
    approach: { en: 'I developed period-adaptive, multi-scale cycle consistency to learn motion structure from unlabeled skeleton sequences, followed by multi-expert consensus counting.', zh: '我设计周期自适应、多尺度循环一致性，从无标注骨架序列中学习运动结构，再通过多专家共识完成计数。' },
    metrics: [
      { value: '0.129', en: 'MAE · RepCount', zh: 'MAE · RepCount' },
      { value: '0.098', en: 'MAE · Countix', zh: 'MAE · Countix' },
    ],
    comparison: { en: 'No count labels used for training.', zh: '训练无需计数标注。' },
    context: { en: 'I led problem formulation, method design, implementation, experiments, and writing.', zh: '我主导问题定义、方法设计、代码实现、实验与论文撰写。' },
    detail: { en: 'The model achieves 0.842 OBO on RepCount and 0.879 OBO on Countix. The original paper figure below shows the training objective and multi-scale consensus inference.', zh: '模型在 RepCount 上取得 0.842 OBO，在 Countix 上取得 0.879 OBO。下方论文原图展示训练目标与多尺度共识推理流程。' },
    resources: [{ en: 'Paper & citation', zh: '论文与引用', href: 'https://openaccess.thecvf.com/content/CVPR2026F/html/Gao_Count_What_Repeats_Period-Adaptive_Multi-Scale_Consistency_for_Self-Supervised_Repetitive_Action_CVPRF_2026_paper.html' }],
  },
  {
    id: 'frame-sufficiency', visual: 'routing',
    status: { en: 'Independent research · Open source', zh: '独立研究 · 开源项目' },
    title: { en: 'Frame Sufficiency & Adaptive Routing', zh: '帧充分性与自适应路由' },
    subtitle: { en: 'When is the visual context enough?', zh: '视觉上下文何时已经足够？' },
    question: { en: 'Can easy questions use fewer frames, while uncertain questions receive more visual context?', zh: '能否让简单问题使用更少帧，把更多视觉上下文留给不确定的问题？' },
    approach: { en: 'Not every video question needs the same amount of visual context. A brief observation may be sufficient for one answer, while another depends on events distributed across the video. A fixed frame budget can therefore spend computation where little is gained, while leaving harder questions under-supported.', zh: '不同视频问题对视觉上下文的需求并不相同。有些答案只需短暂观察，另一些则依赖分散在视频中的事件。固定帧预算可能在收益有限的问题上花费过多计算，却未能为更困难的问题提供足够信息。' },
    perspective: [
      { en: 'I study this as a question of evidence sufficiency: how much information is enough for a useful answer, and how reliably can a model recognize that point? The project connects inference efficiency with a broader interest in the reliability of a model’s own decisions.', zh: '我把它视为一个证据充分性问题：多少信息足以支持有效回答，模型又能否可靠地识别这一时刻？这项研究将推理效率与一个更广泛的问题联系起来——模型自身的判断究竟有多可靠。' },
      { en: 'I built an open-source evaluation pipeline to compare this behavior across models. The contrast between Qwen2.5-VL and LLaVA-Video is particularly informative: an efficiency gain in one model does not automatically generalize. Understanding that difference matters as much as the gain itself.', zh: '我构建了开源评估流程，用于比较不同模型的行为。Qwen2.5-VL 与 LLaVA-Video 的对照尤其有启发性：在一个模型中获得的效率收益并不会自动泛化。理解这种差异，与取得收益本身同样重要。' },
    ],
    metrics: [
      { value: '−18.0%', en: 'Estimated FLOPs · Qwen2.5-VL', zh: '估算 FLOPs · Qwen2.5-VL' },
    ],
    comparison: { en: 'Near-baseline accuracy; the gain did not transfer to LLaVA-Video.', zh: '准确率接近基线；收益未迁移到 LLaVA-Video。' },
    context: { en: 'LongVideoBench · 1,336 validation examples · independent-forward-pass cost model.', zh: 'LongVideoBench · 1,336 个验证样本 · 独立前向计算成本模型。' },
    detail: { en: 'The release includes model adapters, automated tests, CI, experiment artifacts, and reproduction instructions. The cross-model difference motivates my interest in how representations and model mechanisms shape reasoning.', zh: '开源内容包括模型适配器、自动化测试、CI、实验产物与复现说明。不同模型的效果差异，促使我进一步关注表征与模型机制如何影响推理。' },
    resources: [{ en: 'Code & experiments', zh: '代码与实验', href: 'https://github.com/maple1999/frame-sufficiency-video-vlms' }],
  },
];
