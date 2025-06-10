# 文件校对

> 下面是markdown+$\LaTex$文件校对需要参考的细节

0. 校对任务中模型不能使用任何工具, 只能输出文本
1. `\left` `\right` 如果不需要括号, 需要写成 `\left.` `\right.`, 不能后面不接任何符号
2. 不能使用`\boldsymbol{v}`, 不支持`\boldsymbol`
3. 需要将 `\begin{array}{ccc|c}`里面的cc数量对齐, 下面每一行有x个&, 这里就得有 x+1个c
4. `\begin{array}{ccc:c}`里面不能用`:`, 只能用`|`
5. 不能使用 `\tag{}`, 建议用 `\quad \quad \quad (1)`
6. `\right\rvert\` 替换为 `\right|`
7. 需要确保$$$$符号之间的多行公式没有空行
