#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv;

const readArgs = function (args) {
    const result = {
        path: args[2]
    }
    return result;
}
const input = readArgs(args);

const usingDollars = function (content) {
    // replace "(/" and "/)" with "$"
    let result = content
    .replace(/\\\(/g, '$$')
    .replace(/\\\)/g, '$$')
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$');
    
    console.log('替换后的内容:', result); // 添加日志
    return result;
}


const getEmptyLines = function (content) {
    const lines = content.split('\n');
    const next = [];
    let isDollarState = false;
    for (const line of lines) {
        const trimLine = line.trim();
        if (trimLine === "$$") {
            next.push(trimLine);
            next.push('\n');
            isDollarState = !isDollarState;
            if (!isDollarState) {
                next.push('\n');
            }
        } else if (isDollarState) {  // 处理公式块内的内容
            next.push(trimLine);
            // 公式块内的行只需要单个换行
            next.push('\n');
        } else { // 处理普通文本
            if (trimLine !== '') {
                next.push(trimLine);
                // 普通文本需要双换行
                next.push('\n\n');
            } else {
                // 空行也保留
                next.push('\n');
            }
        }
    }
    return next.join('');
}

const removeTooMuchEmptyLine = function(content) {
    return content.replace(/\n{3,}/g, '\n\n');
}
const level0 = async function (inputPath) {
    const filePath = path.resolve(inputPath);
    const content = await fs.readFileSync(filePath, 'utf8');
    const result = usingDollars(content);
    const pure = getEmptyLines(result);
    const next = removeTooMuchEmptyLine(pure);
    await fs.writeFileSync(filePath, next, 'utf8');
}

async function main() {
    const target = path.resolve(input.path);
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
        const entries = fs.readdirSync(target);
        for (const name of entries) {
            const fullPath = path.join(target, name);
            if (fs.statSync(fullPath).isFile()) {
                console.log('格式化文件:', fullPath);
                await level0(fullPath);
            }
        }
    } else {
        console.log('格式化文件:', target);
        await level0(target);
    }
}

main().catch(err => console.error(err));

export {
    level0
}