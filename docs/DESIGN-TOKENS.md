# Rhapsody 设计令牌规范

> 状态：Approved 1.0<br>
> 定稿日期：2026-07-22<br>
> 设计来源：`WORKSPACE-DIRECTION.md` 与 Figma `Rhapsody / Workspace` 变量<br>
> 适用范围：Nocturne、Aubade、序曲、日常工作区、欢迎页与 Rhapsody 设置中心

## 1. 目的

本文件把已经定稿的视觉语言转换成可以直接实现的 CSS 令牌。它是 Figma、CSS、JavaScript 配置和后续组件之间的共同契约。

令牌遵守四条原则：

1. 组件只消费语义令牌，不直接写主题色值。
2. Nocturne 与 Aubade 共享结构、尺寸和组件状态，只切换颜色模式。
3. 高频功能界面使用 Noto Sans SC；诗性字体只进入被允许的低频场景。
4. 关闭 OGL 或减少动态效果后，信息层级仍必须完整成立。

## 2. 命名与作用域

### 2.1 CSS 前缀

所有 Rhapsody 自有变量使用 `--rhapsody-` 前缀。禁止创建无前缀的全局变量。

```text
--rhapsody-{category}-{role}-{variant}
```

示例：

```css
--rhapsody-color-surface-panel
--rhapsody-spacing-04
--rhapsody-font-size-body
--rhapsody-duration-standard
```

### 2.2 主题状态

运行时只在 `body` 上写入插件状态：

```html
<body class="rhapsody-enabled" data-rhapsody-theme="nocturne">
```

可用主题值：

- `nocturne`
- `aubade`

CSS 必须以 `body.rhapsody-enabled` 为总开关。移除该 class 后，不得继续影响 SillyTavern。

## 3. 原始颜色令牌

下表与 Figma `Rhapsody / Workspace Colors` 的 16 个变量一一对应。

| CSS 变量 | Nocturne | Aubade | 用途 |
|---|---:|---:|---|
| `--rhapsody-color-canvas` | `#080A12` | `#F4F1EA` | 视口最底层 |
| `--rhapsody-color-surface-root` | `#0D111B` | `#EBEEF1` | 主视觉外壳 |
| `--rhapsody-color-surface-panel` | `#121827` | `#FAF9F5` | 面板、消息区段 |
| `--rhapsody-color-surface-elevated` | `#182033` | `#FFFFFF` | 浮层、悬浮态 |
| `--rhapsody-color-text-primary` | `#EDF1FA` | `#272A31` | 正文与主要标题 |
| `--rhapsody-color-text-secondary` | `#A7B0C4` | `#646B76` | 辅助正文与标签 |
| `--rhapsody-color-text-muted` | `#68738A` | `#9298A0` | 时间、占位、弱提示 |
| `--rhapsody-color-border-subtle` | `#20293A` | `#D8DDE3` | 默认分隔线 |
| `--rhapsody-color-border-strong` | `#35415A` | `#B9C1CC` | 聚焦与强调边界 |
| `--rhapsody-color-accent-primary` | `#8E7CFF` | `#497B9A` | 主动作、选中状态 |
| `--rhapsody-color-accent-secondary` | `#6AA8FF` | `#8A6F9B` | 次级光色与图表 |
| `--rhapsody-color-accent-gold` | `#C8A96B` | `#B18442` | 少量节奏标记 |
| `--rhapsody-color-status-success` | `#78B8A1` | `#4D8D73` | 成功与可用状态 |
| `--rhapsody-color-overlay-dim` | `#080A12B8` | `#272A3166` | 遮罩层 |
| `--rhapsody-color-selection-background` | `#8E7CFF33` | `#497B9A26` | 选区与轻强调 |
| `--rhapsody-color-input-background` | `#0F1522` | `#F8F7F3` | 输入框底色 |

### 3.1 可直接复制的主题定义

```css
body.rhapsody-enabled,
body.rhapsody-enabled[data-rhapsody-theme="nocturne"] {
  color-scheme: dark;
  --rhapsody-color-canvas: #080a12;
  --rhapsody-color-surface-root: #0d111b;
  --rhapsody-color-surface-panel: #121827;
  --rhapsody-color-surface-elevated: #182033;
  --rhapsody-color-text-primary: #edf1fa;
  --rhapsody-color-text-secondary: #a7b0c4;
  --rhapsody-color-text-muted: #68738a;
  --rhapsody-color-border-subtle: #20293a;
  --rhapsody-color-border-strong: #35415a;
  --rhapsody-color-accent-primary: #8e7cff;
  --rhapsody-color-accent-secondary: #6aa8ff;
  --rhapsody-color-accent-gold: #c8a96b;
  --rhapsody-color-status-success: #78b8a1;
  --rhapsody-color-overlay-dim: #080a12b8;
  --rhapsody-color-selection-background: #8e7cff33;
  --rhapsody-color-input-background: #0f1522;

  --rhapsody-color-focus-ring: rgb(142 124 255 / 36%);
  --rhapsody-color-hover: rgb(142 124 255 / 10%);
  --rhapsody-color-active: rgb(142 124 255 / 16%);
  --rhapsody-color-danger: #d97f8c;
  --rhapsody-shadow-window: 0 18px 44px -10px rgb(4 5 10 / 42%);
  --rhapsody-shadow-elevated: 0 12px 30px -14px rgb(0 0 0 / 52%);
  --rhapsody-shadow-focus: 0 0 0 1px rgb(142 124 255 / 44%),
    0 0 18px rgb(107 92 242 / 16%);
}

body.rhapsody-enabled[data-rhapsody-theme="aubade"] {
  color-scheme: light;
  --rhapsody-color-canvas: #f4f1ea;
  --rhapsody-color-surface-root: #ebeef1;
  --rhapsody-color-surface-panel: #faf9f5;
  --rhapsody-color-surface-elevated: #ffffff;
  --rhapsody-color-text-primary: #272a31;
  --rhapsody-color-text-secondary: #646b76;
  --rhapsody-color-text-muted: #9298a0;
  --rhapsody-color-border-subtle: #d8dde3;
  --rhapsody-color-border-strong: #b9c1cc;
  --rhapsody-color-accent-primary: #497b9a;
  --rhapsody-color-accent-secondary: #8a6f9b;
  --rhapsody-color-accent-gold: #b18442;
  --rhapsody-color-status-success: #4d8d73;
  --rhapsody-color-overlay-dim: #272a3166;
  --rhapsody-color-selection-background: #497b9a26;
  --rhapsody-color-input-background: #f8f7f3;

  --rhapsody-color-focus-ring: rgb(73 123 154 / 34%);
  --rhapsody-color-hover: rgb(73 123 154 / 9%);
  --rhapsody-color-active: rgb(73 123 154 / 14%);
  --rhapsody-color-danger: #a94f5e;
  --rhapsody-shadow-window: 0 18px 44px -12px rgb(40 48 60 / 22%);
  --rhapsody-shadow-elevated: 0 12px 28px -16px rgb(55 63 74 / 24%);
  --rhapsody-shadow-focus: 0 0 0 1px rgb(73 123 154 / 42%),
    0 0 18px rgb(73 123 154 / 14%);
}
```

派生色允许使用透明度，但不得改变原始 16 色的含义。新增错误、警告等状态色时，两套主题必须同时补齐。

## 4. 间距、圆角与关键尺寸

下表与 Figma `Rhapsody / Workspace Dimensions` 一一对应。

| CSS 变量 | 值 | 说明 |
|---|---:|---|
| `--rhapsody-spacing-01` | `4px` | 图标内间距、紧密间隔 |
| `--rhapsody-spacing-02` | `8px` | 同组小间隔 |
| `--rhapsody-spacing-03` | `12px` | 控件内部间隔 |
| `--rhapsody-spacing-04` | `16px` | 标准内容间隔 |
| `--rhapsody-spacing-06` | `24px` | 区段间隔 |
| `--rhapsody-spacing-08` | `32px` | 大区段间隔 |
| `--rhapsody-radius-sm` | `6px` | 标签、小按钮 |
| `--rhapsody-radius-md` | `10px` | 输入框、普通面板 |
| `--rhapsody-radius-lg` | `14px` | 浮层、主面板 |
| `--rhapsody-radius-xl` | `18px` | 工作区外壳 |
| `--rhapsody-size-control-sm` | `32px` | 紧凑控制 |
| `--rhapsody-size-control-md` | `38px` | 标准控制 |
| `--rhapsody-size-sidebar` | `248px` | 桌面侧栏视觉目标 |
| `--rhapsody-size-inspector` | `288px` | 桌面上下文栏视觉目标 |

```css
body.rhapsody-enabled {
  --rhapsody-spacing-01: 4px;
  --rhapsody-spacing-02: 8px;
  --rhapsody-spacing-03: 12px;
  --rhapsody-spacing-04: 16px;
  --rhapsody-spacing-06: 24px;
  --rhapsody-spacing-08: 32px;

  --rhapsody-radius-sm: 6px;
  --rhapsody-radius-md: 10px;
  --rhapsody-radius-lg: 14px;
  --rhapsody-radius-xl: 18px;

  --rhapsody-size-control-sm: 32px;
  --rhapsody-size-control-md: 38px;
  --rhapsody-size-sidebar: 248px;
  --rhapsody-size-inspector: 288px;
  --rhapsody-size-topbar: 52px;
  --rhapsody-size-content-max: 1627px;
  --rhapsody-size-reading-max: 760px;
  --rhapsody-size-composer-max: 880px;
}
```

`sidebar` 与 `inspector` 是设计尺寸，不授权移动或替换 SillyTavern 核心 DOM。只有在原生布局可以通过 CSS 安全适配，或组件明确属于 Rhapsody 自身时，才能消费这两个值。

## 5. 排版令牌

### 5.1 字体族

```css
body.rhapsody-enabled {
  --rhapsody-font-family-ui: "Noto Sans SC", "Noto Sans", system-ui,
    -apple-system, "Segoe UI", sans-serif;
  --rhapsody-font-family-poetic: "Cormorant Garamond", Georgia,
    "Times New Roman", serif;
  --rhapsody-font-family-mono: "Noto Sans Mono", "Cascadia Code", Consolas,
    monospace;
}
```

正式发布时字体文件应随扩展本地提供并使用 `font-display: swap`。核心排版不得依赖 Google Fonts 或其他远程 CDN。

### 5.2 六个正式文本样式

| 令牌 | 字体 | 字号 / 行高 | 字重 / 字距 | 允许场景 |
|---|---|---:|---|---|
| `Workspace/Meta` | Noto Sans SC | `12 / 18px` | `400 / 0.4px` | 时间、状态、次要说明 |
| `Workspace/UI` | Noto Sans SC | `13 / 20px` | `500 / 0` | 按钮、标签、设置项 |
| `Workspace/Body` | Noto Sans SC | `15 / 24px` | `400 / 0` | 消息正文、说明文字 |
| `Workspace/Title` | Noto Sans SC | `20 / 28px` | `500 / -0.2px` | 面板标题、角色标题 |
| `Poetic/Display` | Cormorant Garamond | `38 / 42px` | `500 / 0.2px` | 欢迎、章节过渡 |
| `Poetic/Quote` | Cormorant Garamond Italic | `20 / 30px` | `500 / 0.2px` | 短引文、角色开场片段 |

```css
body.rhapsody-enabled {
  --rhapsody-font-size-meta: 12px;
  --rhapsody-line-height-meta: 18px;
  --rhapsody-letter-spacing-meta: 0.4px;

  --rhapsody-font-size-ui: 13px;
  --rhapsody-line-height-ui: 20px;

  --rhapsody-font-size-body: 15px;
  --rhapsody-line-height-body: 24px;

  --rhapsody-font-size-title: 20px;
  --rhapsody-line-height-title: 28px;
  --rhapsody-letter-spacing-title: -0.2px;

  --rhapsody-font-size-display: 38px;
  --rhapsody-line-height-display: 42px;
  --rhapsody-letter-spacing-display: 0.2px;

  --rhapsody-font-size-quote: 20px;
  --rhapsody-line-height-quote: 30px;
  --rhapsody-letter-spacing-quote: 0.2px;
}
```

诗性文本连续出现不得超过一个视觉区段。普通聊天消息、设置字段、错误信息、系统状态和按钮一律使用 UI 字体。

## 6. 边界、阴影与材质

```css
body.rhapsody-enabled {
  --rhapsody-border-subtle: 1px solid var(--rhapsody-color-border-subtle);
  --rhapsody-border-strong: 1px solid var(--rhapsody-color-border-strong);
  --rhapsody-backdrop-blur: 18px;
  --rhapsody-surface-opacity: 0.94;
}
```

- Window 阴影基准：`0 18px 44px -10px rgba(4, 5, 10, .42)`。
- Focus 光效基准：`0 0 18px rgba(107, 92, 242, .16)`，并保留清晰的 1px 聚焦轮廓。
- 玻璃材质只用于顶栏、输入区和少量浮层；消息正文不得逐条叠加高强度模糊。
- SillyTavern 的 `body.no-blur` 模式优先级高于 Rhapsody，必须完全取消 `backdrop-filter`。

## 7. 动效令牌

```css
body.rhapsody-enabled {
  --rhapsody-duration-instant: 0ms;
  --rhapsody-duration-fast: 125ms;
  --rhapsody-duration-standard: 200ms;
  --rhapsody-duration-slow: 360ms;
  --rhapsody-duration-ambient: 800ms;

  --rhapsody-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --rhapsody-ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --rhapsody-ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --rhapsody-ease-ambient: cubic-bezier(0.37, 0, 0.63, 1);
}
```

使用规则：

- Hover、focus、轻量颜色变化：`fast`。
- 面板、设置预览、主题内状态切换：`standard`。
- 欢迎排版、章节过渡的单次进入：`slow`。
- 环境光色缓慢变化：`ambient`；不能用于高频控件。
- 禁止给消息滚动、文本输入和持续生成内容增加惯性或延迟。

```css
@media (prefers-reduced-motion: reduce) {
  body.rhapsody-enabled {
    --rhapsody-duration-fast: 0ms;
    --rhapsody-duration-standard: 0ms;
    --rhapsody-duration-slow: 0ms;
    --rhapsody-duration-ambient: 0ms;
  }
}
```

序曲的专用时序以 `MOTION-SPEC.md` 为准，不从日常界面的动效时长反推。

## 8. 环境层令牌

环境层是视觉增强，不是信息层。

```css
body.rhapsody-enabled {
  --rhapsody-environment-opacity: 0.34;
  --rhapsody-environment-parallax-max: 6px;
  --rhapsody-environment-dpr-max: 1.5;
  --rhapsody-environment-active-fps: 30;
  --rhapsody-environment-particle-scale: 1;
}

body.rhapsody-enabled[data-rhapsody-performance="low"] {
  --rhapsody-environment-opacity: 0.2;
  --rhapsody-environment-parallax-max: 2px;
  --rhapsody-environment-dpr-max: 1;
  --rhapsody-environment-active-fps: 20;
  --rhapsody-environment-particle-scale: 0.45;
}
```

数字型 CSS 变量用于统一配置来源；JavaScript 必须读取、解析并设置上限，不能假定 CSS 会自动限制 WebGL 循环。

## 9. 层级规则

Rhapsody 不建立一套覆盖 SillyTavern 的全局 z-index 体系。日常组件优先依赖局部 stacking context。

允许的插件全局层只有：

| 层 | 建议值 | 说明 |
|---|---:|---|
| 环境 Canvas | `0` | 固定定位、不可交互、位于内容之后 |
| 插件设置预览 | 局部 `1–10` | 仅在设置面板内部 |
| 序曲遮罩 | `40000` | 开启时短暂覆盖界面；结束后必须移除 |

环境 Canvas 必须满足：

```css
.rhapsody-environment {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  contain: strict;
}
```

原生内容的可点击层级不得被 Canvas 或伪元素截获。

## 10. 组件语义别名

组件应优先消费下列别名，避免把底层色阶写进每个选择器：

```css
body.rhapsody-enabled {
  --rhapsody-component-page-bg: var(--rhapsody-color-canvas);
  --rhapsody-component-shell-bg: var(--rhapsody-color-surface-root);
  --rhapsody-component-panel-bg: var(--rhapsody-color-surface-panel);
  --rhapsody-component-popover-bg: var(--rhapsody-color-surface-elevated);
  --rhapsody-component-text: var(--rhapsody-color-text-primary);
  --rhapsody-component-text-secondary: var(--rhapsody-color-text-secondary);
  --rhapsody-component-divider: var(--rhapsody-color-border-subtle);
  --rhapsody-component-action: var(--rhapsody-color-accent-primary);
  --rhapsody-component-selection: var(--rhapsody-color-selection-background);
  --rhapsody-component-input-bg: var(--rhapsody-color-input-background);
}
```

只有当同一语义在至少三个组件中重复出现时，才新增别名。

## 11. 响应式约束

断点不是视觉主题的一部分，但实现必须遵循以下降级顺序：

### 宽屏：`>= 1280px`

- 使用完整工作区留白。
- 可显示原生可安全适配的辅助区域。
- OGL 可使用标准性能档。

### 紧凑桌面：`769–1279px`

- 缩小外壳边距和面板间距。
- 优先保留聊天与输入区；辅助预览折叠。
- 不压缩正文到小于约 `560px` 的舒适阅读宽度。

### 移动与窄屏：`<= 768px`

- 外壳回到全视口，无悬浮窗口边距。
- 不使用固定侧栏或上下文栏。
- 默认关闭 WebGL 环境层，保留静态 CSS 光场。
- 所有原生抽屉、发送按钮和弹窗保持可达。

## 12. 无障碍约束

- 正文与背景按 WCAG 2.2 AA 的普通文本对比度目标验证。
- `text-muted` 不用于必须读取的正文、表单值或唯一状态说明。
- Focus 不只依赖光晕；必须有可见轮廓。
- 开关状态必须同时有文字或结构变化，不能只改变颜色。
- 触控目标不得小于 SillyTavern 原有可点击范围；Rhapsody 不通过视觉缩小减少命中区。
- 系统 `forced-colors`、`prefers-reduced-motion` 和 `body.no-blur` 优先于装饰效果。

## 13. 令牌变更流程

1. 先说明变更解决的组件问题，禁止为单张效果图增加孤立色值。
2. 同时检查 Nocturne 与 Aubade。
3. 更新 Figma Variables 与本文件。
4. 对欢迎、会话、设置和移动端至少各做一次回归。
5. 令牌改名属于破坏性变更；在实现阶段需要迁移说明。

## 14. 实现验收

- CSS 中不存在未说明的远程字体或远程图片依赖。
- 两套主题使用同一 DOM 和同一组件规则。
- 插件关闭后，所有 `--rhapsody-*` 的影响随总开关一起消失。
- OGL 关闭后，背景、边界、排版和状态仍清晰。
- 诗性字体没有进入普通消息与设置字段。
- 缩放到 200% 时，输入、消息、设置和原生抽屉仍可使用。
