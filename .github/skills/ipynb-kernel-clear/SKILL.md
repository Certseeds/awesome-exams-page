# ipynb-kernel-clear

扫描并在工作区中清除 Jupyter Notebook (`.ipynb`) 文件的内核元数据和执行计数，以确保可重现性和干净的版本控制。

## 何时使用
- 在将 `.ipynb` 文件提交到仓库之前。
- 当用户要求“清理”、“清除”或“重置”笔记本内核/输出时。
- 为了防止特定于环境的内核信息（如本地 venv 路径）泄露到代码库中。

## 工作流程

### 1. 发现 (Discovery)
- 扫描工作区（或提供的特定目录）中的所有 `.ipynb` 文件。
- 使用 `file_search` 或 `list_dir` 查找目标。

### 2. 分析与准备 (Analysis & Preparation)
- 对于每个笔记本，使用 `copilot_getNotebookSummary` 检查其是否具有内核元数据或执行输出。
- 如果计划使用笔记本特定的管理工具，请确保调用 `configure_notebook` 工具。

### 3. 执行 (Execution)
- 使用 `mcp_jupyter-mcp-0_notebook_clear_all_outputs` 删除所有单元格输出和执行计数。
- 如果需要使用 `edit_notebook_file` 或直接进行文件编辑（针对 `kernelspec` 等元数据），请确保剔除元数据部分中的本地路径或非通用的特定内核名称。

### 4. 验证 (Verification)
- 再次使用 `copilot_getNotebookSummary` 验证所有单元格的 `executionCount` 是否为 `null` 且 `outputs` 是否为空。
- 检查笔记本的顶级元数据，确保 `kernelspec` 是通用的或按照要求已移除。

## 质量标准
- 文件中不保留任何单元格输出。
- 所有代码单元格的 `execution_count` 均为 `null`。
- 顶级 `metadata.kernelspec` 理想情况下应为通用格式，或与项目的 `pyproject.toml` / 环境配置保持一致。
- 文件保持有效的 JSON/IPYNB 格式。

## 示例 Prompt
- "清除 CS203 文件夹中所有笔记本的内核信息和输出。"
- "在提交之前，帮我清理当前的笔记本。"
- "扫描整个仓库中的 ipynb 文件并重置它们的执行计数。"
