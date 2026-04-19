from __future__ import annotations

import json
import locale
import subprocess
import sys
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse


REPO_ROOT = Path(__file__).resolve().parents[1]


def log(message: str) -> None:
    print(f"[clean-reviewed-ipynb] {message}", file=sys.stderr)


def read_stdin_text() -> str:
    raw_bytes = sys.stdin.buffer.read()
    if not raw_bytes:
        return ""

    encodings = ["utf-8", sys.stdin.encoding, locale.getpreferredencoding(False)]
    seen: set[str] = set()
    for encoding in encodings:
        if not encoding or encoding in seen:
            continue
        seen.add(encoding)
        try:
            return raw_bytes.decode(encoding)
        except UnicodeDecodeError:
            continue

    return raw_bytes.decode("utf-8", errors="replace")


def walk_strings(node: Any):
    if isinstance(node, str):
        yield node
        return
    if isinstance(node, dict):
        for value in node.values():
            yield from walk_strings(value)
        return
    if isinstance(node, list):
        for item in node:
            yield from walk_strings(item)


def iter_input_strings(payload: Any):
    if isinstance(payload, str):
        for line in payload.splitlines():
            candidate = line.strip()
            if candidate:
                yield candidate
        return
    yield from walk_strings(payload)


def from_file_uri(value: str) -> Path:
    parsed = urlparse(value)
    path_text = unquote(parsed.path)
    if path_text.startswith("/") and len(path_text) >= 3 and path_text[2] == ":":
        path_text = path_text[1:]
    return Path(path_text)


def normalize_candidate(value: str) -> Path | None:
    candidate_text = value.strip()
    if not candidate_text.lower().endswith(".ipynb"):
        return None
    if candidate_text.startswith("file://"):
        candidate = from_file_uri(candidate_text)
    else:
        candidate = Path(candidate_text)
        if not candidate.is_absolute():
            candidate = REPO_ROOT / candidate
    try:
        resolved = candidate.resolve(strict=False)
        resolved.relative_to(REPO_ROOT)
    except ValueError:
        return None
    return resolved


def notebooks_from_hook_input(payload: Any | None) -> set[Path]:
    if payload is None:
        return set()
    notebooks: set[Path] = set()
    for value in iter_input_strings(payload):
        candidate = normalize_candidate(value)
        if candidate is not None and candidate.exists():
            notebooks.add(candidate)
    return notebooks


def notebooks_from_git_status() -> set[Path]:
    command = [
        "git",
        "-C",
        str(REPO_ROOT),
        "status",
        "--porcelain=v1",
        "-z",
        "--untracked-files=all",
        "--",
        "*.ipynb",
    ]
    result = subprocess.run(command, capture_output=True, text=False, check=False)
    if result.returncode != 0:
        return set()

    stdout = result.stdout.decode("utf-8", errors="surrogateescape")

    notebooks: set[Path] = set()
    entries = stdout.split("\0")
    index = 0
    while index < len(entries):
        entry = entries[index]
        index += 1
        if not entry:
            continue
        if len(entry) < 4:
            continue
        status = entry[:2]
        path_text = entry[3:]
        if "R" in status or "C" in status:
            if index >= len(entries):
                continue
            path_text = entries[index]
            index += 1
        candidate = (REPO_ROOT / path_text).resolve(strict=False)
        if candidate.exists():
            notebooks.add(candidate)
    return notebooks


def scrub_notebook(path: Path) -> tuple[bool, int]:
    notebook = json.loads(path.read_text(encoding="utf-8"))
    changed = False
    touched_cells = 0

    metadata = notebook.get("metadata", {})
    if isinstance(metadata, dict):
        # 清理 kernelspec 和 widgets
        for key in ("kernelspec", "widgets"):
            if key in metadata:
                del metadata[key]
                changed = True
        
        # 深度清理 language_info，仅保留 name
        language_info = metadata.get("language_info")
        if isinstance(language_info, dict):
            keys_to_remove = [k for k in language_info.keys() if k != "name"]
            if keys_to_remove:
                for k in keys_to_remove:
                    del language_info[k]
                changed = True

    for cell in notebook.get("cells", []):
        if cell.get("cell_type") != "code":
            continue
        cell_changed = False
        if cell.get("execution_count") is not None:
            cell["execution_count"] = None
            cell_changed = True
        if cell.get("outputs"):
            cell["outputs"] = []
            cell_changed = True
        if cell_changed:
            touched_cells += 1
            changed = True

    if changed:
        path.write_text(json.dumps(notebook, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    return changed, touched_cells


def load_input_notebooks() -> tuple[set[Path], str]:
    # 优先检查命令行参数
    if len(sys.argv) > 1:
        args = sys.argv[1:]
        notebooks: set[Path] = set()
        for arg in args:
            candidate = normalize_candidate(arg)
            if candidate and candidate.exists():
                notebooks.add(candidate)
        
        if notebooks:
            return notebooks, "args"
        else:
            log("命令行参数中没有找到有效的 notebook 路径")
            return set(), "args-empty"

    # 如果没有命令行参数，检查 stdin 是否被重定向（非交互式）
    if not sys.stdin.isatty():
        raw = read_stdin_text().strip()
        if raw:
            try:
                payload = json.loads(raw)
                mode = "stdin-json"
            except json.JSONDecodeError:
                payload = raw
                mode = "stdin-text"
            
            notebooks = notebooks_from_hook_input(payload)
            if notebooks:
                return notebooks, mode
            else:
                log(f"stdin ({mode}) 中没有解析到有效 notebook 路径")
                return set(), f"{mode}-empty"

    # 兜底：使用 git 扫描
    log("未提供参数且 stdin 为空或交互式终端，使用 git 扫描模式")
    return notebooks_from_git_status(), "git"


def main() -> int:
    notebooks, input_mode = load_input_notebooks()
    message_parts: list[str] = []

    message_parts.append(f"模式: {input_mode}")
    if notebooks:
        notebook_list = ", ".join(path.relative_to(REPO_ROOT).as_posix() for path in sorted(notebooks))
        log(f"解析到 {len(notebooks)} 个 notebook: {notebook_list}")
        message_parts.append(f"目标: {len(notebooks)} 个 notebook")
    else:
        log("没有找到需要处理的 notebook")
        message_parts.append("目标: 0 个 notebook")

    cleaned: list[dict[str, Any]] = []
    unchanged: list[str] = []
    failures: list[str] = []

    for notebook in sorted(notebooks):
        relative_path = notebook.relative_to(REPO_ROOT).as_posix()
        log(f"开始检查 {relative_path}")
        try:
            changed, touched_cells = scrub_notebook(notebook)
        except Exception as exc:
            failure = f"{relative_path}: {exc}"
            log(f"处理失败 {failure}")
            failures.append(failure)
            continue
        if changed:
            log(f"已清理 {relative_path}，影响 {touched_cells} 个代码单元")
            cleaned.append(
                {
                    "path": relative_path,
                    "cells": touched_cells,
                }
            )
        else:
            log(f"无需修改 {relative_path}")
            unchanged.append(relative_path)

    if cleaned:
        cleaned_paths = ", ".join(f"{item['path']}({item['cells']} cells)" for item in cleaned)
        message_parts.append(f"已清理 {len(cleaned)} 个 notebook: {cleaned_paths}")
    else:
        message_parts.append("没有需要清理的 notebook")
    if unchanged:
        message_parts.append(f"已检查未改动 {len(unchanged)} 个 notebook")
    if failures:
        message_parts.append("失败: " + "; ".join(failures))

    print(
        json.dumps(
            {
                "continue": True,
                "systemMessage": "；".join(message_parts),
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())