# Awesome SUSTech Exams Pages

[![Contributors][contributors-shield]][contributors-url]

[![Forks][forks-shield]][forks-url]

[![Stargazers][stars-shield]][stars-url]

[![Issues][issues-shield]][issues-url]

[![project_license][license-shield]][license-url]

## 科目

+ [MA101a_数学分析I](/MA101a_数学分析I/README.md)
+ [MA102a_数学分析II](/MA102a_数学分析II/README.md)
+ [MA103_线性代数](/MA103_线性代数/README.md)
+ [MA111_高等代数II](/MA107_高等代数I/README.md)
+ [MA111_高等代数II](/MA111_高等代数II/README.md)
+ [MA117_高等数学上](/MA117_高等数学上/README.md)
+ [MA127_高等数学下](/MA127_高等数学下/README.md)
+ [MA203a_数学分析III](/MA203a_数学分析III/README.md)
+ [MA212_概率论与数理统计](/MA212_概率论与数理统计/README.md)
+ [MA213-16_数学分析精讲](/MA213-16_数学分析精讲/README.md)

## 简介

这是上游项目[NikeTacoHub-Awesome-Exams](https://github.com/NikeTacoHub/awesome-exams/)的fork, 同样使用CC BY-NC-SA 4.0协议, 目标是保存markdown格式的awesome-exams内容, 同时以其为基础构建静态站点.

+ [View Demo](https://certseeds.github.io/awesome-exams-page/)
+ [报告错误](https://github.com/Certseeds/awesome-exams-page/issues/new?template=bug_report.md)
+ [认领工作](https://github.com/Certseeds/openpgpage/issues/new?labels=claim&template=claim.md)

## Why This Project start

上游项目[NikeTacoHub-Awesome-Exams](https://github.com/NikeTacoHub/awesome-exams)提供了大量的pdf文件供参考, 然而github的存储库大小是有限的, free计划大概5G, 按平均一份扫描件10MB来计算, 只能存几百个文件; 再加上扫描件对打印, ai-chat等场景的支持有限, markdown格式的文件更适合做为知识库.

为了更好的在浏览器中渲染markdown文件, 没有采用github对jupiter-notebook的支持带来的latex渲染, 选择使用vitepress搭建了一个静态的GitHub Pages来方便浏览.

更进一步说, 对扫描件pdf进行编辑, 回传的难度远大于对markdown进行编辑, 后者甚至可以直接在github上进行编辑; 这有利于每一个受益者在项目中贡献一份力量.

## Built With

+ [pnpm](https://pnpm.io/)
+ [vuejs](https://vuejs.org)
+ [vitepress](https://vitepress.dev)

### Prerequisites 环境搭建

确保您的执行环境中存在nodejs, 以及pnpm.

``` bash
$ node --version
v22 (or higher)
$ pnpm --version
9 (or higher version)
```

### 基础的渲染

1. 下载仓库
2. 在本地执行 `pnpm install`
3. 在本地执行 `pnpm docs:dev` 启动本地服务器
4. 在浏览器中打开 `http://localhost:5173/awesome-exams-page/README` 查看效果

### 使用mathpix对pdf进行识别, 初步清理

注意mathpix使用需要会员, 免费套餐只有10页pdf转换额度.

1. 命令行进入 `./.vitepress/mpx-cli`
2. 执行 `pnpm install`
3. 在命令行执行 `pnpm exec mpx login` 登录
4. 返回到根目录, 调用 `pnpm exec node ./.vitepress/run-mpx.js "${src-folder}"`对目录内所有pdf进行识别
5. 识别完成后, `pnpm exec node ./.vitepress/formats.js ${file}` 对产出的每一个文件进行格式化, 方便后续vitepress渲染

### 清理

1. 命令行执行 `pnpm docs:dev`
2. 将屏幕三分割, 左侧放pdf, 中间放`http://localhost:5173/awesome-exams-page/${PATH}`中的页面, 右侧放编辑器中的代码.
3. 对比左侧, 中间的区别, 如果出现区别在右侧编辑.
4. 编辑完成后执行 `pnpm docs:build`, 确保没有错误.
5. 提交代码, 并提交pr

## Usage

这个仓库能被如何使用?

1. 转换为pdf后打印, 注意最好不要直接将GitHub Pages进行打印, 而是使用pandoc, markdown-all-in-one等工具将markdown转换为html/pdf后打印.

2. 使用ai-chat进行提问, 例如chatgpt, 直接将markdown文件拖入chatgpt的对话框中, 进行提问. 或者是拿出某一问来提问.

3. 为个人整理学科笔记提供参考, 题目/答案中包括许多公式以及一些特殊用法, 方便整理笔记.

4. 为答案补充细节, 添加多样的解法.

## Roadmap

+ [x] 搭建github Pages
+ [x] 准备github issue, pr模板
+ [x] 撰写README
+ [ ] 转换并清洗pdf
+ [ ] 校对pdf
+ [ ] 为仓库实验 `CodeOwner` 机制

<!-- CONTRIBUTING -->
## Contributing

贡献是使开源社区成为学习、启发和创造的绝佳场所的关键。我们非常感谢您的任何贡献。

如果您有改进建议，请复刻(fork)仓库并创建拉取请求(pull request)。您也可以简单地在Discussions的Ideas部分开启一个讨论

别忘了给项目点星标! 再次感谢!

1. [报告错误](https://github.com/Certseeds/awesome-exams-page/issues/new?template=bug_report.md)对项目的贡献非常重要, 这可以帮助后来人免受困扰.

### 2. 整理, 清洗与校对

0. 点击 [认领工作](https://github.com/Certseeds/openpgpage/issues/new?labels=claim&template=claim.md)发出issue, 让其他人知道您在进行某些工作, 防止重复劳动.
1. 复刻(Fork)项目
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m '添加某个很棒的特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启拉取请求

或者您可以在github上直接编辑文件, 这会自动创建一个分支, 供您提交pr. 您可能发现github上的latex渲染并不总是令人满意, 此时可以在[github-page 编辑器](https://certseeds.github.io/awesome-exams-page/editor.html)上进行最后的预览工作.

## license

### AGPLv3.0+ LICENSE

代码(主要是js文件)基于 AGPLv3.0+协议: 限制最强的主流开源协议

+ 具体内容请看[`LICENSE_AGPL_V3_0.md`](/LICENSE_AGPL_V3_0.md)
some code is based on this license

### CC-BY-NC-SA-4.0+ LICENSE

所有其他非代码部分(主要是*.md)基于CC BY-NC-SA 4.0(或以后版本)协议.

+ 相同方式共享-署名-非商业性使用的知识共享协议4.0或任何以后版本.
+ 署名(BY)-使用到相应内容的其他地方, 应该加以注释, 保留来源.
+ 非商业性使用(NC)-默认情况下, 只要署名, 可以在不盈利的情况下使用.(并不是指商业情况不能用,而是需要和原作者沟通)
+ 相同方式共享(SA)-使得协议具有传染性, 只要其他内容采用了本repo的内容, 就需要在署名的同时, 保证其协议也是CC-BY-NC-SA-4.0 or later version.
+ 具体内容请看[`LICENSE_CC_BY_NC_SA_V4_0.md`](/LICENSE_CC_BY_NC_SA_V4_0.md)

## Acknowledgments

+ README参考了[Best-Readme-Template][Best-Readme-Template]
+ [Choose an Open Source License](https://choosealicense.com)

## Thanks

感谢原始pdf的贡献者以及所有后续贡献者.

[contributors-shield]: https://img.shields.io/github/contributors/Certseeds/awesome-exams-page.svg?style=for-the-badge
[contributors-url]: https://github.com/Certseeds/awesome-exams-page/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Certseeds/awesome-exams-page.svg?style=for-the-badge
[forks-url]: https://github.com/Certseeds/awesome-exams-page/network/members
[stars-shield]: https://img.shields.io/github/stars/Certseeds/awesome-exams-page.svg?style=for-the-badge
[stars-url]: https://github.com/Certseeds/awesome-exams-page/stargazers
[issues-shield]: https://img.shields.io/github/issues/Certseeds/awesome-exams-page.svg?style=for-the-badge
[issues-url]: https://github.com/Certseeds/awesome-exams-page/issues
[license-shield]: https://img.shields.io/github/license/Certseeds/awesome-exams-page.svg?style=for-the-badge
[license-url]: https://github.com/Certseeds/awesome-exams-page/blob/master/LICENSE.txt
[Best-Readme-Template]: https://github.com/othneildrew/Best-README-Template
