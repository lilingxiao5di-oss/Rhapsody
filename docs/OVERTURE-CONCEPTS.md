# Rhapsody Overture：首批意象设计稿

## 1. 设计稿入口

- Figma：<https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9>
- 文件名：`Rhapsody Overture — Motif Studies`
- 本地概念图：`design-assets/overture-concepts/`
- Figma 封面预览：`design-assets/figma-previews/cover.png`

Figma 文件采用两层结构：

1. `_Image Imports` 保存 GPT-image-2 生成的六张原始关键帧与图像哈希；
2. `Overture Studies` 使用可编辑文本、按钮、遮罩、分隔线和本地颜色变量重建产品界面层。

首轮画板包括：

- `00 — Cover / Overture Direction`
- `01 — Motif Gallery`
- `02 — Nocturne Entrance`
- `03 — Aubade Entrance`
- `04 — Sequence & Rules`

## 2. 已确认的序曲规则

- 最终画面同时显示 `Rhapsody · 狂想曲` 与 `SillyTavern`；
- 每次序曲只展示一个意象；
- 只在当前主题候选池内随机选择；
- 候选数大于一时尽量避免连续重复；
- 使用 `sessionStorage`，每个浏览会话只自动出现一次；
- 正常启动受会话标记约束，设置中心的主动预览不受约束；
- 双标题形成后停留，等待点击、`Enter` 或 `Space`；
- `Esc` 可以跳过视觉层，但不取消真实初始化任务。

## 3. Nocturne 候选池

| ID | 意象 | 核心几何 | OGL 实现重点 |
|---|---|---|---|
| N01 | Moonlit Lyre / 月下琴弦 | 月弧、七道细线、碎片 | 共享碎片缓冲区；弧线与琴弦使用 line geometry |
| N02 | Constellation Score / 星图乐谱 | 星点、五条断续路径、连接线 | 点精灵、折线路径、低频错峰点亮 |
| N03 | Orphic Echo / 奥耳甫斯回声 | 三层中断圆环、重连波纹 | 圆弧分段、断点粒子、衰减拖尾 |

## 4. Aubade 候选池

| ID | 意象 | 核心几何 | OGL 实现重点 |
|---|---|---|---|
| A01 | Dawn Horizon / 黎明地平线 | 极细地平线、半圆柔光、尘埃 | 线段、径向渐变、稀疏粒子上浮 |
| A02 | Golden Strings / 金色琴弦 | 七道竖线、上行光点、不完整弧线 | 线段亮度扫描、少量光点、低对比雾层 |
| A03 | Morning Manuscript / 晨间手稿 | 两层纸面、断续谱线、斜向窗光 | 半透明平面、遮罩渐变、细线分解 |

## 5. 视觉分工

- GPT-image-2 只负责氛围、光、碎片密度和意象轮廓；
- Figma 负责准确文字、双品牌层级、进入按钮、状态标注和布局；
- CSS 负责静态背景、遮罩、排版、按钮与无障碍焦点；
- OGL 负责碎片、线、粒子、光点与聚合/分解；
- SillyTavern 原生 DOM 与接口保持不变。

这些位图是视觉方向稿，不应直接作为最终全屏背景依赖。正式实现应优先把可程序化部分还原为 OGL/CSS，并把图片保留为设计对照和降级预览。

## 6. 首轮 Figma 状态

封面、六意象画廊、Nocturne 入口与 Aubade 入口已经写入 Figma。`Sequence & Rules` 已写入规则说明、真实加载圆环和随机单意象两步；双标题与等待点击两张状态卡因 Figma Starter 方案的 MCP 调用额度在本轮耗尽而未写入，但其结构已经在本文件与 `VISUAL-DIRECTION.md` 中确定，后续额度恢复后可直接补完。
