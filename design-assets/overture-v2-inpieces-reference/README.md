# Overture V2 Design References

本目录保存 Rhapsody 序曲 V2 的 GPT-image-2 视觉对照、Figma 核验截图和 Motion 导出。

## 当前活动参考

- `04-nocturne-moonlit-lyre-assembly.png`：Nocturne 固定意象 **Moonlit Lyre / 月下琴弦**；
- `07-aubade-aurora-fold-assembly.png`：Aubade 固定意象 **Aurora Fold / 曙光折幕**；
- `figma-motion-point-to-disc.mp4`：点到实心小圆盘的 Figma Motion 原型；
- `figma-review/01-point-to-disc.png`：点到圆盘静态终态；
- `figma-review/02-expansion.png`：小圆盘释放碎片的扩张状态；
- `figma-review/04-motif-assembly.png`：Nocturne 意象画板；
- `figma-review/aubade-aurora-fold-frame.png`：Aubade 高对比度意象画板；
- `figma-review/06-shard-wordmark-assembly.png`：30 枚碎片组成 `TAVERN` 的过渡状态；
- `figma-review/07-shard-wordmark-entry.png`：Nocturne 最终入口画板；
- `figma-review/aubade-shard-wordmark-entry.png`：Aubade 最终入口画板；
- `figma-review/storyboard-v4-current.png`：当前八状态总览；
- `figma-review/theme-board-v4-current.png`：Nocturne / Aubade 的同构加载器、固定意象与碎片字标对照。

## 归档但不再参考

- `01-nocturne-loading-ring.png`；
- `01-aubade-loading-ring.png`；
- `05-aubade-first-light-assembly.png`；
- `06-nocturne-entry-cadence.png`；
- `figma-motion-loader-ring.mp4`；
- `figma-review/aubade-loader.png`；
- `figma-review/aubade-first-light-frame.png`；
- `figma-review/07-wait-for-click.png`；
- `figma-review/theme-translation.png`；
- `figma-review/storyboard-v3-current.png`；
- `figma-review/theme-board-current.png`；
- `figma-review/storyboard-overview.png`（包含旧圆环阶段，仅作过程记录）。

这些文件保留用于追溯设计过程，不应被实现代码、最新文档或当前 Figma 活动画板引用。

## 使用原则

位图只用于视觉对照和可选静态降级，不是插件的核心运行时依赖。正式实现应将碎片、线条、光点和聚合过程重建为 CSS/SVG/OGL 几何。
