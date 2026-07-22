# Kimi：Rhapsody 创作与实现交接书

> 这不是一份要求逐像素照抄的施工单，而是一份创作委托。<br>
> 你的任务不是把若干现成效果拼在 SillyTavern 上，而是让 Rhapsody 成为一个完整、克制、可长期使用的数字作品。

## 1. 你被委托完成什么

Rhapsody 是 SillyTavern 的桌面端高级视觉扩展，包含两个主题：

- **Nocturne · 夜曲**：深邃、内省、具有紫蓝空间与极少量旧金节拍。
- **Aubade · 晨曲**：清醒、温暖、轻盈，以象牙白、雾灰、静蓝和少量旧金构成晨光。

项目希望获得 Awwwards 级别的完整前端设计感，但不追求营销网站式炫技。它应同时拥有：

- macOS 下 VS Code / Cursor 式的专业秩序；
- 古典音乐中的和谐、均衡、速度与休止；
- 诗歌中的留白、含蓄与节奏；
- 遥远、淡薄、不可一眼识别的神话隐喻；
- 稳定、丝滑、可长时间聊天的真实产品体验。

最终判断标准不是“用了多少效果”，而是整个界面是否像同一位作者完成的一件作品。

## 2. 你的创作权限

你拥有 Rhapsody 项目范围内的高度自主权。请深度思考、主动比较方案并持续迭代，不要把现有文档当成禁止优化的牢笼。

你可以自行：

- 修改、重构或替换 Rhapsody 仓库中的实现代码；
- 调整模块划分、CSS 架构、动画调度方式和插件自有 DOM；
- 改进设计令牌、间距、色彩、对比度、排版和运动参数；
- 在视觉结论更好时更新 Figma、设计文档和截图；
- 对现有设计提出反证，删除不必要的效果，重做不够成熟的页面；
- 选择原生 JavaScript、CSS、SVG、Canvas、OGL，或在插件自有 root 中局部使用 React；
- 在确有价值时引入 Vite / Rollup 等构建步骤和经过审核的本地依赖；
- 使用本地浏览器和 SillyTavern 开发环境反复验证真实体验；
- 创建实验分支、原型、Shader、动效草稿与视觉对照，再选择最好的结果；
- 为了整体艺术性偏离某个早期数值，只要同步更新规范并说明原因。

请把自己视为产品设计师、交互设计师、动效导演和前端工程师的共同体，而不只是执行代码生成的人。

### 不需要逐项请示的决定

- 一个 hover 是 125ms 还是 140ms；
- 某个光场应向左还是向右偏移；
- CSS 文件如何拆分；
- 是否把 React Bits 的思路重写为原生实现；
- 某个组件是否应该删除而不是继续装饰；
- OGL Shader、Geometry、uniform 和调度器的内部实现；
- 测试、日志、开发诊断和构建工具的内部结构。

### 必须保持或先取得用户确认的边界

- 项目名称 **Rhapsody** 及 Nocturne / Aubade 双主题身份；
- 不修改 SillyTavern 的聊天、角色、世界书、生成与持久化业务；
- 不移动、克隆、替换或删除 SillyTavern 核心 DOM；
- 不让 React 接管 `#chat`、`.mes`、`#send_form` 等原生树；
- 不把远程图床、远程字体、远程脚本或在线服务变成核心依赖；
- 不加入遥测、分析、上传、广告或未经说明的外部请求；
- 不把项目扩展为手机或平板产品；Rhapsody 只面向桌面；
- 不直接发布许可不明确的第三方源码、图像、音频、字体或多边形数据；
- 不在 Rhapsody 之外执行不可逆的大范围删除、移动或覆盖。

如果一个设计必须突破这些边界才能成立，先停下来说明原因，而不是静默扩大范围。

## 3. 首先阅读什么

建议按以下顺序建立完整上下文：

1. [README.md](README.md)：项目身份和边界。
2. [DESIGN-BRIEF.md](docs/DESIGN-BRIEF.md)：最高层审美纲领。
3. [VISUAL-DIRECTION.md](docs/VISUAL-DIRECTION.md)：共享视觉语言。
4. [WORKSPACE-DIRECTION.md](docs/WORKSPACE-DIRECTION.md)：已批准的工作区结构与 Figma 映射。
5. [DESIGN-TOKENS.md](docs/DESIGN-TOKENS.md)：Nocturne / Aubade 正式令牌。
6. [INTERACTION-SPEC.md](docs/INTERACTION-SPEC.md)：日常控件、消息、主题和环境运动。
7. [PERFORMANCE-ACCESSIBILITY.md](docs/PERFORMANCE-ACCESSIBILITY.md)：桌面帧时间、资源生命周期与无障碍门槛。
8. [SILLYTAVERN-ADAPTER.md](docs/SILLYTAVERN-ADAPTER.md)：SillyTavern 1.18 接入契约。
9. [OVERTURE-CONCEPTS.md](docs/OVERTURE-CONCEPTS.md)：序曲意象定稿。
10. [MOTION-SPEC.md](docs/MOTION-SPEC.md)：序曲状态机与时序。
11. [src/README.md](src/README.md)：当前代码骨架和模块入口。

文档具有不同层级：`DESIGN-BRIEF.md` 和产品边界最高；组件参数和早期结构可以在更好方案出现时修改。修改设计决定时，请同步修改对应文档，避免代码与意图分裂。

## 4. 当前代码基础

仓库已经具备一个不依赖构建工具的最小 SillyTavern 扩展骨架：

```text
manifest.json
index.js
style.css
package.json
src/
├── adapter/
│   ├── constants.js
│   ├── lifecycle.js
│   ├── selectors.js
│   └── settings.js
├── styles/
│   ├── tokens.css
│   ├── native-bridge.css
│   └── settings.css
└── ui/
    └── settings.js
templates/
└── settings.html
```

已经完成：

- SillyTavern `1.18.0` manifest 与 hook；
- 幂等初始化与禁用清理；
- 设置 schema、默认值和迁移基础；
- 原生选择器兼容探测；
- Nocturne / Aubade 状态属性；
- SmartTheme 可选桥接；
- 插件设置面板；
- Full / Reduced / Off 计算状态；
- clean / delete 持久化清理入口；
- 供未来模块注册 async disposer 的统一入口。

尚未实现：

- 工作区、消息、输入、drawer 和 popup 的正式视觉 CSS；
- 共享 RAF / Animation 调度器；
- Dot Field、Side Rays 或 OGL 环境；
- 角色 Flowmap；
- 欢迎页诗性排版；
- 序曲；
- 字体打包；
- 自动化测试与真实安装测试。

你可以重构骨架，但请保留或强化其可恢复、可销毁、失败不阻塞 SillyTavern 的性质。

## 5. 设计稿与项目内资产

### 5.1 Figma

主文件：<https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9>

关键画板：

- Workspace Cover：<https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=69-2>
- Workspace Foundations：<https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=70-2>
- Workspace Components：<https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=77-2>
- Nocturne Welcome：<https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=81-2>
- Nocturne Conversation：<https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=81-3>
- Rhapsody Settings：<https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=81-4>
- Aubade Welcome：<https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=81-5>

机器可读映射位于 `design-assets/workspace-v1/figma-build-state.json`。Figma 是设计依据，不意味着必须把其中每个辅助栏直接造成功能；原生 DOM 的真实能力以 `SILLYTAVERN-ADAPTER.md` 为准。

### 5.2 工作区截图

`figma-previews/` 包含：

- Nocturne Welcome / Conversation；
- Aubade Welcome；
- Settings；
- Foundations；
- Toolbar Action、Message Block、Settings Row 等组件图。

这些截图用于快速比较构图。实现时应回到 Figma Variables 和设计令牌，不从 PNG 取色或把截图当背景。

### 5.3 序曲活动参考

当前有效目录：

```text
design-assets/overture-v2-inpieces-reference/
```

重点：

- 从一个小光点旋转形成实心碎片圆盘；
- 圆盘分解、错峰点亮、聚合主题意象；
- Nocturne 使用 **Moonlit Lyre / 月下琴弦**；
- Aubade 使用 **Aurora Fold / 曙光折幕**；
- 再次分解并形成碎片式 `SILLY / TAVERN` 入口；
- 最终等待用户点击、Enter 或 Space。

目录 README 已区分“活动参考”和“归档参考”。不要重新启用归档画面，也不要直接把参考 PNG 当成正式动画。

旧目录 `design-assets/overture-concepts/` 只用于追溯设计过程，不是当前实现依据。

### 5.4 GPT-image-2 氛围参考

```text
design-assets/workspace-v1/nocturne-workspace-atmosphere-v1.png
design-assets/workspace-v1/nocturne-workspace-atmosphere-v1.prompt.md
```

它回答光场强度、负空间、碎片密度和旧金节拍面积，不是运行时壁纸。正式环境应以 CSS / SVG / OGL 重新生成。

## 6. 本地素材库

本机路径：

```text
D:\MySpecialFolder\ReactBits-Local-Library
```

运行方式：

```powershell
cd D:\MySpecialFolder\ReactBits-Local-Library
npm install
npm run dev
```

它是独立的 React + Vite 研究目录，不是 Rhapsody 的依赖，也不会随 GitHub 仓库自动提供给远程环境。

### 6.1 可运行效果

| 素材 | 本地目录 | 对 Rhapsody 的可能职责 |
|---|---|---|
| Line Sidebar | `src/effects/LineSidebar/` | 研究线性导航节奏；不要直接替换原生导航 |
| Side Rays | `src/effects/SideRays/` | 欢迎页或远景侧光；避免与主光场叠加过量 |
| Dot Field | `src/effects/DotField/` | 欢迎空白区、设置预览或低信息密度背景 |
| Border Glow | `src/effects/BorderGlow/` | 主动作、focus 或少量特殊状态，不能遍布所有卡片 |
| Playful Clip Menu | `src/effects/PlayfulClipMenu/` | 主题展示或独立创意表面，不替换高频原生导航 |
| OGL Flowmap Portrait | `src/effects/OGLFlowmapPortrait/` | 角色立绘的局部交互，不用于消息头像 |
| Fragment Assembly Loader | `src/effects/FragmentAssemblyLoader/` | 序曲技术起点；视觉和状态机以 Rhapsody 定稿重做 |

每个目录包含源码、CSS、`USAGE.md` 和 `metadata.json`。先读 metadata，再决定是复用、移植、重写或只参考视觉思路。

### 6.2 不要机械复制 React 组件

当前 Rhapsody 骨架是原生 ESM。你可以：

- 抽取算法和视觉语言，重写为原生 Canvas / CSS / OGL；
- 只在 Rhapsody 自有复杂 root 中局部挂载 React；
- 如果多个模块确实需要 React，再引入统一 bundler 和单一 React runtime；
- 删除组件中为演示站服务、但不适合长时间聊天的行为。

不要为了使用一个按钮或文字动画，把整个 SillyTavern 原生树交给 React。

### 6.3 完整 In Pieces 快照

素材库还保存：

```text
D:\MySpecialFolder\ReactBits-Local-Library\src\references\in-pieces
```

原始本地来源：

```text
D:\MySpecialFolder\in-pieces
```

参考重点：碎片聚合、错峰点亮、形态转换、阶段节奏和最终停驻。不要复制：

- 动物多边形坐标；
- 原始动物图像；
- 音频、字体、社交脚本和旧构建产物；
- 原始品牌表现；
- 与 Rhapsody 无关的场景切换代码。

Rhapsody 的序曲必须是独立实现，只借鉴运动语法。

## 7. 其他本地参考项目

### 7.1 SillyTavern 源码

```text
D:\MySpecialFolder\SillyTavern
```

当前核对基线为 SillyTavern `1.18.0`。这是 DOM、事件、设置、manifest hook 和扩展生命周期的第一事实来源。任何博客、旧脚本或参考项目与当前源码冲突时，以这里的真实实现为准。

不要修改 SillyTavern 仓库来让 Rhapsody 成立。开发安装应通过第三方扩展目录或 SillyTavern 的 Git URL 安装流程完成。

### 7.2 SleepTavernHome

```text
D:\MySpecialFolder\SleepTavernHome
```

这是酒馆助手模板与现代化界面项目，可以研究：

- `src/酒馆助手/现代化界面/index.ts`
- `host-context.ts`
- `extension-settings-module.ts`
- `character-management-module.ts`
- 对应 CSS、构建和发布流程

它适合回答“其他项目如何与酒馆交互、组织模块和打包”，不适合作为 Rhapsody 的直接架构：Rhapsody 是 SillyTavern 第三方扩展，不是酒馆助手脚本。SleepTavernHome 使用 Aladdin 许可证，复制代码前必须单独核对兼容性。

### 7.3 外部视觉与技术来源

- React Bits：局部高级效果语言。
- Codrops Demos：实验性菜单、Flowmap 和动效技术。
- Awwwards：整体完成度、排版和空间气质，不照搬营销页结构。
- Species in Pieces：序曲运动语言。
- VS Code / Cursor on macOS：日常专业工作区的秩序与密度。

外部网站只提供启发。不要把“像 Awwwards”误解为巨大标题、滚动劫持、满屏噪声和持续炫技。

## 8. 许可证与来源纪律

素材库不是“所有文件都可直接发布”的同义词。

### React Bits 四项素材

来源与提交记录在：

```text
D:\MySpecialFolder\ReactBits-Local-Library\SOURCE_MANIFEST.json
D:\MySpecialFolder\ReactBits-Local-Library\LICENSE.react-bits.md
```

记录的许可是 MIT + Commons Clause。它允许作为应用、网站或产品的一部分使用，但限制把组件本身、组件包或移植版本单独出售、再许可或再分发。Rhapsody 发布前必须保留要求的版权和许可文本，并重新确认开源插件内分发源码的具体适用方式。

### Playful Clip Menu

- Codrops 适配代码记录为 MIT；
- GSAP 是独立依赖，遵循 GSAP Standard no-charge license；
- 原演示的 Midjourney 图片和背景视频没有收入本地组件。

### OGL Flowmap Portrait

- 当前组件记录为独立实现；
- OGL 依赖记录为 Unlicense；
- Codrops / Robin Delaporte 演示只作技术参考；
- 不复制参考演示代码与图片，保留必要归因与来源记录。

### In Pieces

素材库记录指出：审计提交的 `package.json` 曾声明 ISC，但本地副本后来追加 MIT 文本并修改 license 字段；这些本地修改不是上游正式重新许可的证明。用户曾说明作者在 X 上允许非商业使用，但当前仓库没有保存可核验授权文件。

因此默认规则是：**只研究运动语言，正式代码独立实现，不发布原项目源码和资产。** 如果未来希望复制具体源码或媒体，先把可验证许可或作者授权保存到仓库，再决定是否纳入。

### 项目生成设计图

Rhapsody 仓库内 GPT-image-2 生成图与 Figma 截图是设计过程资产。位图默认只作参考；除非明确决定使用静态降级图，否则不进入运行时包。

### 任何新增来源

新增第三方代码或资产时必须记录：

- 名称与用途；
- 上游 URL；
- 精确版本或 commit；
- 获取日期；
- 许可证与版权要求；
- 是否修改；
- 是否进入运行时发布包。

## 9. 怎样把参考变成 Rhapsody

不要问“这个组件应该放在哪”，先问“这个页面需要什么体验”。

推荐思考顺序：

```text
信息和操作目标
→ 静态构图与排版
→ 交互状态
→ 必要的运动
→ 最后才选择素材或技术
```

每次加入效果前回答：

1. 去掉它后信息是否仍完整？
2. 它是主声部、伴奏、休止还是远景？
3. 它是否与同屏另一个效果争夺注意力？
4. 它能否在长时间聊天后仍令人舒适？
5. Nocturne 与 Aubade 是否共享同一结构逻辑？
6. 它是否可以被完整销毁？
7. 它的来源和许可证是否清楚？

如果答案不够好，重写或删除效果。艺术性常来自准确克制，而不是叠加。

## 10. 技术自主权与建议

当前推荐组合仍是：

```text
CSS 主视觉
+
原生 JavaScript 状态与交互
+
OGL 程序化环境
+
必要时插件自有 root 内的局部 React
```

这不是强制技术清单。你可以在深度分析后改变内部方案，但要满足：

- 一个共享 RAF 调度器；
- UI 动画跟随显示器刷新率；
- 默认完整桌面质量，DPR 上限 2；
- 不人为限制到 30 fps；
- 不按硬件自动切换低画质；
- 流式 token 不逐字动画；
- 输入、滚动与停止生成永远优先；
- OGL、Dot Field、Flowmap 不建立互相竞争的永久循环；
- 核心视觉离线可用。

如果引入构建工具，最终发布结构仍必须让 SillyTavern 从仓库根 `manifest.json` 找到可用 `js` 与 `css` 入口。不要让用户安装后还要执行 npm build。

## 11. 安装、禁用、清理与卸载契约

这是不可妥协的发布条件。

### 11.1 安装

- 用户应能从 SillyTavern 第三方扩展安装界面输入 GitHub URL 安装。
- 安装后的仓库必须已经包含浏览器可加载产物。
- 首次激活自动创建默认设置，不改写 SillyTavern 主题文件和聊天数据。
- 初始化失败时只降级 Rhapsody，不阻塞 SillyTavern。

### 11.2 禁用

禁用表示暂时停止扩展，**保留用户设置**。

必须移除：

- `body` 上所有 `rhapsody-*` class 和 `data-rhapsody-*`；
- 插件设置 root 之外的所有 Rhapsody 自有 DOM；
- 序曲、环境 Canvas、调试面板和临时 portal；
- DOM / EventSource / MediaQuery listener；
- MutationObserver / ResizeObserver / IntersectionObserver；
- RAF、timeout、interval 与 Web Animations；
- OGL Renderer、Program、Geometry、Texture、RenderTarget、Flowmap；
- Object URL、AudioContext、Worker、MessageChannel；
- `adoptedStyleSheets`、动态 `<style>` 和临时 font / image 资源引用。

禁用后原生 DOM 的身份、父子关系、业务值和焦点顺序与启用前一致。

### 11.3 Clean

SillyTavern 的 clean 操作经过用户确认，是清除扩展数据的破坏性操作。

必须：

- 先执行完整运行时 disable；
- 删除 `extensionSettings.rhapsody`；
- 删除 `localStorage` / `sessionStorage` 中所有 `rhapsody:` 前缀键；
- 删除未来可能建立的 Rhapsody IndexedDB、CacheStorage 或自有文件；
- 不删除或修改 SillyTavern、其他扩展和用户聊天数据。

### 11.4 Delete / Uninstall

删除扩展时，无论用户是否额外勾选 clean，Rhapsody 的 `delete` hook 都必须执行无残留清理。

卸载完成并刷新后应满足：

```text
Rhapsody 自有 DOM、class 与 data attribute = 0
extensionSettings.rhapsody = undefined
localStorage 中 rhapsody:* = 0
sessionStorage 中 rhapsody:* = 0
活动 RAF / Observer / WebGL context = 0
```

CSS 文件由 SillyTavern 随扩展移除；运行时规则必须全部以 `body.rhapsody-enabled` 或插件 root 作用域为入口，确保刷新前也不继续污染界面。

### 11.5 更新

- 设置变更必须通过 `schemaVersion` 迁移；
- 更新不能重置用户主题和开关；
- 旧模块销毁后才能创建不兼容的新资源；
- 不再使用的存储键、DOM 和缓存需要在迁移中清理；
- 更新失败时旧设置仍可读取，SillyTavern 仍可使用。

### 11.6 资源注册规则

未来每个功能模块都应返回 `destroy()`，并使用 `registerRhapsodyDisposer()` 接入统一逆序清理。创建资源的模块必须负责销毁，不把清理责任留给页面刷新。

## 12. 艺术完成度要求

Rhapsody 不应呈现为：

- React Bits 展示页；
- Awwwards 模板拼装；
- 霓虹赛博风；
- 古希腊神庙或华丽纹章主题；
- 每个卡片都发光的玻璃拟态组件库；
- 一张背景图加半透明面板；
- 为“高级”而持续慢动作的界面。

它应该呈现为：

- 静态截图已经成立，动画只是进一步赋予呼吸；
- 聊天正文始终是主声部；
- 主题之间同构，但光线和情绪真正不同；
- 空白、边界、字距、节奏和层级都经过思考；
- 环境像远处音乐，不像屏保；
- 诗性时刻稀少，因此出现时有意义；
- 使用数小时后仍然舒适；
- 关闭任何高级效果后仍是一套好设计。

## 13. 建议工作顺序

下面是建议，不是限制。若你有更好的风险排序，可以调整并记录原因。

### Phase 1：真实工作区基础

- 在本地 SillyTavern 安装骨架；
- 验证 manifest、settings、disable、clean、delete；
- 完成 `#sheld`、`#chat`、消息、输入、drawer、popup 的作用域 CSS；
- 先让 Nocturne / Aubade 静态界面成立。

### Phase 2：交互系统

- 建立共享 Animation / RAF 调度器；
- 完成 hover、focus、press、drawer、消息和主题切换；
- 先通过流式消息与长聊天压力测试。

### Phase 3：环境

- 选择 Dot Field、Side Rays 或原创 Shader 的真正职责；
- 建立单 Canvas / 单调度器 OGL 环境；
- 接入主题 uniform 与视差；
- 完成 WebGL failure / context loss / Reduced 回退。

### Phase 4：诗性页面

- 欢迎页；
- 角色开场；
- 章节过渡；
- 角色 Flowmap（只有确实提升体验时）。

### Phase 5：序曲

- 以 `MOTION-SPEC.md` 状态机实现；
- 使用原创碎片几何；
- 完成会话频率、预览、跳过和真实 Ready；
- 退出后完整销毁。

### Phase 6：发布审计

- 长会话性能；
- 键盘、Reduced / Off、forced colors；
- 第三方扩展兼容；
- 安装、禁用、clean、delete、重装循环；
- 来源、许可证、构建产物和离线检查。

## 14. 开发验收场景

至少验证：

- 欢迎页、单角色、群聊和临时聊天；
- 长消息、代码块、引用、推理、图片和附件；
- 流式生成、停止、编辑、删除、Swipe、继续；
- 原生 drawer、popup、toast 和扩展设置；
- Nocturne / Aubade 连续切换；
- Full / Reduced / Off；
- OGL 开关和 context loss；
- `1280 × 720` 到 `2560 × 1440`；
- 高刷新率显示器；
- 1000 条消息与 10 分钟流式输出；
- 禁用 / 启用 10 次；
- clean / delete / reinstall；
- 控制台无未捕获错误，资源数量不持续增长。

## 15. 决策记录

当你做出会影响项目方向的决定，请在相应文档或提交信息中记录：

- 解决了什么问题；
- 比较了哪些方案；
- 为什么当前方案更像 Rhapsody；
- 性能、兼容、许可证和清理代价；
- 如何验证。

不需要为微小 CSS 调整写长报告，但重要设计与架构不能只存在于聊天上下文。

## 16. 最后的委托

请不要满足于“可以运行”。

允许自己停下来重新看构图，允许删除已经写完但不够好的东西，允许把一个普通按钮、一个边界、一段留白打磨到真正准确。主动使用 Figma、浏览器、素材库和真实 SillyTavern 去判断，而不是只在代码中想象结果。

你有权优化方案、发展视觉并把局部做得比现有设计稿更好；同时你有责任保持 Rhapsody 的克制、离线、兼容、可恢复和无残留。

把它完成成一件艺术，而不只是一个皮肤。
