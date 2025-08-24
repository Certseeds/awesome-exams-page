1. `\left` `\right` 如果不需要括号, 需要写成 `\left.` `\right.`
2. `\left(` 如果在 `\begin{array}`内部则不可取代, 其他场景可以替换为 `(`, 同理 `\right)` 替换为 `)`, 对中括号, 大括号等同样有效
3. 不能使用`\boldsymbol{v}`, 不支持`\boldsymbol`
4. 需要将 `\begin{array}{ccc|c}`里面的cc数量对齐, 下面每一行有x个&, 这里就得有 x+1个c
5. `\begin{array}{ccc:c}`里面不能用`:`, 只能用`|`
6. 不能使用 `\tag{}`, 建议用 `\quad \quad \quad (1)`
7. `\rvert\` 替换为 `\mid`, `\lvert\` 替换为 `\mid`
