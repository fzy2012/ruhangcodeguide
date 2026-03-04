// AUTO-GENERATED — do not edit directly. Edit backend/app/data/guide.yaml instead.
export interface GuideSubsection {
  id: string
  title: string
  content: string
}

export interface GuideSection {
  id: string
  title: string
  summary: string
  order: number
  key_points: string[]
  subsections: GuideSubsection[]
}

export const guideData: GuideSection[] = [
  {
    id: "introduction",
    title: "什么是 AI 编程",
    summary: "了解 AI 编程和 Vibe Coding 的概念，以及它们如何改变我们编写代码的方式。",
    order: 1,
    key_points: [],
    subsections: [
      {
        id: "why-learn",
        title: "为什么要学习 AI 编程",
        content: "- 提升开发效率 10 倍以上\n- 降低入门编程的门槛\n- 减少重复性工作\n- 专注于创意和架构设计\n",
      },
    ],
  },
  {
    id: "getting-started",
    title: "如何开始",
    summary: "根据你的技术背景，选择最适合的入门工具和学习路径。",
    order: 2,
    key_points: [],
    subsections: [
      {
        id: "first-steps",
        title: "第一步做什么",
        content: "1. 选择一个工具并完成安装/注册\n2. 尝试让 AI 生成一个简单的 Hello World 程序\n3. 理解基本的提示词结构\n4. 查看生成的代码并尝试理解\n",
      },
    ],
  },
  {
    id: "prompting",
    title: "提示词技巧",
    summary: "学习如何编写高质量的提示词，让 AI 更好地理解你的需求。",
    order: 3,
    key_points: [],
    subsections: [
      {
        id: "prd-template",
        title: "PRD 模板",
        content: "让 AI 按以下结构生成 PRD：\n- 项目概述\n- 核心需求\n- 核心功能\n- 用户流程\n- 技术栈\n- 实施计划\n",
      },
    ],
  },
  {
    id: "project-setup",
    title: "项目架构",
    summary: "学习如何组织你的 AI 编程项目，包括前后端分离、代码规范等。",
    order: 4,
    key_points: [],
    subsections: [
      {
        id: "best-practices",
        title: "最佳实践",
        content: "- 前后端分离，各自独立仓库或文件夹\n- 后端先用 mock 数据，完成后再对接前端\n- 使用 MCP 工具让 AI 控制浏览器自动测试\n- 保持代码规范，定期让 AI 重构\n",
      },
    ],
  },
  {
    id: "debugging",
    title: "调试与问题解决",
    summary: "当 AI 生成的代码出现问题时，如何有效地调试和修复。",
    order: 5,
    key_points: [],
    subsections: [
      {
        id: "error-handling",
        title: "错误处理策略",
        content: "1. 复制完整的错误信息给 AI\n2. 提供上下文（你正在做什么）\n3. 让 AI 解释错误原因\n4. 一步一步修复，不要一次性修改太多\n",
      },
    ],
  },
  {
    id: "advanced",
    title: "进阶技巧",
    summary: "深入了解 MCP、A2A 等新技术，以及如何创建自己的 AI 编程代理。",
    order: 6,
    key_points: [],
    subsections: [],
  },
]
