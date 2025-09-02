# agents.md

1. 这是上游项目[NikeTacoHub-Awesome-Exams](https://github.com/NikeTacoHub/awesome-exams/)的fork, 同样使用CC BY-NC-SA 4.0协议, 目标是保存markdown格式的awesome-exams内容, 同时以其为基础构建静态站点.
2. 本项目使用github markdown风格+latex表示数学公式, 并使用vitepress构建
3. 本仓库中应该遵守 `1.` `2. `等大题题目重构为 ## 一(中文) 换行 题目描述(如果没有不要造出来)
4. 本仓库中应该遵守小题目重构为 `### ${大题阿拉伯数字序号}-${小题阿拉伯数字序号}`的方式
5. 禁止通过脚本来实现校对, 所有的校对需要通过模型来实现
6. ASK模式下应该给出最小修复建议, 而不是过长的修复.
7. 模型禁止编辑`README.md`文件
8. 不需要对标题进行编辑

> 下面是markdown+ $\LaTex$ 文件校对需要参考的细节

1. `\left` `\right` 如果不需要括号, 需要写成 `\left.` `\right.`
2. `\left(` 如果与`\begin`块有关则不可取代, 其他场景可以替换为 `(`, 同理对`\right)`
  2.1 `\left[` 如果与`\begin`块有关则不可取代, 其他场景可以替换为 `[`, 同理对`\right]`
  2.2 `\left{` 如果与`\begin`块有关则不可取代, 其他场景可以替换为 `{`, 同理对`\right}`
  2.3 `\left|` 如果与`\begin`块有关则不可取代, 其他场景可以替换为 `|`, 同理对`\right|`
  2.4 以此类推
3. 不能使用`\boldsymbol{v}`, 不支持`\boldsymbol`
4. 需要将 `\begin{array}{ccc|c}`里面的cc数量对齐, 下面每一行有x个&, 这里就得有 x+1个c
5. `\begin{array}{ccc:c}`里面不能用`:`, 只能用`|`
6. 不能使用 `\tag{}`, 建议用 `\quad \quad \quad (1)`
7. `\rvert\` 替换为 `\mid`, `\lvert\` 替换为 `\mid`
8. 需要确保$$$$符号之间的多行公式没有空行
9. 不需要将 $f^{\prime}(x)$ 改为 $f'(x)$
10. 填空题使用 $\underline{\quad\quad\quad}$ 表示待填空白
11. 在四个美元符号（$$$$）之间，不要使用 `\text{中文字符}`，即使加了xeCJK也会随机弹出warning，还会出现白框问题
12. 四个美元符号之间最好不要带空格，最多加一行`\quad`分割
