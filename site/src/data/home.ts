/** 入口主页内容源：中英两种语言，`/` 为中文、`/en/` 为英文。 */
import type { L } from './profile';

export const home = {
  title: {
    zh: '高世钊 · 个人主页 | 学术研究与职业实践',
    en: 'Shizhao Gao · Homepage | Research and Career',
  } satisfies L,
  description: {
    zh: '高世钊的个人主页入口。了解视频理解与多模态方向的学术研究，或查看产品经理、视觉算法工程师方向的项目经历与求职简历。',
    en: 'Entry page for Shizhao Gao. Explore research on video understanding and multimodal inference, or the career profile for product-manager and vision-engineer roles.',
  } satisfies L,
  status: {
    zh: '中国 · 泉州 / 福州 · 人工智能硕士在读',
    en: 'Quanzhou / Fuzhou, China · M.Eng. candidate in AI',
  } satisfies L,
  name: { zh: '高世钊', en: 'Shizhao Gao' } satisfies L,
  altName: { zh: 'Shizhao Gao', en: '高世钊' } satisfies L,
  tagline: {
    zh: '在研究中探索问题，<em>在实践中</em>验证想法。',
    en: 'Exploring questions in research, <em>testing ideas</em> in practice.',
  } satisfies L,
  lede: {
    zh: '这里有我的两个侧面：面向学术交流与博士申请的研究主页，以及面向产品经理、视觉算法工程师岗位的求职主页。从你感兴趣的方向开始。',
    en: 'Two sides of the same person: an academic profile for research and Ph.D. applications, and a career profile for product-manager and vision-engineer roles. Start wherever you are curious.',
  } satisfies L,
  chips: [
    { zh: 'CVPR 2026 Findings · 独立一作', en: 'CVPR 2026 Findings · First author' },
    { zh: 'CVPR Compute Gold Star', en: 'CVPR Compute Gold Star' },
    { zh: '中国科学院联合培养', en: 'Chinese Academy of Sciences' },
    { zh: '100+ 企业级项目交付', en: '100+ enterprise projects delivered' },
  ] satisfies L[],
  choicesLabel: { zh: '主页类型', en: 'Profile type' } satisfies L,
  choices: {
    academic: {
      kicker: { zh: 'ACADEMIC · 学术', en: 'ACADEMIC' } satisfies L,
      title: { zh: '学术主页', en: 'Academic profile' } satisfies L,
      text: {
        zh: '从视频理解出发，探索多模态模型如何表征、学习与推理。了解我的研究问题、已有成果，以及博士阶段希望深入的方向。',
        en: 'From video understanding to how multimodal models represent, learn and reason. Explore my research questions, existing work and directions for a Ph.D.',
      } satisfies L,
      tags: { zh: ['研究方向', '论文与成果', '导师推荐', '学术简历'], en: ['Research', 'Publications', 'References', 'CV'] },
      cta: { zh: '进入学术主页', en: 'Open academic profile' } satisfies L,
      ariaLabel: { zh: '进入学术主页', en: 'Open the academic profile' } satisfies L,
      footNote: { zh: '中英双语', en: 'English and Chinese' } satisfies L,
      links: [
        { href: '/academic/', label: 'English', lang: 'en' },
        { href: '/academic/zh/', label: '中文', lang: 'zh-CN' },
      ],
    },
    career: {
      kicker: { zh: 'CAREER · 求职', en: 'CAREER' } satisfies L,
      title: { zh: '求职主页', en: 'Career profile' } satisfies L,
      text: {
        zh: '工作经历、项目实践与岗位能力。产品经理（AI / B 端）与视觉算法工程师（视频理解 / 多模态）两个方向，各配一份简历。',
        en: 'Work experience, hands-on projects and role-specific skills for two tracks: product manager (AI / B2B) and vision algorithm engineer (video understanding / multimodal), each with its own résumé. Written in Chinese.',
      } satisfies L,
      tags: { zh: ['工作经历', '项目实践', '端侧部署', '岗位简历'], en: ['Experience', 'Projects', 'Edge deployment', 'Résumés'] },
      cta: { zh: '进入求职主页', en: 'Open career profile' } satisfies L,
      ariaLabel: { zh: '进入求职主页', en: 'Open the career profile (Chinese)' } satisfies L,
      footNote: { zh: '中文 · 双岗位切换', en: 'Chinese · two roles' } satisfies L,
      links: [
        { href: '/career/?role=product', label: { zh: '产品经理', en: 'Product Manager' } satisfies L },
        { href: '/career/?role=vision', label: { zh: '视觉算法', en: 'Vision Engineer' } satisfies L },
      ],
    },
  },
  glance: [
    { value: '2', label: { zh: '篇已发表 / 录用', en: 'Published / accepted' } satisfies L, note: { zh: '另有 5 篇在审 · 1 项研究稿件准备中', en: '5 under review · 1 manuscript in preparation' } satisfies L },
    { value: '0.129', label: { zh: 'RepCount MAE', en: 'MAE on RepCount' } satisfies L, note: { zh: '无标注 SOTA，超过监督基线', en: 'Label-free SOTA, beats supervised' } satisfies L },
    { value: '100+', label: { zh: '个 B 端项目', en: 'Enterprise projects' } satisfies L, note: { zh: '服务器平台交付 · 3,000 万订单', en: 'Server platforms · ¥30M orders' } satisfies L },
    { value: '16.5', label: { zh: 'ms 端侧延迟', en: 'ms on-device latency' } satisfies L, note: { zh: 'Jetson Orin Nano · TensorRT FP16', en: 'Jetson Orin Nano · TensorRT FP16' } satisfies L },
  ],
  contact: {
    label: { zh: '直接联系', en: 'Get in touch' } satisfies L,
    email: 'gsz199911@163.com',
    academicEmail: 'gsz1999@fafu.edu.cn',
    emailLabel: { zh: '求职邮箱', en: 'Email' } satisfies L,
    academicEmailLabel: { zh: '学术邮箱', en: 'Academic email' } satisfies L,
  },
  footer: {
    built: { zh: '由高世钊设计并开发，nginx 自托管。', en: 'Designed and built by Shizhao Gao. Self-hosted behind nginx.' } satisfies L,
    rights: { zh: '保留所有权利。', en: 'All rights reserved.' } satisfies L,
    motto: { zh: '保持好奇，认真构建。', en: 'Stay curious, build carefully.' } satisfies L,
  },
  actions: {
    skip: { zh: '跳到主要内容', en: 'Skip to content' } satisfies L,
    switchLang: { zh: 'EN', en: '中文' } satisfies L,
    switchLangTitle: { zh: 'Switch to English', en: '切换到中文' } satisfies L,
    toggleTheme: { zh: '切换主题', en: 'Toggle theme' } satisfies L,
    brand: { zh: '高世钊 · 个人主页', en: 'Shizhao Gao · Homepage' } satisfies L,
  },
};
