# 数学分析精讲回忆版

作者：黄景娟

## 1 判断题

### 1-1

一阶导等于 $0, x_0$ 存在严格局部极小值当且仅当二阶导大于 $0$ (×)

### 1-2

$\mathbb{R}^{n}$ 任意范数等价

### 1-3

$x \in(0,1), x^{n}$ 不一致收敛到 0

### 1-4

等度连续则一致连续

### 1-5

$a>0, \log _{a} x$ 不是凸函数

### 1-6

紧空间存在可数稠密子集

### 1-7

$f_n$ 连续 + 逐点收敛不能推 $f$ 连续

### 1-8

偏导数存在不能推可微

### 1-9

可逆线性算子是 $L\left(\mathbb{R}^{n}\right)$ 的开集

### 1-10

还有一个不记得了

## 2 积分

### 2-1

$\int_{0}^{\pi} \sin ^{3} x d x$

### 2-2

$\int_{1}^{2} x \ln x d x$

## 3

$f$ 连续可微, $f(1) =0, \int_{0}^{1} f^{4}(x) d x=1$, 证明 $\int_{0}^{1} f^{\prime}(x)^{2} d x \int_{0}^{1} x^{2} f^{6}(x) d x>\frac{1}{16}$

**解:**

用Cauchy不等式即

$$\left(\int_{a}^{b} f(x) g(x) d x\right)^{2} \leq \int_{a}^{b} f^{2}(x) d x \cdot \int_{a}^{b} g^{2}(x) d x$$

放缩, 接着用分部积分证明不等式

## 4

给出 $f(x, y)$ 和 $v$ 和 $x_{0}$, 求 $f^{\prime}\left(x_{0}\right)(v)$ 要用矩阵, 转为梯度算然后 8 分没了

## 5

一致收敛和一致Cauchy等价证明, 改为了 $\sup |f_{n}-f_{m}|$, 本质一样

7.8 Theorem The sequence of functions $\left\{f_{n}\right\}$, defined on $E$, converges uniformly on $E$ if and only if for every $\varepsilon>0$ there exists an integer $N$ such that $m \geq N$, $n \geq N, x \in E$ implies

$$
\left|f_{n}(x) -f_{m}(x) \right| \leq \varepsilon
$$

Proof Suppose $\left\{f_{n}\right\}$ converges uniformly on $E$, and let $f$ be the limit function. Then there is an integer $N$ such that $n \geq N, x \in E$ implies

$$
\left|f_{n}(x) -f(x) \right| \leq \frac{\varepsilon}{2},
$$

so that

$$
\left|f_{n}(x) -f_{m}(x) \right| \leq\left|f_{n}(x) -f(x) \right|+\left|f(x) -f_{m}(x) \right| \leq \varepsilon
$$

if $n \geq N, m \geq N, x \in E$. Conversely, suppose the Cauchy condition holds. Then, the sequence $\left\{f_{n}(x) \right\}$ converges, for every $x$, to a limit which we may call $f(x)$. Thus the sequence $\left\{f_{n}\right\}$ converges on $E$, to $f$. We have to prove that the convergence is uniform

Let $\varepsilon>0$ be given, and choose $N$ such that (13) holds. Fix $n$, and let $m \rightarrow \infty$ in (13) . Since $f_{m}(x) \rightarrow f(x)$ as $m \rightarrow \infty$, this gives

14)

$$
\left|f_{n}(x) -f(x) \right| \leq \varepsilon
$$

for every $n \geq N$ and every $x \in E$, which completes the proof

9.19 Theorem Suppose f maps a convex open set $E \subset R^{n}$ into $R^{m}$ , f is differen- tiable in $E$ , and there is a real number $M$ such that

$$
\left\|\mathbf{f}^{\prime}(\mathbf{x}) \right\| \leq M
$$

for every $\mathbf{x} \in E$ .Then

$$
|\mathbf{f}(\mathbf{b}) -\mathbf{f}(\mathbf{a}) | \leq M|\mathbf{b}-\mathbf{a}| \quad \text { for all } \mathbf{a} \in E, \mathbf{b} \in E \text {. }
$$

Proof Fix $\mathbf{a} \in E, \mathbf{b} \in E$ .Define

$$
\gamma(t) =(1-t) \mathbf{a}+t \mathbf{b}
$$

for all $t \in R^{1}$ such that $\gamma(t) \in E$ .Since $E$ is convex, $\gamma(t) \in E$ if $0 \leq t \leq 1$ . Put

$$
\mathbf{g}(t) =\mathbf{f}(\gamma(t) )
$$

Then

$$
\mathbf{g}^{\prime}(t) =\mathbf{f}^{\prime}(\gamma(t) ) \gamma^{\prime}(t) =\mathbf{f}^{\prime}(\gamma(t) ) (\mathbf{b}-\mathbf{a}) ,
$$

so that

$$
\left|\mathbf{g}^{\prime}(t) \right| \leq\left\|\mathbf{f}^{\prime}(\gamma(t) ) \right\||\mathbf{b}-\mathbf{a}| \leq M|\mathbf{b}-\mathbf{a}|
$$

for all $t \in[0,1]$ .By Theorem 5.19,

$$
|\mathbf{g}(1) -\mathbf{g}(0) | \leq M|\mathbf{b}-\mathbf{a}|
$$

But $\mathbf{g}(0) =\mathbf{f}(\mathbf{a})$ and $\mathbf{g}(1) =\mathbf{f}(\mathbf{b})$ .This completes the proof

## 七

不动点定理证明 题干改为 $3 d(T x, T y) <d(x, y)$ ,

9.23 Theorem If $X$ is a complete metric space, and if $\varphi$ is a contraction of $X$ into $X$ , then there exists one and only one $x \in X$ such that $\varphi(x) =x$

Proof Pick $x_{0} \in X$ arbitrarily, and define $\left\{x_{n}\right\}$ recursively, by setting

$$
x_{n+1}=\varphi\left(x_{n}\right) \quad(n=0,1,2, \ldots)
$$

Choose $c<1$ so that(43) holds.For $n \geq 1$ we then have

$$
d\left(x_{n+1}, x_{n}\right) =d\left(\varphi\left(x_{n}\right) , \varphi\left(x_{n-1}\right) \right) \leq c d\left(x_{n}, x_{n-1}\right)
$$

Hence induction gives

$$
d\left(x_{n+1}, x_{n}\right) \leq c^{n} d\left(x_{1}, x_{0}\right) \quad(n=0,1,2, \ldots)
$$

If $n<m$ , it follows that

$$
\begin{aligned}
d\left(x_{n}, x_{m}\right) & \leq \sum_{i=n+1}^{m} d\left(x_{i}, x_{i-1}\right) \\
& \leq\left(c^{n}+c^{n+1}+\cdots+c^{m-1}\right) d\left(x_{1}, x_{0}\right) \\
& \leq\left[(1-c) ^{-1} d\left(x_{1}, x_{0}\right) \right] c^{n}
\end{aligned}
$$

Thus $\left\{x_{n}\right\}$ is a Cauchy sequence.Since $X$ is complete, $\lim x_{n}=x$ for some $\boldsymbol{x} \in X$

Since $\varphi$ is a contraction, $\varphi$ is continuous(in fact, uniformly con- tinuous) on $X$ .Hence

$$
\varphi(x) =\lim\limits_{n \rightarrow \infty} \varphi\left(x_{n}\right) =\lim\limits_{n \rightarrow \infty} x_{n+1}=x
$$

