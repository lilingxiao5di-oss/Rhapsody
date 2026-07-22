# Rhapsody 性能与无障碍规范

> 状态：Approved 1.0<br>
> 定稿日期：2026-07-22<br>
> 平台范围：桌面浏览器<br>
> 性能方针：视觉质量优先，稳定帧时间高于效果数量

## 1. 项目立场

Rhapsody 不为手机、平板竖屏或低端硬件设计独立版本，也不设置自动识别硬件后降低视觉质量的性能档位。

“不担心电脑性能”不等于允许浪费主线程或制造卡顿。Rhapsody 的默认实现应使用完整视觉质量，同时通过正确的渲染架构确保：

- 鼠标、键盘、输入、滚动和原生操作始终优先；
- CSS、DOM 与 OGL 不互相建立多个竞争循环；
- 动画跟随显示器刷新率，不人为限制到 30 fps；
- 视觉复杂度不引入不稳定帧时间；
- 长时间聊天后资源数量保持稳定；
- WebGL 或单个效果失败不会影响 SillyTavern。

项目只提供“完整 / 减少 / 关闭动态效果”，这是舒适度和无障碍选项，不是低、中、高硬件档。

## 2. 支持范围

### 2.1 视口

- 推荐：`1440 × 800` CSS px 及以上。
- 最低设计验证：`1280 × 720` CSS px。
- Figma 主定稿：`1707 × 876`。
- 小于 `1280 × 720` 不属于 Rhapsody 布局验收范围。
- 不实现手机断点、触摸优先导航和移动端资源降级。

若视口低于最低范围，Rhapsody 不得破坏 SillyTavern 原生功能；实验性工作区布局应停止应用，但这只是安全回退，不代表移动端适配。

### 2.2 浏览器

开发验证基线：

- 当前稳定版 Chromium / Chrome / Edge；
- 当前稳定版 Firefox；
- SillyTavern 官方桌面运行方式使用的浏览器内核。

浏览器缺少 WebGL2 或关键扩展时，环境层回退为 CSS 静态光场。核心主题、聊天与设置仍可用。

### 2.3 输入设备

- 鼠标；
- 触控板；
- 键盘。

不为触摸手势设计替代交互。所有功能仍必须能通过键盘完成。

## 3. 流畅度目标

### 3.1 帧率策略

- UI 动画使用浏览器合成器并跟随显示器刷新率。
- OGL 使用原生 `requestAnimationFrame`，不做 30 fps 节流。
- 60Hz 环境的验收目标是稳定接近 60 fps。
- 90/120/144Hz 环境不设置人为 60 fps 上限；实际帧率由显示器、浏览器调度和帧时间决定。
- 页面隐藏时暂停 RAF；恢复后重置 `deltaTime`，避免第一帧跳跃。

### 3.2 帧时间

以 60Hz 为最低验收基线：

| 指标 | 目标 |
|---|---:|
| 单帧总预算 | `16.67ms` |
| 日常动画 p95 | `<= 16.67ms` |
| 日常动画 p99 | `<= 25ms` |
| 主线程脚本平均占用 | `<= 4ms / frame` |
| Style + Layout 平均占用 | `<= 4ms / frame` |
| 正常交互 Long Task | 不出现 `> 50ms` |
| 点击后的首个视觉反馈 | 下一帧，通常 `<= 16.67ms` |

高刷新率下优先缩短脚本和布局时间，不通过丢帧计数器主动降帧。

### 3.3 交互响应

- 按钮 press、focus 与选中状态必须在下一帧可见。
- 文本输入、IME、粘贴和删除不能等待动画或 WebGL。
- 滚动监听器不执行同步布局测量。
- 主题切换、环境更新和设置保存不能阻塞发送消息。
- 正常桌面交互的 INP 目标为 `<= 100ms`，不得超过 Web Vitals 的 `200ms` 良好阈值。

### 3.4 稳定性

- 正常页面切换不产生由 Rhapsody 引起的可见 Layout Shift。
- 反复开关主题、抽屉和环境层后，监听器、Canvas、Program 与纹理数量回到稳定值。
- 连续运行 30 分钟不得出现持续增长的 JS heap 或 GPU 资源。
- 禁用扩展后，Rhapsody 的 RAF、Observer、Animation 和 WebGL 资源必须归零。

## 4. 单一动画调度器

所有逐帧程序化效果共享一个调度器：

```text
requestAnimationFrame
├── 读取时间与缓存输入
├── 更新指针阻尼
├── 更新 OGL 环境
├── 更新 Dot Field / Flowmap（启用时）
├── 执行一次 render
└── 决定下一帧是否继续
```

禁止：

- OGL、Dot Field 和 Flowmap 各自拥有永久 RAF；
- 使用 `setInterval(..., 16)` 模拟帧循环；
- 每个组件建立独立 pointermove 渲染；
- 在同一帧多次调用全屏 Renderer。

调度器应支持注册模块，但最终只执行一次帧请求。关闭某个效果只注销模块，不销毁其他效果所需的 Renderer。

## 5. OGL 渲染规范

### 5.1 Renderer

- 一个页面最多一个全屏环境 Canvas。
- 优先一个 Renderer；角色局部 Flowmap 若无法共享，应明确说明第二个 context 的必要性。
- 默认 DPR：`Math.min(window.devicePixelRatio, 2)`。
- 不提供 DPR 1 / 1.5 的自动低端降级。
- Resize 只在下一帧合并执行一次。
- Canvas 尺寸没有变化时不重复分配 buffer。

DPR 上限 2 是为了稳定帧时间和避免无意义的超采样，不是低画质模式。细节质量应主要来自 Shader、抗锯齿策略和合理几何，而不是无限提高像素数量。

### 5.2 Shader 与 Program

- Shader 在环境层淡入前完成编译和首次 warm-up。
- Program、Geometry、Texture、RenderTarget 在初始化阶段创建并复用。
- 主题切换只更新 uniform，不重新编译 Shader。
- 动画循环内禁止创建数组、对象、颜色实例或临时纹理。
- Uniform 容器保持稳定，只更新已有数值。
- 随机粒子位置在初始化或明确重置时生成，不逐帧重新随机。

### 5.3 几何与粒子

- 使用 TypedArray 并复用 buffer。
- 多个相同元素优先批处理或 instancing。
- 不用大量独立 DOM 元素模拟粒子。
- 不为了表现“丰富”叠加两套不可区分的粒子系统。
- 粒子数量由画面结论决定，不由硬件档位决定。
- 视觉密度调整属于设计定稿，需要重新审阅，而不是运行时随机波动。

### 5.4 指针

- `pointermove` 只缓存最后坐标、时间和必要速度。
- 坐标转换使用已缓存 rect；只在 resize 或布局变化后重新测量。
- 指针更新在 RAF 中消费。
- 使用 `deltaTime` 阻尼，避免 60Hz 与 144Hz 下手感不同。
- 速度、位移、亮度和 Flowmap 注入力都必须限幅。

### 5.5 连续环境运动

Rhapsody 允许环境层持续缓慢运动。只要 uniform 或粒子状态仍变化，就保持全速 RAF，而不是以 20/30 fps 离散更新。

以下情况停止：

- `document.hidden === true`；
- 环境层被用户关闭；
- Reduced / Off 使用静态光场；
- WebGL context lost；
- 扩展禁用或 Canvas 卸载。

纯静态状态没有逐帧变化时可以停止 RAF，这是避免无效工作，不是画质降级。

### 5.6 Context Loss

- 监听 `webglcontextlost` 并 `preventDefault()`，停止环境循环。
- 显示 CSS 静态光场，不显示错误遮罩。
- 可尝试一次受控恢复；失败后保持静态。
- 不在恢复循环中持续创建 Renderer。
- 错误日志不包含聊天或角色内容。

## 6. CSS 性能

### 6.1 优先动画属性

优先：

- `transform`；
- `opacity`；
- 已验证不会触发布局的颜色与轻量材质变化。

谨慎：

- 大面积 `box-shadow`；
- `filter`；
- `backdrop-filter`；
- 大面积渐变位置动画。

禁止用于高频动画：

- `width`、`height`；
- `top`、`left`、`right`、`bottom`；
- `margin`、`padding`；
- 字体大小和行高；
- 全页面 blur 半径持续变化。

### 6.2 Backdrop Filter

- 只用于顶栏、输入区和少量浮层。
- 消息列表不为每条 `.mes` 建独立 backdrop layer。
- 不动画 blur 半径。
- `body.no-blur` 下立即移除。
- Aubade 的浅色表面优先依靠不透明度和边界，不靠高强度 blur 制造层次。

### 6.3 Transition 范围

禁止：

```css
* {
  transition: all 300ms;
}
```

必须为明确属性和明确组件声明 transition。主题切换只覆盖当前视口的主要表面，不能给长聊天中的每个后代添加 transition。

### 6.4 `will-change`

- 只在动画开始前设置。
- 动画结束后清除。
- 环境 Canvas 可保持自身合成层；普通消息不可永久 `will-change`。
- 禁止给 `#chat *` 或全部按钮建立合成层。

### 6.5 Containment

Rhapsody 自有设置预览、环境 Canvas 和独立装饰模块可以使用合适的 `contain`。不得给需要原生定位、sticky 或 popup 参照的 SillyTavern 容器盲目添加 `contain`。

## 7. DOM 与事件性能

### 7.1 消息

- 动态消息依靠原生事件和 CSS 自动匹配。
- 不扫描全部历史来处理一条新消息。
- 不为每条 `.mes` 建立 MutationObserver、ResizeObserver 或 pointer listener。
- 历史消息不逐条播放动画。
- 流式生成不为 token 创建 Animation。

### 7.2 事件委托

- 设置中心与插件自有 UI 使用 root 事件委托。
- 原生消息操作尽量只使用 CSS `:hover`、`:focus-within` 和原生事件。
- 所有监听器使用可回收引用或 `AbortController.signal`。
- 高频监听器使用 `{ passive: true }`，前提是无需阻止默认行为。

### 7.3 读写分离

一帧内按以下顺序：

```text
读取：尺寸、滚动、缓存状态
→ 计算：目标值、阻尼、uniform
→ 写入：class、style、uniform
→ render
```

禁止交替执行 `getBoundingClientRect()` 与 style 写入造成 forced reflow。

### 7.4 MutationObserver

- 纯 CSS 能覆盖动态节点时不使用。
- 必须使用时限定到最小父节点和最少 mutation 类型。
- 回调只收集变化，在下一 RAF 合并处理。
- 禁止永久观察 `document.body` 的全部 subtree 与 attributes。

## 8. 字体与资源

- 字体、SVG、Shader、OGL 和核心视觉全部本地提供。
- 字体使用 WOFF2，只打包实际需要的字重与字符范围。
- Noto Sans SC 正文常用字重优先加载。
- Cormorant Garamond 只加载诗性场景需要的 Medium 与 Italic。
- 首屏必要字体可以 preload；其他字体延后加载。
- `font-display` 策略必须避免界面长时间不可见。
- 图标优先本地 SVG 或 SillyTavern 已有图标，不加载远程 icon font。
- 设计截图、提示词和参考项目不得进入运行时 bundle。

## 9. 初始化

### 9.1 非阻塞顺序

```text
读取设置与兼容探测
→ 立即应用 CSS 主题
→ 挂载设置面板
→ 等待 APP_READY
→ 初始化 OGL / 编译 Shader
→ warm-up
→ 环境层淡入
→ 可选序曲
```

- CSS 主题不能等待 OGL。
- OGL 失败不能阻止设置与聊天。
- 序曲只在 `APP_READY` 后运行，不假装代表真实网络进度。
- Shader warm-up 期间保持静态 CSS 背景，避免第一帧黑闪。

### 9.2 首次交互

如果初始化尚未完成而用户已经操作 SillyTavern：

- 原生操作优先；
- 环境初始化可以继续或推迟；
- 不显示全局“正在优化”遮罩；
- 不在第一次发送时同步编译 Shader。

## 10. 长会话

Rhapsody 需要在长聊天中保持与空白欢迎页相同的操作流畅度。

- 消息数量增加不能线性增加插件监听器数量。
- 环境 Renderer 与聊天消息数量无关。
- CSS 选择器避免从 `body` 开始的复杂深层 `:has()` 热路径。
- 不在滚动时计算每条消息可见度。
- 章节标记如需观察，只观察有限的插件自有节点。
- 设置预览关闭后停止其动画和渲染。

## 11. 内存与销毁

### 11.1 必须销毁

- RAF 与 timeout；
- Web Animations API 实例；
- EventSource listener；
- DOM event listener；
- MutationObserver / ResizeObserver；
- Canvas；
- OGL Program、Geometry、Texture、RenderTarget 引用；
- 临时主题过渡 class 和 data attribute；
- 序曲 root 与其焦点管理。

### 11.2 泄漏验证

执行以下循环后比较 heap、listener 与 GPU 资源：

```text
主题切换 50 次
环境开关 20 次
打开 / 关闭设置 50 次
切换聊天 30 次
播放 / 退出序曲 10 次（测试模式）
禁用 / 启用扩展 5 次
```

完成 GC 后，资源数量应回到稳定平台；不得随循环次数持续增长。

## 12. 无障碍目标

Rhapsody 不宣称在未验证前满足完整 WCAG 等级，但以下内容是发布门槛。

### 12.1 键盘

- 所有原生操作保持原生 Tab 顺序。
- 插件设置、主题切换与序曲按钮可用键盘操作。
- Focus-visible 始终清晰。
- Escape 关闭最上层 Rhapsody UI。
- Popup 关闭后焦点回到触发器。
- 装饰 Canvas、碎片和光场不进入焦点顺序。

### 12.2 语义

- 使用真实 `button`、`label`、`input`、`select`，不以 `div` 模拟控件。
- 图标按钮具有可访问名称。
- 设置说明通过 `aria-describedby` 与控件关联。
- 序曲 root 使用合理的 dialog 语义；“进入酒馆”是明确按钮。
- Canvas 使用 `aria-hidden="true"`。
- 状态变化需要可读文字，不只使用颜色或动画。

### 12.3 颜色与对比度

- 普通正文目标对比度至少 `4.5:1`。
- 大文本目标至少 `3:1`。
- Focus、控件边界和必要非文本状态目标至少 `3:1`。
- `text-muted` 不承载必须读取的信息。
- Nocturne 与 Aubade 分别验证，不能用深色主题结果推断浅色主题。
- Hover 不是唯一状态；选中与错误需要静态可辨识结构。

### 12.4 动态效果

- 默认尊重 `prefers-reduced-motion`。
- 设置提供 Full、Reduced、Off。
- Reduced 停止视差、Flowmap 和持续 OGL，使用静态光场。
- Off 移除所有非必要 transition 与 animation。
- 功能反馈在 Reduced / Off 下仍以静态状态立即出现。
- 不使用快速闪烁、强对比频闪或大面积明暗脉冲。

### 12.5 缩放与桌面范围

- 在满足最低 `1280 × 720` CSS 视口的前提下验证浏览器缩放。
- 文本放大不能被固定高度裁切。
- 设置字段允许自然增高，标签不能覆盖值。
- 不承诺在缩放后 CSS 视口低于最低桌面范围时重排为手机界面。

### 12.6 Forced Colors 与 No Blur

- `forced-colors: active` 时移除非必要背景图、阴影与透明材质。
- 保留系统按钮、边界、文字与 focus 颜色。
- `body.no-blur` 优先，Rhapsody 不重新启用 backdrop blur。

## 13. Reduced 与故障回退不是性能档

以下情况允许使用静态视觉：

- 用户选择 Reduced / Off；
- 操作系统请求减少动态；
- WebGL 不可用；
- WebGL context lost 且恢复失败；
- 扩展正在禁用或页面隐藏。

以下情况不自动降低画质：

- 检测到某个 CPU / GPU 型号；
- 浏览器 UA 被判断为“旧电脑”；
- 聊天消息数量增加；
- 电池状态变化；
- 短暂单帧抖动。

如果完整效果长期达不到帧时间目标，应优化实现或删减没有视觉价值的工作，而不是在用户不知情时切换模糊的低画质模式。

## 14. 测试场景

### 14.1 动画压力组合

同时执行：

1. OGL 环境持续运动。
2. 指针快速跨越工作区。
3. 打开原生 drawer。
4. 切换主题。
5. 流式生成长消息。
6. 在输入区持续键入。

输入、滚动和停止生成仍需即时响应。

### 14.2 长聊天

- 1000 条混合长度消息。
- 包含代码块、引用、图片、附件和推理区。
- 连续流式输出 10 分钟。
- 快速滚动顶部与底部。
- 加载更多历史消息时检查滚动锚点。

### 14.3 视觉切换

- Nocturne / Aubade 连续切换 50 次。
- Full / Reduced / Off 切换。
- OGL 开 / 关与 context loss。
- `no-blur` 与 `forced-colors`。
- 欢迎、聊天、设置和 popup 之间往返。

### 14.4 桌面尺寸

- `1280 × 720`。
- `1440 × 900`。
- `1707 × 876` 定稿尺寸。
- `1920 × 1080`。
- `2560 × 1440` 与高刷新率显示器。

不建立手机和平板测试矩阵。

## 15. 测量方法

### Chrome / Edge Performance

- 录制至少 20 秒交互压力组合。
- 检查 FPS、Main、Compositor、GPU、Long Task 与 forced reflow。
- 分别录制 OGL 开启和关闭，确认瓶颈归属。

### Performance Monitor

- 观察 DOM node、JS heap、event listener、layout / sec 与 GPU memory 趋势。
- 执行泄漏循环，确认数量达到平台而非持续增长。

### 自定义开发诊断

开发版可以提供不进入正式 UI 的诊断开关：

- RAF 实际间隔与 p95 / p99；
- 每帧 update / render 时间；
- Renderer 与模块数量；
- Canvas 尺寸和 DPR；
- 当前 motion / environment 状态。

诊断面板不得读取或输出聊天正文。

## 16. 发布门槛

- 60Hz 测试中，日常动画 p95 帧时间不超过 `16.67ms`。
- 高刷新率测试中没有人为 30/60 fps 锁定。
- 普通交互不出现 `> 50ms` Long Task。
- 输入、滚动、停止生成不被 OGL 或主题切换阻塞。
- 主题切换无整页白闪、黑闪或布局跳变。
- 长聊天不会增加插件级监听器和渲染循环。
- 环境、设置、序曲与扩展均可完整销毁。
- Nocturne / Aubade 的正文、焦点和状态对比度通过检查。
- 键盘可完成所有 Rhapsody 自有操作。
- Reduced / Off 保持功能完整。
- WebGL 失败只影响环境，不影响 SillyTavern。
- 核心视觉和字体离线可用。
