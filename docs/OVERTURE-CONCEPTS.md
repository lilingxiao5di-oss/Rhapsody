# Rhapsody Overture V2：意象与分镜定稿

> 状态：序曲视觉设计 v1.0 定稿，等待前端原型实现
> Figma：<https://www.figma.com/design/geCPu1HkkjPAmXA7AlqrJ9?node-id=36-7>

## 1. 当前结论

序曲完整参考 `Species in Pieces` 的动效语法：同一组碎片从加载状态出发，经错峰点亮、形态聚合、短暂停驻与再次分解，最后形成品牌入口。Rhapsody 不复制原项目的动物轮廓、原始多边形坐标、图片、字体、音频或业务实现。

当前版本不再使用随机意象池。每个主题只绑定一个固定意象：

- **Nocturne — Moonlit Lyre / 月下琴弦**；
- **Aubade — Aurora Fold / 曙光折幕**。

此前生成的候选图、空心圆环稿和早期 Aubade 稿继续保存在素材目录与 Figma `_Image Imports` 页，但不再作为活动方案的设计依据。

## 2. 点到圆盘加载器

真实加载阶段采用“点 → 旋转 → 小圆盘”的结构：

1. 中央出现一个极小亮点；
2. 亮点旋转并向外展开；
3. 30 枚三角碎片沿顺时针方向错峰显现；
4. 碎片最终组成一枚实心、克制的小圆盘；
5. 只有 Rhapsody 核心初始化进入 `Ready` 后，圆盘才继续分解并进入后续意象。

圆盘不是空心圆环，也不使用与真实状态无关的假百分比。Figma Motion 原型时长为 3.2 秒，共包含 32 个动画节点：圆盘容器、30 枚碎片和起始光点。

## 3. 八状态分镜

| 状态 | 名称 | 视觉职责 |
|---|---|---|
| 00 | Boot / Silent Field | 尽早覆盖画面，等待主题与控制器初始化 |
| 01 | Real Load / Point-to-Disc | 用点到圆盘的碎片动画承接真实加载 |
| 02 | Expansion | 小圆盘扩张，为诗句与意象变形释放空间 |
| 03 | Four-Line Interlude | 四句短文本依次错峰出现 |
| 04 | Motif Assembly | 30 枚碎片聚合为当前主题的固定意象 |
| 05 | Theme Cadence | 意象停驻约 0.9 秒，形成一次视觉休止 |
| 06 | Shard Wordmark Assembly | 碎片再次分解；`SILLY` 出现，30 枚碎片按每字母 5 枚组成 `TAVERN` |
| 07 | Wait for Click | 显示进入按钮并等待点击、Enter 或 Space |

最终点击后使用约 0.4 秒遮罩淡出，随后显露 SillyTavern 原生界面。`Esc` 可以跳过视觉层，但不能取消真实初始化。

## 4. 两个固定意象

### Nocturne — Moonlit Lyre / 月下琴弦

- 月弧、七条细弦和约 30 枚夜蓝/柔紫碎片；
- 只保留一枚低饱和旧金碎片作为节拍；
- 神话仅通过“琴”“月弧”和遥远回声暗示，不出现人物或神像；
- 运动更慢，余韵更长。

### Aubade — Aurora Fold / 曙光折幕

- 约 30 枚半透明碎片形成两至三条悬起的折叠光带；
- 光带从极细地平线的单一接触点向右上方展开，保留大面积内部留白；
- 使用冷晨灰背景、深板岩蓝、中间雾蓝、香槟金与象牙白高光，形成三档清晰明度；
- 神话只以 Eos / Aurora “掀起晨光帷幕”作为远景隐喻，不出现人物、羽翼或具象神祇。

## 5. 视觉与实现分工

- GPT-image-2：只提供意象轮廓、碎片密度、光线与氛围对照；
- Figma：分镜、可编辑标题、按钮、标注、主题令牌与 Motion 原型；
- CSS / SVG：背景、排版、遮罩、按钮、降级静态帧；
- JavaScript / OGL：碎片坐标、错峰显现、聚合/分解和运行时状态机；
- SillyTavern：原生 DOM、接口、数据与事件语义保持不变。

位图不作为插件运行时核心依赖。正式实现优先把意象还原为可程序化的 SVG/OGL 几何；位图仅用于设计对照与可选静态降级。

## 6. 设计资产

- 当前 V2 素材：`design-assets/overture-v2-inpieces-reference/`
- Nocturne 当前意象：`04-nocturne-moonlit-lyre-assembly.png`
- Aubade 当前意象：`07-aubade-aurora-fold-assembly.png`
- 点到圆盘 Motion 导出：`figma-motion-point-to-disc.mp4`
- Figma 截图核验：`figma-review/`

更精确的时间、状态门控与降级规则见 [`MOTION-SPEC.md`](MOTION-SPEC.md)。
