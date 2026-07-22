# Rhapsody 工作区视觉定稿 V1

> 状态：Approved 1.0  
> 定稿日期：2026-07-22  
> 适用范围：SillyTavern 日常工作区、欢迎页、角色开场白、章节过渡与 Rhapsody 设置中心

## 1. 定稿公式

Rhapsody 工作区采用以下组合：

```text
A：专业工作区结构
+
B：受控的诗性排版时刻
+
D：紧凑设置结构
+
OGL：远景、低频、非信息层环境
```

- 日常聊天、导航、输入区和上下文面板采用 A。
- 欢迎页、角色开场白和章节过渡采用 B。
- 设置页采用 D；优先扫描效率，不使用营销式大卡片墙。
- OGL 只负责远景光场、稀疏尘埃、极轻视差和抽象共振线。
- 所有方案继续遵守项目边界：不改变 SillyTavern 接口、数据、事件语义和核心 DOM 结构。

## 2. Figma 定稿

Figma 文件：<https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9>

关键画板：

- [Workspace Cover](https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=69-2)
- [Workspace Foundations](https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=70-2)
- [Workspace Components](https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=77-2)
- [Nocturne Welcome](https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=81-2)
- [Nocturne Conversation](https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=81-3)
- [Rhapsody Settings](https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=81-4)
- [Aubade Welcome](https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=81-5)

本地截图位于 `figma-previews/`。这些 PNG 是审阅和版本记录，不是插件的运行时依赖。

## 3. 页面骨架

定稿视口为 `1707 × 876`。桌面宽屏状态采用：

```text
Viewport 1707 × 876
└── Visual Shell 1627 × 828，x=40，y=24
    ├── Top Bar：52
    ├── SillyTavern Sidebar：248
    └── Main：1379
        ├── Welcome：单一诗性内容面
        ├── Conversation：1091 Chat + 288 Context Inspector
        └── Settings：220 Categories + 850 Content + 309 Preview
```

这些尺寸是视觉目标，不代表创建新的业务容器。实现时优先给原生容器重新设定宽度、间距、背景和边界；只为 Rhapsody 自己拥有的设置 UI 与环境 Canvas 创建插件节点。

## 4. 四个定稿状态

### 4.1 Nocturne Welcome

- 专业编辑器式顶栏和侧栏保持稳定。
- 中央使用大留白、Cormorant Garamond 标题和单一主动作。
- 最近章节位于下方，不与欢迎文案争夺焦点。
- 环境效果只在边缘与远处留下紫蓝光场、弧线和共振线。

### 4.2 Nocturne Conversation

- 消息采用全宽内容段落，不采用漂浮聊天气泡。
- 角色、用户和时间信息形成稳定的横向扫描线。
- 章节过渡可以短暂使用诗性标题；进入普通消息后立即回归 Noto Sans SC。
- 右侧上下文面板只汇总已有角色、世界书和会话状态。
- 输入区固定在底部，主发送动作保持唯一高亮。

### 4.3 Rhapsody Settings

- 设置分类、字段和值形成紧凑三栏结构。
- 开关旁必须有结果说明，不能只靠标题猜测作用。
- 序曲、播放频率、OGL、视差、减少动态效果和性能档位属于插件配置。
- 右侧预览只表达视觉结果，不承诺额外功能。

### 4.4 Aubade Welcome

- 与 Nocturne 共享完全相同的工作区结构、间距和组件。
- 仅切换语义颜色模式与主题特化文案。
- 主强调色提高到可清晰识别的蓝色，旧金色只用于小面积节奏标记。
- 背景使用温暖象牙白、雾灰和极浅蓝，不使用纯白大面积照明。

## 5. 工作区设计基础

### 5.1 Figma Variables

已建立：

- `Rhapsody / Workspace Colors`：16 个语义颜色，包含 `Nocturne` 与 `Aubade` 两个模式。
- `Rhapsody / Workspace Dimensions`：14 个间距、圆角和关键尺寸变量。

颜色覆盖 Canvas、Surface、Text、Border、Accent、Status、Overlay、Selection 和 Input。所有变量均使用明确作用域，没有 `ALL_SCOPES`。

### 5.2 Typography

- Noto Sans SC：Meta、UI、Body、Title；用于所有功能界面和长时间阅读。
- Cormorant Garamond：Display、Quote；只用于欢迎、角色开场和章节过渡。
- 诗性字体不得进入设置条目、正文消息、系统状态或高频按钮。

### 5.3 Local Components

- `Toolbar Action`：`Style=Primary|Ghost` × `State=Default|Hover`。
- `Message Block`：`Role=Assistant|User`。
- `Settings Row`：`State=On|Off`。

组件属性暴露可编辑文案；颜色、间距与圆角绑定到 Rhapsody 工作区变量。

## 6. OGL 环境边界

OGL 是插件拥有的视觉层，不是新的 Three.js 场景，也不承载任何信息。

允许：

- 两至三个低透明度径向光场；
- 稀疏尘埃和极少量几何碎片；
- 远处弧线、共振线或波纹；
- 鼠标最大约 `6px` 的低频视差；
- 主题切换时缓慢改变光色和密度。

禁止：

- 在消息文字上方持续运动；
- 密集粒子、强 Bloom、高饱和霓虹和可辨认的神话图案；
- 空闲状态持续满帧渲染；
- 用 Canvas 绘制按钮、文字、状态或其他可访问性内容；
- 让环境层成为核心功能或远程图片依赖。

建议性能预算：

- 有交互时最多 30 fps；空闲时停止渲染；
- DPR 上限建议 1.5；
- 页面隐藏时暂停；
- `prefers-reduced-motion` 下切换为 CSS 静态光场；
- 移动端、低端设备和高负载会话自动降低粒子数量或完全关闭。

## 7. SillyTavern 接入映射

实现时优先映射现有节点：

| 视觉区域 | SillyTavern 原生目标 |
|---|---|
| 顶栏 | `#top-bar` |
| 主视觉外壳 | `#sheld` |
| 聊天滚动区 | `#chat` |
| 消息段落 | `.mes` 及其原生子节点 |
| 输入区 | `#send_form`、`#send_textarea` |
| 欢迎状态 | `.welcomePanel` 及现有欢迎内容 |
| 原生抽屉与弹窗 | 原有 drawer / popup 节点 |

原则：

- 不移动、克隆或替换核心 DOM。
- 通过 CSS 变量、选择器、伪元素和有限的 class/state 标记改变视觉。
- 插件自己的设置中心可以创建独立 DOM，但不得伪造原生业务状态。
- OGL Canvas 使用 `pointer-events: none`，并位于内容层之后。
- 插件关闭时移除 class、样式、监听器和 Canvas，恢复原界面。

## 8. 图像参考的角色

`design-assets/workspace-v1/nocturne-workspace-atmosphere-v1.png` 是 GPT Image 生成的光场与密度参考。

它用于回答：

- 左右光场应该有多弱；
- 中央阅读区域应该保留多少负空间；
- 金色节奏点应该有多小；
- OGL 远景可以出现多少碎片与线条。

它不应作为插件的固定背景图，也不属于运行时核心资产。对应生成提示词保存在同目录的 `.prompt.md` 文件中。

## 9. 实现顺序

1. 建立 CSS 变量与主题 mode class。
2. 完成 `#sheld`、顶栏、侧栏、消息区和输入区的纯 CSS 视觉适配。
3. 实现欢迎态与章节过渡的受控诗性排版。
4. 实现插件设置中心和本地配置持久化。
5. 接入 OGL 环境层，并先完成暂停、降级和销毁机制。
6. 最后接入可选序曲，不让序曲阻塞正常进入酒馆。

## 10. 验收标准

- 关闭 OGL 后，四个页面的层级和气质仍然成立。
- Nocturne 与 Aubade 切换时不改变布局、组件 API 和业务含义。
- 普通消息始终比装饰更清晰。
- 设置项可以快速扫描，状态不只依赖颜色表达。
- 主题、序曲和环境效果均可关闭。
- 插件禁用后可恢复 SillyTavern 原始界面。
- 核心视觉离线可用。

