---
name: math-md-ipynb-review
description: 'Compare a math question markdown, its answer markdown, and the corresponding ipynb in awesome-exams-page. Use when auditing whether 题面/答案 markdown and notebook stay consistent, checking question order, answer fidelity, code-cell intent, plots, display/Math usage, notebook cleanliness, or deciding minimal fixes.'
argument-hint: '题面 markdown 路径、答案 markdown 路径、目标 notebook 路径，以及是只审查还是顺手修复'
user-invocable: true
disable-model-invocation: false
---

# Math Markdown And Notebook Review

## When to Use

- 对比一对题面 markdown、答案 markdown 与对应 notebook，确认三者是否一致。
- 审查一份已转换的数学 notebook 是否遗漏题目、错位答案、缺代码单元或缺图像。
- 在用户说“核对这份 ipynb 对不对”“看看 notebook 有没有和 md 对齐”“从题面/答案反查 notebook”时使用。
- 在准备发布 JupyterLite 前，对 notebook 做一次面向内容的质量检查。

## Expected Inputs

- 题面 markdown 路径，通常形如 `XXX.md`。
- 对应答案 markdown 路径，通常形如 `XXX-答案.md`。
- 对应 notebook 路径，通常与题面同目录同名，只是扩展名为 `.ipynb`。
- 可选说明：这次是“只做审查并汇报问题”，还是“发现问题后直接做最小修复”；如果用户只说“对比/核对/审查”，默认先走纯审查，如果用户明确说“修复/同步/补齐”，默认允许最小修复。

## Repository Constraints

- 不编辑 `README.md`。
- 不重写题目标题；只在三者不一致时做最小修复。
- 保持 GitHub Markdown + LaTeX 风格，不借对比之名重写整份题面或答案。
- 不通过脚本批量比对题面、答案和 notebook；应按题逐段人工对照。
- 只修改课程源目录中的 notebook 或 markdown，不手工维护 `jupyter/` 下的镜像。
- 重新检查 notebook 时，不要依赖过期的 cell 顺序或执行状态；先读取最新 notebook 摘要。
- 如需编辑 notebook，优先用 notebook-aware 的方式修改单元，而不是整文件粗暴覆盖。
- 如果 notebook 中某题已经有图像或 `display, Math`，除非与题意冲突，否则不要因为个人偏好删掉它。

## Procedure

### 1. Confirm the Trio and the Goal

1. 确认题面 markdown、答案 markdown、notebook 三个路径一一对应。
2. 先判断这次任务是：

   - 纯审查：列出问题、风险和最小修复建议。
   - 审查并修复：发现问题后直接做最小改动，并验证。

   如果用户没有显式说明，按用词决定默认模式：`对比`、`核对`、`审查`、`review` 默认走纯审查；`修复`、`同步`、`补齐` 默认走审查并修复。

3. 如果路径命名不一致，先指出这一点，再继续看内容是否实际上对应同一份试卷。

### 2. Build the Fastest Comparison Baseline

1. 先读取 notebook 最新摘要，确认：

   - 单元顺序
   - 哪些是 markdown，哪些是 code
   - 哪些代码单元已经运行过
   - 是否已有图像输出或公式输出

2. 再读取题面 markdown、答案 markdown，以及 notebook 中相关片段。
3. 不先做全量大扫荡；先建立一个可证伪的局部判断，例如“第 5 题的 notebook 少了图像单元”或“第 3-2 题答案顺序错位”。

### 3. Compare the High-Level Structure

1. 检查 notebook 是否按题面原顺序组织，没有打乱大题、小题编号。
2. 检查 notebook 是否维持清晰边界，通常为：

   - 题目 markdown
   - 代码单元（如需要）
   - 答案 markdown

3. 检查 notebook 首单元是否说明来源和组织方式。
4. 如果题面页面应暴露 notebook，顺手检查题面 markdown 是否含 `has-jupyter: true`。

### 4. Compare Per Problem

对每一道题按下面顺序核对。

1. 题目是否完整迁移，公式、条件、区间、参数范围有没有丢。
2. notebook 的代码单元是否服务于紧邻的这道题，而不是混入别题逻辑。
3. 答案 markdown 的最终结论是否与答案源文件一致。
4. 如果 notebook 里有 `display(Math(...))`、矩阵输出、极限值、积分值或解方程结果，检查它是否支持紧邻答案的最终结论。
5. 如果题目适合图像表示，检查 notebook 是否已有合理的 `matplotlib` 图像，而不是只停留在生硬的符号输出。

### 5. Use the Right Branch for Mismatches

#### Branch A: Structure Mismatch

适用于题号错位、题目和答案跨题串行、漏掉某小题、把多题混成一格。

1. 先指出具体错位发生在哪一道题。
2. 纯审查时，只给最小修复建议，不展开泛泛总结。
3. 如果允许修复，优先做最小重排或补单元，不重写无关内容。

#### Branch B: Answer Fidelity Mismatch

适用于 notebook 答案与 `-答案.md` 结论不一致、漏条件、漏结论、公式被改坏。

1. 以答案 markdown 为基准核对最终结论。
2. 如果 notebook 的代码结果和答案冲突，先判断是代码错了、展示错了，还是答案摘录错了。
3. 只修直接导致冲突的片段，不顺手重写整题推导。

#### Branch C: Code-Intent Mismatch

适用于代码单元跑出的对象与这道题无关、变量复用导致含义漂移、单元只剩实验性内容。

1. 检查代码是否仍然对应紧邻题目。
2. 如果能缩成一个最小符号验证，就缩到最小。
3. 删除明显无关的试验性片段，但不要删掉仍然支持结论的展示或图像。

#### Branch D: Missing Visualization or Presentation

适用于题目明显适合图像表示，但 notebook 只有冷冰冰的符号结果；或结果难读但没有 `display, Math`。

1. 判断图像是否能直接帮助理解函数、曲线、曲面、区域、边界或反例。
2. 若能，优先补一个最小必要的 `matplotlib` 图像。
3. 若公式输出难读，补 `from IPython.display import display, Math`，并用它展示关键结论。
4. 不把审查任务扩展成整份 notebook 的美化重做。

#### Branch E: Proof-Heavy Problems

适用于证明题、定义题、可积性/可微性/紧致性等题。

1. 先看 markdown 论证链是否保留完整。
2. 如果 notebook 有代码，检查它是不是只做辅助验证，而没有替代证明主体。
3. 如果存在自然验证切入点或图像切入点，检查 notebook 是否已经利用；没有也不必为凑代码而强加复杂单元。

### 6. Validate After Any Edit

1. 做出第一处实质修改后，立刻运行最窄的验证：

   - 优先运行被改的那个代码单元。
   - 或检查 notebook 摘要/结构是否仍然正确。

2. 如果只是审查模式，给出基于文件位置的具体 findings。
3. 如果做了修复，至少验证一个代表性单元，必要时再从仓库根目录运行 `pnpm jupyter:build`。

## Review Output Shape

纯审查模式下，输出优先按严重性列问题：

- 哪一道题有问题
- 问题类型是什么
- 为什么与题面/答案/notebook 之一不一致
- 最小修复建议是什么

修复模式下，输出优先说明：

- 修了哪几道题
- 每处修复解决了什么不一致
- 运行了哪些最小验证

## Completion Checklist

- 已确认三份文件路径真正对应同一份试卷。
- 已读取 notebook 最新摘要，而不是依赖旧的 cell 顺序印象。
- 已核对题目顺序、答案顺序和 notebook 单元顺序是否一致。
- 已逐题判断代码单元是否真的服务于紧邻题目。
- 已检查关键符号结果、`display(Math(...))` 输出或图像是否支持最终答案。
- 适合图像表示的题目，没有被错误地简化成只剩纯文本或纯符号输出。
- 若做了修改，已做至少一个与修改直接相关的最小验证。
- 没有扩散到无关题目或无关文件。

## Example Requests

- 对比这份 `题目.md`、`题目-答案.md` 和对应 `ipynb`，找出不一致处。
- 审查这份数学分析 notebook 有没有漏题、错题号、错答案。
- 以题面和答案为准，检查这份 notebook 的代码和图像是不是都对得上。
- 只做 review，不改文件：列出这份 md + ipynb 的主要问题和最小修复建议。
- 发现不一致就直接最小修复，再运行相关单元验证。