---
name: math-md-to-sympy-notebook
description: 'Convert awesome-exams math question markdown and answer markdown into a JupyterLite-ready .ipynb with SymPy code cells. Use when turning 数学分析/高代/线代等试题的 题目+答案 markdown into notebook, adding has-jupyter frontmatter, migrating proof text, generating SymPy-backed worked examples, beautifying symbolic output with IPython.display display/Math, or adding matplotlib-based plots when visualization helps for this repository.'
argument-hint: '题目 markdown 路径、答案 markdown 路径、目标 notebook 路径，及是否需要接入 has-jupyter'
user-invocable: true
disable-model-invocation: false
---

# Math Markdown To SymPy Notebook

## When to Use

- 将本仓库中的数学试卷题面 markdown 与答案 markdown 转成同目录 notebook。
- 为可计算题补上 SymPy 代码单元，同时保留题面和答案的 markdown 叙述。
- 为函数、曲线、曲面、区域或反例补上 `matplotlib` 图像，帮助读者直观看到结论。
- 为现有试卷页面补齐 JupyterLite 入口。
- 把一次性的转换过程整理成可重复执行的工作流，而不是手工临时拼装 notebook。

## Expected Inputs

- 同目录的题面文件与答案文件，通常形如 `XXX.md` 与 `XXX-答案.md`。
- 目标 notebook 路径，通常与题面同目录同名，只把扩展名改为 `.ipynb`。
- 默认把新建 notebook 的题面页面接入站点入口：在题面 markdown 中加入 frontmatter `has-jupyter: true`；只有用户明确要求不接入时才跳过。

## Repository Constraints

- 不编辑 `README.md`。
- 标题不需要重写；只在内容明显损坏时做最小修复。
- 保持 GitHub Markdown + LaTeX 风格。
- 不用脚本批量校对题面或答案；转换与校对应由模型逐题完成。
- 新增或修改 notebook 时，优先编辑课程源目录，不手工维护 `jupyter/` 下的课程镜像；仓库构建脚本会把源目录复制到 JupyterLite stage。
- 当代码单元需要把分段函数、导数、方程、矩阵或中间公式以更适合阅读的数学排版展示给读者时，除了 `import sympy as sp` 之外，还应显式加入 `from IPython.display import display, Math`。
- 当函数、曲线、曲面、区域、边界或反例可以直接用图像帮助理解时，代码中应优先加入一个 `matplotlib` 图像部分；若绘图需要网格或采样，可同时引入 `numpy`。
- display math 里避免 `\text{中文}`、`\tag{}`、`\boldsymbol{}`，并避免在 `$$` 与 `$$` 之间插入空行。

## Procedure

### 1. Confirm the Pairing and Scope

1. 找到题面 markdown 与对应答案 markdown。
2. 先快速确认题目结构已经稳定：大题、小题顺序清楚，答案文件可以一一对应。
3. 默认把这次转换视为“需要站点入口的 notebook”：准备在题面 markdown 顶部加入 `has-jupyter: true`；只有用户明确说明不需要入口时才不加。

### 2. Decide the Notebook Structure

1. notebook 放在题面同目录，文件名与题面保持一致。
2. 首个 markdown 单元写清楚：试卷名、来源文件名、以及本 notebook 的组织方式。
3. 默认采用下面的顺序组织每一道题：

   - 题目 markdown
   - SymPy 代码单元（仅在需要时）
   - 答案 markdown

4. 如果某道题没有自然的代码验证方式，可以直接保留“题目 + 答案”两段 markdown。

### 3. Transfer Questions in Order

1. 按题面原有顺序逐题迁移，不打乱大题和小题编号。
2. notebook 中的单元标题优先使用以下形式：

   - `## 一 计算`
   - `### 1-1 题目`
   - `### 1-1 答案`
   - 如果某大题没有小题，可用 `### 2 题目` 与 `### 2 答案`

3. 题目单元以题面 markdown 为准，只做最小量的标点、空格和公式清理。

### 4. Choose the Conversion Branch Per Problem

#### Branch A: Calculation-Heavy Problems

适用于极限、求导、积分、微分、方程求解、矩阵运算、显式反例计算等题。

1. 为该题加入一个 Python 代码单元。
2. 代码优先使用 SymPy，常见操作包括：

   - `sp.symbols`
   - `sp.limit`
   - `sp.diff`
   - `sp.integrate`
   - `sp.solve`
   - `sp.Matrix`
   - `sp.Piecewise`
   - `sp.simplify`

3. assumptions 要写明确，例如 `real=True`、`positive=True`、`integer=True`。
4. 如果题目对象适合图像表示，显式加入 `import matplotlib.pyplot as plt`，并在需要采样点或网格时加入 `import numpy as np`；2D 问题优先画函数图像、参数曲线、区域或轮廓，3D 问题优先画曲面或空间曲线。
5. 当结果需要更好的数学排版时，显式写入 `from IPython.display import display, Math`，并优先用 `display(...)` 或 `display(Math(...))` 展示公式、分段结果、矩阵和关键等式。
6. 先给出支撑答案结论的最小符号计算，再补一个服务于结论的 `matplotlib` 图像部分，不把 notebook 变成冗长推导脚本或纯展示脚本。
7. 普通返回值足够时直接让最后一行表达式输出；只有在分段函数、公式展示、矩阵展示或多结果并列时才引入 `display(...)` / `display(Math(...))`。

#### Branch B: Proof or Definition Problems

适用于定义题、连通性、紧致性、闭开性、可微性证明、一致连续性证明等题。

1. 先判断是否存在一个自然、短小、不会喧宾夺主的验证切入点，例如反例序列、边界值、函数差值、方向导数或几何量。
2. 只要存在这种切入点，就补一个最小代码单元做符号或数值验证。
3. 如果图像能直接表达反例、边界、区域、几何关系或函数行为，也优先补一个最小的 `matplotlib` 图像部分。
4. 直接迁移答案 markdown，并保持证明结构。
5. 完整证明仍保留在 markdown 中，代码只负责辅助验证，不替代论证。

#### Branch C: Mixed Problems

适用于“先算结论，再给证明”或“证明中含关键构造可由代码验证”的题。

1. 用代码单元验证关键表达式、极限值、偏导、反例序列或几何量。
2. 如果关键对象适合图像表示，也优先加入 `matplotlib` 图像部分，让图像与符号验证互相对照。
3. 如果验证结果本身适合用数学排版展示，同样显式加入 `from IPython.display import display, Math`，避免只给出难读的原始对象输出。
4. 用 markdown 保留完整证明、定义与论证链条。
5. 不要让代码替代证明文本本身。

### 5. Transfer and Clean the Answer Markdown

1. 答案内容以 `-答案.md` 为准。
2. 如果原答案里某个长公式放在行内非常难读，可转成 display math。
3. 只做与 notebook 可读性直接相关的清理，例如：

   - 合并明显断裂的公式
   - 把易混乱的多步推导拆成多个段落或 display math
   - 修正明显不稳定的 LaTeX 写法

4. 不要借机重写整份答案，也不要扩展成超出原题范围的新解法。

### 6. Keep Notebook Content Clean

1. 每道题的题目、代码、答案应当相邻，避免跨题交错。
2. 如果多个小题共享同一组符号，可以复用思路，但仍应保持每个小题有清晰边界。
3. 只要图像能直接表达函数、曲线、曲面、区域、边界或反例结构，就优先加入 `matplotlib` 绘图；绘图应服务于结论，而不是装饰 notebook。
4. 绘图部分应保持最小必要，避免堆叠多张用途重复的图。
5. 准备提交前，优先保持 notebook 为未执行或无多余输出的整洁状态。

### 7. Validate Before Finishing

1. 核对每一道题都已迁移，且顺序与题面一致。
2. 核对每个代码单元服务的就是紧邻那道题，而不是泛化到整张卷子。
3. 核对代码结论与答案 markdown 最终结论一致。
4. 核对 notebook 路径、题面路径、答案路径三者命名一致。
5. 默认确认题面 markdown 已含 `has-jupyter: true`；只有用户明确要求不暴露 notebook 入口时才例外。
6. 如果当前环境能做验证，优先执行代表性代码单元或至少检查 notebook 结构；如需发布站点，再从仓库根目录运行 `pnpm jupyter:build`。

## Completion Checklist

- notebook 已创建在正确目录。
- 首单元说明了来源文件与组织方式。
- 每道计算题都有最小且合理的 SymPy 代码，或有明确理由不加代码。
- 适合图像表示的题目已加入 `matplotlib` 图像部分，而不是只停留在符号结果。
- 需要美化公式输出的代码单元已显式加入 `from IPython.display import display, Math`，而不是只依赖原始文本输出。
- 每道证明题保留了原答案的证明链条，没有被代码替换掉。
- LaTeX 写法符合本仓库约束。
- 题面 markdown 已加 `has-jupyter: true`，除非用户明确要求不接入站点入口。
- notebook 内容整洁，没有明显无关输出或试验性单元。

## Example Requests

- 把 MA102a 某份期中题面和答案转成带 SymPy 代码的 notebook。
- 参照仓库里的标准数学转换样例，把这份数学分析题目+答案生成 ipynb。
- 为这份题面补 notebook，并只给计算题加代码、证明题保留 markdown。
