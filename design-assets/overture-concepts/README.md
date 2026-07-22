# Overture concept keyframes

> 归档状态：保留设计过程，但不再作为当前 V2 方案的参考。当前活动意象与分镜见 `../overture-v2-inpieces-reference/`。

这组八张 16:9 氛围图与关键帧通过内置图像生成路径的 GPT-image-2 生成，用于 Rhapsody Overture 的意象研究与 Figma 设计稿，不是运行时必须加载的远程素材。

## 文件

- `nocturne-moonlit-lyre.png`
- `nocturne-constellation-score.png`
- `nocturne-orphic-echo.png`
- `aubade-dawn-horizon.png`
- `aubade-golden-strings.png`
- `aubade-morning-manuscript.png`
- `sequence-dual-title-assembly.png`
- `sequence-wait-for-click.png`

## 共用提示词骨架

```text
Use case: stylized-concept
Asset type: Rhapsody Overture desktop motion-design keyframe, landscape 16:9
Style: Awwwards-grade generative motion design, restrained editorial minimalism,
clean WebGL/OGL-ready geometry, generous negative space
Constraints: original geometry; no text, letters, logo, buttons or watermark;
no people, animals, gods, statues, temples, columns or literal mythology;
implementable with polygon fragments, lines, particles, gradients and blur in OGL/CSS
Avoid: fantasy game splash art, neon cyberpunk, maximalism, literal classical decoration,
copying identifiable artwork or Species in Pieces polygon coordinates
```

## 八个最终提示方向

1. **Moonlit Lyre**：深墨蓝空间；碎片汇聚成不完整月弧；七道极细琴弦穿过月弧；一个旧金确认点。
2. **Constellation Score**：五条弯曲、断续、不可读的谱线路径；星点与少量碎片连接；禁止音符和星座符号。
3. **Orphic Echo**：三层不完整回声圆环；一条波纹被切断后重新接续；禁止人物、乐器和科幻传送门。
4. **Dawn Horizon**：象牙白与雾灰空间；极细地平线；半圆晨光只被暗示；尘埃和碎片轻微上浮。
5. **Golden Strings**：七道竖直细线；晨光沿局部上行点亮；不形成完整乐器；金色必须低饱和、低面积。
6. **Morning Manuscript**：两层错位半透明纸面；五条断续谱线；斜向窗光；禁止可读文字、书桌和复古手稿装饰。
7. **Dual-title Assembly**：深色空间中，碎片错峰汇聚为上下双标题的抽象承载区域；底部保留克制的入口按钮轮廓；禁止生成文字。
8. **Wait for Click**：碎片退向边缘，中央形成窄而明亮的门框与旧金落点，表达“加载完成、等待用户进入”的静止终态；禁止生成文字。

生成图中的文字区域刻意留空。准确的 `Rhapsody · 狂想曲`、`SillyTavern` 与 `进入酒馆` 均在 Figma 或正式代码中叠加。
