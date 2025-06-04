#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later

import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__filename, __dirname)

const args = process.argv;

const readArgs = function (args) {
    const result = {
        path: args[2]
    }
    return result;
}
const input = readArgs(args);

async function processFiles() {
    const dirPath = input.path;
    const files = await fs.promises.readdir(dirPath);
    for (const file of files) {
        if (path.extname(file).toLowerCase() !== '.pdf') continue;
        const src = path.join(dirPath, file);
        const dstFileName = path.parse(file).name + '.md';
        const dst = path.join(process.cwd(), 'product', dstFileName);
        console.log(src, dst);

        console.log('开始执行 MPX 转换...');
        // 使用Promise链式调用, 确保在转换完成后再执行格式化
        await runMpxConvert(src, dst)
    }
}

// 将 mpx 转换分离为单独函数
async function runMpxConvert(src, dst) {
    return new Promise((resolve, reject) => {
        const child = spawn('pnpm', ['exec', 'mpx', 'convert', `\"${src}\"`, `\"${dst}\"`], {
            cwd: path.join(__dirname, 'mpx-cli'),
            shell: true,
            stdio: 'inherit'
        });

        child.on('close', code => {
            if (code !== 0) {
                return reject(new Error(`子进程退出码: ${code}`));
            }
            resolve();
        });
    });
}

processFiles().catch(err => console.error(err));