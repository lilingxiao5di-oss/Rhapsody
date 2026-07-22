# Rhapsody × SillyTavern 适配规范

> 状态：Approved 1.0<br>
> 定稿日期：2026-07-22<br>
> 验证基线：SillyTavern `1.18.0`<br>
> 实现边界：不修改接口、数据、事件语义与核心 DOM 归属

## 1. 适配目标

Rhapsody 以 SillyTavern 第三方扩展的形式运行，在原生页面上增加可关闭、可销毁、可恢复的视觉层。

它可以：

- 映射 Rhapsody 双主题到原生颜色、字体、表面与边界；
- 重绘现有聊天、欢迎、输入、抽屉、弹窗和设置表面的视觉；
- 给原生节点添加命名明确的状态 class 或 `data-*`；
- 创建 Rhapsody 自己拥有的设置节点、环境 Canvas 和可选序曲遮罩；
- 通过 SillyTavern 事件总线响应聊天、消息、角色与设置变化。

它不可以：

- 移动、克隆、替换或删除 SillyTavern 核心节点；
- 拦截或改写消息发送、生成、存储与角色数据；
- 依赖 DOM 文本内容推断业务状态；
- 用 Canvas 绘制可点击按钮、文字或状态；
- 把远程图床、远程字体或远程脚本作为核心依赖；
- 为了匹配效果图而隐藏原生必要操作。

## 2. 实现分层

```text
SillyTavern 原生 DOM 与事件
        ↓
Adapter Controller
  ├── 生命周期与兼容探测
  ├── 主题 / 设置状态
  └── 原生事件订阅
        ↓
Visual Layers
  ├── CSS Theme：原生表面重绘
  ├── Rhapsody UI：插件设置与序曲
  └── OGL Environment：非信息环境层
```

React 不作为 V1 的运行时依赖。设置面板、主题切换和状态提示使用原生 DOM、模板与事件委托即可。若未来确有复杂独立面板，只允许把 React 挂载在 Rhapsody 自己的 root 内，不能让 React 接管 `#chat`、`.mes` 或其他原生树。

## 3. 扩展包结构

建议仓库在进入实现阶段后采用：

```text
Rhapsody/
├── manifest.json
├── index.js
├── style.css
├── README.md
├── src/
│   ├── adapter/
│   │   ├── lifecycle.js
│   │   ├── selectors.js
│   │   ├── settings.js
│   │   └── events.js
│   ├── environment/
│   │   ├── controller.js
│   │   ├── nocturne.js
│   │   └── aubade.js
│   ├── overture/
│   │   └── controller.js
│   └── styles/
│       ├── tokens.css
│       ├── native-bridge.css
│       ├── workspace.css
│       ├── welcome.css
│       ├── messages.css
│       ├── composer.css
│       ├── popup.css
│       └── settings.css
├── templates/
│   └── settings.html
├── vendor/
│   └── ogl.mjs
├── fonts/
├── i18n/
└── docs/
```

发布包内只保留运行时必要文件；设计截图和参考项目不进入浏览器加载路径。

### 3.1 Manifest 基线

SillyTavern `1.18.0` 已支持 manifest hook。建议基线：

```json
{
  "display_name": "Rhapsody",
  "loading_order": 100,
  "requires": [],
  "optional": [],
  "js": "index.js",
  "css": "style.css",
  "author": "lilingxiao5di-oss",
  "version": "0.1.0",
  "minimum_client_version": "1.18.0",
  "homePage": "https://github.com/lilingxiao5di-oss/Rhapsody",
  "auto_update": true,
  "hooks": {
    "activate": "init",
    "disable": "disable",
    "clean": "clean",
    "delete": "uninstall"
  }
}
```

`loading_order: 100` 让视觉覆盖在大多数内置扩展样式之后加载，但它不是覆盖冲突的保证。仍需依靠作用域、层叠顺序和有限 specificity 管理样式。

`disable` 只停止运行时并保留设置；`clean` 在用户确认后清除 Rhapsody 持久化数据；`delete` 无条件执行卸载清理，确保用户未勾选额外 clean 时也不留下数据。

## 4. DOM 所有权

| 节点类型 | 所有者 | Rhapsody 权限 |
|---|---|---|
| `body`、`#top-bar`、`#sheld`、`#chat` | SillyTavern | 加 class、属性与 CSS；不搬动 |
| `.mes` 与全部消息子节点 | SillyTavern | 纯样式；不包装、不复制、不改内容 |
| `#send_form`、`#send_textarea` | SillyTavern | 纯样式和非破坏状态映射 |
| 原生 drawer / popup / toast | SillyTavern | 纯样式；保持层级与交互 |
| `#rhapsody-settings` | Rhapsody | 可创建、更新、销毁 |
| `.rhapsody-environment` Canvas | Rhapsody | 可创建、暂停、销毁 |
| `.rhapsody-overture` | Rhapsody | 可选创建；退出后移除 |

插件节点统一使用 `rhapsody-` 前缀。禁止使用容易与原生或其他扩展碰撞的通用 ID，例如 `#settings`、`#overlay`、`#canvas`。

## 5. 原生选择器映射

以下内容来自 SillyTavern `1.18.0` 的实际页面与模板。

### 5.1 核心工作区

| 视觉区域 | 原生选择器 | 适配方式 | 风险 |
|---|---|---|---|
| 页面根 | `body` | 总开关、主题与能力属性 | 低 |
| 顶部工具区 | `#top-bar` | 表面、边界、按钮节奏 | 中 |
| 主外壳 | `#sheld` | 尺寸、背景、圆角、阴影 | 低 |
| 外壳拖动柄 | `#sheldheader` | 低调显示或保持原状 | 中 |
| 聊天滚动区 | `#chat` | 背景、滚动条、内容节奏 | 低 |
| 底部表单外壳 | `#form_sheld` | 边界与布局间距 | 低 |
| 输入组件 | `#send_form` | 材质、聚焦、连接状态 | 低 |
| 文本输入 | `#send_textarea` | 字体、占位、选区 | 低 |
| 发送区左右控制 | `#leftSendForm`、`#rightSendForm` | 图标尺寸和 hover | 中 |
| 发送 / 停止 | `#send_but`、`#mes_stop` | 主动作与危险动作 | 中 |

### 5.2 消息

| 内容 | 原生选择器 | 规则 |
|---|---|---|
| 消息根 | `.mes` | 全宽段落；不改属性与顺序 |
| 用户消息 | `.mes[is_user="true"]` | 轻微表面差，不做强气泡 |
| 角色头像区 | `.mesAvatarWrapper`、`.avatar` | 只改尺寸、边界和材质 |
| 消息主体 | `.mes_block` | 控制正文宽度与间距 |
| 角色 / 用户名 | `.ch_name .name_text` | UI 字体与次级层级 |
| 时间 | `.timestamp`、`.timestamp-icon` | Meta 样式 |
| 消息操作 | `.mes_buttons`、`.mes_edit_buttons` | 保持可发现与命中区 |
| 推理区 | `.mes_reasoning_details`、`.mes_reasoning` | 保留折叠语义 |
| 正文 | `.mes_text` | Body 样式；不改生成内容 |
| 滑动控制 | `.swipe_left`、`.swipe_right` | 保持原生位置和功能 |

`.mes` 的 `mesid`、`ch_name`、`is_user`、`is_system` 等属性属于原生状态，只读使用。Rhapsody 不写入或重命名这些属性。

### 5.3 欢迎页

欢迎页由 `welcomePanel.html` 动态生成，CSS 选择器无需 MutationObserver 即可自动生效。

| 内容 | 原生选择器 |
|---|---|
| 欢迎根 | `.welcomePanel` |
| Logo 与版本 | `.welcomeHeaderTitle`、`.welcomeHeaderLogo`、`.welcomeHeaderVersionDisplay` |
| 快捷操作 | `.welcomeShortcuts` |
| 最近会话标题 | `.recentChatsTitle` |
| 最近会话列表 | `.welcomeRecent .recentChatList` |
| 会话条目 | `.recentChat` |
| 会话信息 | `.recentChatInfo`、`.chatName`、`.chatMessage` |
| 原生条目操作 | `.chatActions` |

V1 只通过排版、留白、边界和伪元素营造 B 方案的诗性时刻。伪元素不得伪造按钮或替代真实 SillyTavern 标题。若未来需要可配置欢迎文案，应创建 Rhapsody 自有且可访问的节点，并保持原生快捷入口可见。

### 5.4 设置、抽屉与弹窗

- Rhapsody 设置模板挂载到 `#extensions_settings2`，根节点为 `#rhapsody-settings`。
- 原生抽屉和 popup 只做通用表面适配，不依赖其显示文本。
- 设置面板使用紧凑行结构，复用原生表单语义：`label`、`input`、`select`、`button`。
- 不把整个 SillyTavern 设置树重新渲染成 Rhapsody 自己的副本。

## 6. Figma 骨架与原生 DOM 的关系

Figma 中的 `248px Sidebar`、`288px Context Inspector` 是视觉目标，不等于 SillyTavern 已提供同构节点。

### V1 默认：原生布局模式

- 保持 `#top-bar` 与 `#sheld` 的原生空间关系。
- 通过表面、排版、宽度、留白和消息结构建立专业工作区气质。
- 不创建只为“看起来像侧栏”但没有真实语义的导航。
- 不创建上下文检查器，不重复展示角色或世界书业务状态。

### 后续可选：工作区布局实验

只有满足以下条件，才可以加入 `layoutMode: workspace`：

1. 仅用 CSS 改变原生节点的视觉位置，不 `appendChild` 搬动核心节点。
2. 所有 top-bar drawer 的打开、关闭与定位在支持的桌面视口通过回归测试。
3. 小于 `1280 × 720` 的范围外视口停止应用实验布局。
4. 功能与快捷键不因视觉位置变化而改变。
5. 该模式有独立开关，失败时可以立即回退。

右侧 Context Inspector 属于新的只读产品界面，不属于“纯视觉覆盖”。除非后续单独批准其数据来源、信息架构和交互，否则不进入 V1。

## 7. CSS 作用域与原生变量桥接

### 7.1 总作用域

```css
:where(body.rhapsody-enabled) #sheld { /* ... */ }
:where(body.rhapsody-enabled) #chat { /* ... */ }
:where(body.rhapsody-enabled) .mes { /* ... */ }
```

规则：

- 所有原生覆盖都必须出现在 `body.rhapsody-enabled` 之后。
- 优先使用 `:where()` 降低总开关的 specificity。
- 禁止全局 `div`、`button`、`canvas` 等裸选择器。
- `!important` 仅用于兼容 SillyTavern 已存在的内联样式或 `!important`，并在代码旁说明原因。
- 绝不使用 `* { transition: ... }`；这会破坏输入、滚动和第三方扩展。

### 7.2 SmartTheme 桥接

原生组件大量消费 `--SmartTheme*`。为让未单独适配的原生界面保持统一，Rhapsody 可以在启用时建立可关闭的语义桥：

```css
body.rhapsody-enabled[data-rhapsody-native-bridge="on"] {
  --SmartThemeBodyColor: var(--rhapsody-color-text-primary);
  --SmartThemeEmColor: var(--rhapsody-color-text-secondary);
  --SmartThemeUnderlineColor: var(--rhapsody-color-status-success);
  --SmartThemeQuoteColor: var(--rhapsody-color-accent-gold);
  --SmartThemeBlurTintColor: var(--rhapsody-color-surface-root);
  --SmartThemeChatTintColor: var(--rhapsody-color-surface-root);
  --SmartThemeUserMesBlurTintColor: var(--rhapsody-color-selection-background);
  --SmartThemeBotMesBlurTintColor: var(--rhapsody-color-surface-panel);
  --SmartThemeBorderColor: var(--rhapsody-color-border-subtle);
  --SmartThemeShadowColor: transparent;
  --mainFontFamily: var(--rhapsody-font-family-ui);
}
```

这个桥会同时影响依赖 SmartTheme 的第三方扩展，所以设置中必须提供“原生主题桥接”开关。关闭后，Rhapsody 只美化显式适配的节点。

不得改写 SillyTavern 已保存的主题配置；这里只在启用 class 的计算样式作用域内覆盖。插件关闭后变量自然恢复。

## 8. 原生显示模式兼容

SillyTavern 会在 `body` 写入多种显示状态。Rhapsody 必须读取并尊重这些状态，而不是覆盖它们。

| 原生状态 | 适配要求 |
|---|---|
| `body.bubblechat` | 保留用户选择；只替换颜色、圆角和边界令牌 |
| `body.documentstyle` | 不强行恢复头像、用户名或时间 |
| `body.hideChatAvatars` | 不通过更高 specificity 重新显示头像 |
| `body.big-avatars` | 保留原生放大逻辑和拼图圆角 |
| `body.no-blur` | 完全关闭 Rhapsody backdrop blur |
| `body.movingUI` | 不阻断拖动、滚动和指针事件 |

Rhapsody 的定稿方向是“全宽内容段落”，但原生用户已经主动选择 `bubblechat` 时，兼容用户设置优先。插件可以在自己的设置说明推荐 Document/Default，不得静默改写该偏好。

## 9. JavaScript 接入

### 9.1 获取官方上下文

SillyTavern `1.18.0` 提供：

```js
const context = SillyTavern.getContext();
const {
  eventSource,
  eventTypes,
  extensionSettings,
  saveSettingsDebounced,
  renderExtensionTemplateAsync,
} = context;
```

优先使用 `SillyTavern.getContext()` 暴露的能力。不要读取页面内未公开的模块变量，也不要通过模拟点击来完成可由官方上下文完成的操作。

### 9.2 设置模型

```js
const DEFAULT_SETTINGS = Object.freeze({
  schemaVersion: 1,
  enabled: true,
  theme: 'nocturne',
  nativeThemeBridge: true,
  layoutMode: 'native',
  overture: {
    enabled: true,
    oncePerSession: true,
  },
  environment: {
    enabled: true,
    parallax: true,
  },
  motion: {
    preference: 'system',
  },
});
```

配置保存在：

```js
context.extensionSettings.rhapsody
```

初始化时深拷贝默认值并按 `schemaVersion` 迁移；禁止直接把冻结对象赋给设置。每次用户输入只更新对应字段，然后调用 `saveSettingsDebounced()`。

序曲“本浏览器会话已经显示”属于临时状态，保存在：

```js
sessionStorage.setItem('rhapsody:overture:seen:v1', 'true');
```

它不写入聊天元数据，也不跨浏览器会话持久化。

### 9.3 事件订阅

V1 需要关注的原生事件：

| 事件 | 用途 |
|---|---|
| `APP_READY` | 安全挂载视觉层与可选序曲 |
| `SETTINGS_UPDATED` | 同步可能影响显示的原生设置 |
| `CHAT_CHANGED` / `CHAT_LOADED` | 更新仅与当前聊天相关的视觉状态 |
| `USER_MESSAGE_RENDERED` | 对新用户消息执行有限状态标记 |
| `CHARACTER_MESSAGE_RENDERED` | 对新角色消息执行有限状态标记 |
| `MESSAGE_UPDATED` / `MESSAGE_DELETED` | 清理与重新计算非内容型状态 |
| `CHARACTER_EDITED` / `PERSONA_CHANGED` | 更新插件自有展示中的名称或主题提示 |

纯 CSS 能完成的工作不注册事件。事件回调不能修改消息正文，也不能在每个流式 token 到达时查询整棵 DOM。

```js
function subscribe(context, event, handler, disposers) {
  context.eventSource.on(event, handler);
  disposers.push(() => context.eventSource.removeListener(event, handler));
}
```

必须保存原始函数引用，确保 `disable()` 可以移除监听器。

### 9.4 初始化骨架

```js
const state = {
  initialized: false,
  disposers: [],
  abortController: null,
  environment: null,
};

export async function init() {
  if (state.initialized) return;

  const context = SillyTavern.getContext();
  const compatibility = probeCompatibility();
  const settings = loadAndMigrateSettings(context);

  state.initialized = true;
  state.abortController = new AbortController();

  mountSettings(context, settings, state.abortController.signal);
  applyRootState(settings, compatibility);
  subscribeNativeEvents(context, state.disposers);

  if (compatibility.core && settings.environment.enabled) {
    state.environment = await createEnvironment(settings);
  }

  maybeShowOverture(settings);
}

export async function disable() {
  state.abortController?.abort();
  for (const dispose of state.disposers.splice(0).reverse()) {
    await dispose();
  }
  await state.environment?.destroy();
  state.environment = null;

  document.querySelector('#rhapsody-settings')?.remove();
  document.querySelector('.rhapsody-overture')?.remove();
  document.querySelector('.rhapsody-environment')?.remove();

  const body = document.body;
  body.classList.remove('rhapsody-enabled', 'rhapsody-compat-degraded');
  delete body.dataset.rhapsodyTheme;
  delete body.dataset.rhapsodyNativeBridge;
  delete body.dataset.rhapsodyEnvironment;

  state.initialized = false;
}
```

这段是实现契约而非最终文件：最终代码仍需把同步错误、动态 import 失败和 WebGL context loss 纳入清理路径。

### 9.5 Clean 与卸载

- `disable()`：移除 DOM、class、监听器、Observer、RAF、Animation 和 WebGL 资源，保留 `extensionSettings.rhapsody`。
- `clean()`：先 disable，再删除 `extensionSettings.rhapsody` 与所有 `rhapsody:` 前缀浏览器存储。
- `uninstall()`：执行 clean，并移除 SillyTavern `disabledExtensions` 中的 Rhapsody 注册项。
- 未来若创建 IndexedDB、CacheStorage、Worker 或本地文件，必须在同一清理入口登记销毁。
- 功能模块通过统一 disposer 注册清理；创建资源的模块负责释放资源。

## 10. 兼容探测与降级

### 10.1 启动探测

```js
const REQUIRED = ['#sheld', '#chat', '#send_form', '#send_textarea'];
const OPTIONAL = ['#top-bar', '#form_sheld', '#extensions_settings2', '.welcomePanel'];

function probeCompatibility() {
  const missingRequired = REQUIRED.filter((selector) => !document.querySelector(selector));
  const missingOptional = OPTIONAL.filter((selector) => !document.querySelector(selector));
  return {
    core: missingRequired.length === 0,
    missingRequired,
    missingOptional,
  };
}
```

若核心选择器缺失：

- 不应用工作区空间覆盖；
- 不启动 OGL；
- 保留能安全运行的设置界面；
- 写入 `rhapsody-compat-degraded` 并只输出一次可读警告；
- 不抛出阻断 SillyTavern 的未捕获异常。

可选选择器缺失时，只关闭对应增强。`.welcomePanel` 在进入聊天后本来就可能不存在，不能把它当成兼容失败。

### 10.2 DOM 观察策略

- CSS 选择器可以覆盖动态消息和欢迎页，不为此创建 MutationObserver。
- 若插件自有节点需要确认是否被外部移除，只观察直接父节点且 `subtree: false`。
- 禁止对 `document.body` 使用永久、全子树、全属性观察。
- 任何 DOM 扫描都限定在 `#chat` 或插件 root，且合并到一个 animation frame。

## 11. OGL 环境适配

OGL 以本地 ESM 文件打包，不从 CDN 动态加载。

### 11.1 Canvas 契约

```html
<canvas class="rhapsody-environment" aria-hidden="true"></canvas>
```

- `pointer-events: none`。
- `aria-hidden="true"`。
- 只绘制光场、尘埃、弧线和抽象碎片。
- 位于信息内容之后，不能改变命中测试。
- 一个页面最多一个环境 Canvas。

### 11.2 渲染预算

- 使用原生 `requestAnimationFrame` 跟随桌面显示器刷新率，不人为限制为 30 fps。
- DPR 上限 2。
- 指针视差上限 6px。
- 页面隐藏时停止；窗口恢复时按需重绘。
- 无输入、无主题过渡、无有限时长环境 tween 时停止 RAF。
- `prefers-reduced-motion: reduce`、WebGL 初始化失败或 context lost 时，切换为静态 CSS 光场。
- 不根据硬件、消息数量或短暂丢帧自动降低画质。

### 11.3 生命周期

`destroy()` 必须：

1. `cancelAnimationFrame`。
2. 移除 pointer、resize、visibility 与 context 监听器。
3. 断开 `ResizeObserver`。
4. 释放 Program、Geometry、Texture 与 RenderTarget 引用。
5. 主动丢失或清理 WebGL context（实现允许时）。
6. 移除 Canvas。

OGL 不承载 Dot Field 交互主效果。Dot Field 如果进入工作区，应以独立、低密度、可暂停模块实现，并与环境层共享性能管理器，避免两个持续渲染循环。

## 12. 序曲适配

序曲是可选视觉入口，不是真实网络加载器。

- 只在 `APP_READY` 后挂载，因此不阻塞 SillyTavern 自身启动。
- 默认每个浏览器会话一次，设置可关闭。
- 正常流程：小光点旋转形成碎片圆盘 → 分解聚合意象 → 再聚合 `SILLYTAVERN` 标题与进入按钮。
- 标题采用已定稿的 in-pieces 式碎片字形语言，但代码与资产必须来自 Rhapsody 自有实现。
- “进入酒馆”必须是真实 `<button>`，支持键盘、清晰 focus 和屏幕阅读器名称。
- `prefers-reduced-motion` 下直接显示静态意象、标题与按钮。
- 初始化异常、资源缺失或 WebGL 失败时立即显示可用进入按钮，不让用户困在遮罩层。
- 用户进入后移除整个序曲 root、监听器和动画资源，而不是只设 `opacity: 0` 留在页面中。

序曲可以暂时捕获焦点和指针，因为这是用户主动开启的入口体验；除此之外，Rhapsody 的视觉层均不得拦截原生交互。

## 13. 设置中心接入

挂载流程：

```js
async function mountSettings(context, settings, signal) {
  if (document.querySelector('#rhapsody-settings')) return;

  const host = document.querySelector('#extensions_settings2');
  if (!host) return;

  const html = await context.renderExtensionTemplateAsync(
    'third-party/Rhapsody',
    'templates/settings',
    { settings },
  );

  host.insertAdjacentHTML('beforeend', html);
  const root = document.querySelector('#rhapsody-settings');
  root?.addEventListener('change', onSettingsChange, { signal });
}
```

实际安装目录名若与 `Rhapsody` 不同，模板路径常量必须同步。模板使用唯一 ID、标准 label 关联和原生控件，不创建 React portal 到原生页面。

设置分组建议：

1. 主题：Nocturne / Aubade、原生主题桥。
2. 序曲：启用、会话频率、减少动态效果。
3. 环境：启用、视差与静态回退状态。
4. 兼容：布局模式、静态降级、诊断状态。
5. 重置：只重置 Rhapsody 设置，不触碰 SillyTavern 主题与聊天数据。

## 14. 性能边界

- 禁止在 `scroll`、`pointermove`、流式 token 事件中强制同步布局。
- pointer 数据只记录目标值，在受控 RAF 中消费。
- 对 `getBoundingClientRect()` 进行批量读取，再批量写样式。
- CSS 模糊只用于少量大表面；不能给每条 `.mes` 建独立 backdrop layer。
- 不给长聊天历史中的每条消息添加永久动画或独立观察器。
- 字体使用本地 WOFF2 子集，并避免加载未使用字重。
- 插件禁用后，Performance 面板中不应残留 RAF、ResizeObserver 或事件回调。

## 15. 安全与隐私

- 核心运行不发起第三方网络请求。
- 自定义背景 URL 若以后加入，默认关闭，并清楚提示 IP、Referer、失效与离线风险。
- 设置中不记录聊天正文、角色卡内容或用户输入。
- 错误日志只记录模块名、兼容状态和异常，不打印消息数据。
- 不使用 `innerHTML` 插入用户可控文案；SillyTavern 模板渲染保持默认 sanitize。

## 16. 测试矩阵

### 16.1 必测页面

- 无角色欢迎页与最近会话列表。
- 单角色聊天、群聊、临时聊天。
- 长消息、代码块、引用、推理区、附件与图片。
- 消息编辑、删除、滑动、继续生成和停止生成。
- 输入多行、文件附件、断开连接与生成中状态。
- 原生设置抽屉、角色抽屉、世界书、popup、toast。
- Rhapsody 设置中心与序曲开关。

### 16.2 必测模式

- Nocturne / Aubade。
- 默认、`bubblechat`、`documentstyle`。
- 显示 / 隐藏头像、普通 / 大头像。
- blur / `no-blur`。
- `1280 × 720`、`1440 × 900`、定稿尺寸与高分辨率桌面。
- 100%、125%、200% 缩放。
- `prefers-reduced-motion`。
- OGL 完整、关闭、减少动态与 WebGL 失败。

### 16.3 第三方扩展

至少选择：

- 一个在聊天消息中插入内容的扩展；
- 一个有独立设置面板的扩展；
- 一个创建 popup 或浮层的扩展；
- 酒馆助手及其常见脚本环境。

检查重点是可读性、命中区、层级、SmartTheme 桥接和禁用恢复，而不是强行把第三方扩展改成完全相同的视觉。

## 17. 回归与发布门槛

每次支持新的 SillyTavern 版本：

1. 对照本文件重新探测必需与可选选择器。
2. 检查 `manifest`、`getContext()`、事件名与设置挂载点。
3. 跑完核心测试矩阵。
4. 更新“验证基线”，不要仅因为页面看起来正常就宣称兼容。
5. 对选择器变化使用新增兼容分支，不直接删除旧分支，直到最低支持版本提升。

可发布版本必须满足：

- 插件启用、切换主题、关闭环境层和禁用扩展均无未捕获错误。
- 禁用后原生 DOM 顺序与内容未改变。
- 无残留 Canvas、序曲遮罩、监听器和动画循环。
- clean / delete 后无 `extensionSettings.rhapsody`、`rhapsody:` 浏览器存储或 disabled-extension 注册残留。
- 无网络时双主题、字体回退、设置和核心视觉可用。
- SillyTavern 原生发送、编辑、删除、抽屉和弹窗流程完整可用。

## 18. V1 实现顺序

1. 建立 manifest、生命周期、设置 schema 与兼容探测。
2. 落地 `DESIGN-TOKENS.md` 为 `tokens.css`。
3. 完成 SmartTheme 桥、`#sheld`、`#chat`、消息与输入区。
4. 完成欢迎页、抽屉、popup 和原生模式兼容。
5. 完成紧凑设置中心。
6. 接入 OGL，并优先完成暂停、降级和销毁。
7. 最后接入可选序曲。
8. 通过测试矩阵后，再评估工作区布局实验与只读 Context Inspector。
