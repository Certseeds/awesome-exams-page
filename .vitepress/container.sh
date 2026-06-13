#!/usr/bin/env bash
set -euox pipefail
main() {
    local SOURCE="ghcr.io"
    local GH_USERNAME="certseeds"
    local IMAGE_NAME="develop"
    local RUNTIME_NAME="exams-page-dev"
    local dotfiles="${DOTFILES_DIR}"
    # 请确认环境内存在 USERNAME, DOTFILES_DIR 这两个变量
    # 请确认环境内指定路径上有 cc 的配置文件
    podman run \
        --userns=keep-id:uid=1001  \
        -dit \
        -e HTTP_PROXY="" \
        -e HTTPS_PROXY="" \
        -e http_proxy="" \
        -e https_proxy="" \
        --name "${RUNTIME_NAME}" \
        -v "${dotfiles}"/lang/hosts.conf:/etc/hosts \
        -v $(pwd):/home/${USERNAME}/repo/awesome-exams-page \
        -v awesome-exams-node-modules:/home/${USERNAME}/repo/awesome-exams-page/node_modules \
        -v awesome-exams-vitepress-cache:/home/${USERNAME}/repo/awesome-exams-page/.vitepress/cache \
        -v awesome-exams-vitepress-dist:/home/${USERNAME}/repo/awesome-exams-page/.vitepress/dist \
        -v awesome-exams-venv:/home/${USERNAME}/repo/awesome-exams-page/.venv \
        -v awesome-exams-jupyter-venv:/home/${USERNAME}/repo/awesome-exams-page/jupyter/.venv \
        -v awesome-exams-pnpm:/home/${USERNAME}/repo/awesome-exams-page/.pnpm-store \
        -v awesome-exams-claude:/home/${USERNAME}/.claude/ \
        "${SOURCE}/${GH_USERNAME}/${IMAGE_NAME}:latest"
    podman cp "${dotfiles}"/lang/agents/cc.json "${RUNTIME_NAME}":/home/${USERNAME}/.claude/settings.json

    # run pnpm setup
    # vim the claude code settings.json, to enable allow-dangerous tasks
    # openclaw main using qwen3.5-plus
    # cc using glm-5
}
main
