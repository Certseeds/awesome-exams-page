#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv;

const readArgs = function (args) {
    const result = {
        path: args[2],
        prefix: args[3]
    }
    return result;
}
const input = readArgs(args);
const postfix = ".pdf";

// 调用本地大模型接口, 将文件名转换为格式：
//   ${year}${festival}-(期中|期末)[-(答案)].md
// 如果无法转换, 则大模型返回 "INVALID"
async function convertFileName(originalName) {
    const baseName = path.basename(originalName, postfix);
    // 构造转换提示信息
    const prompt = `/think 请从文件名 "${baseName}${postfix}" 中提取信息
- 提取year, 为年份, 返回格式为20xx年, 注意如果有多个年份请返回INVAILD
- 提取season, 为季节, 预期为"春"或者"秋", 注意如果没有季节则返回""
- 提前type, 预期为期中, 期末 表示考试类型, 
- 提取answer, 为答案类型, 预期为boolean

如果文件名不符合这种规则, 请将type置为"INVALID". 返回格式为JSON对象, 包含year, season, type, answer`;

    const postObject = {
        model: "qwen3:14b",
        prompt: prompt,
        format: {
            "type": "object",
            "properties": {
                "year": {
                    "type": "integer",
                },
                "season": {
                    "type": "string",
                },
                "type": {
                    "type": "string",
                },
                "answer": {
                    "type": "boolean",
                },
            },
            "required": ["year", "type", "season", "answer"]
        },
        stream: false
    };

    try {
        const response = await fetch('http://127.0.0.1:11434/api/generate', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postObject)
        });
        const data = await response.json();
        // 假设返回的响应在 response 字段中
        const respnames = JSON.parse(data['response']);
        return respnames;
    } catch (error) {
        console.error(`LLM转换错误(${originalName})：`, error);
        return "INVALID";
    }
}
async function createRenameMapping(dirPath) {
    // 读取目录下所有文件(只处理文件, 不递归目录)
    const allFiles = fs.readdirSync(dirPath);
    // 过滤 pdf 文件(忽略大小写)
    const pdfFiles = allFiles.filter(f => path.extname(f).toLowerCase() === postfix);

    const mapping = {};    // 原文件名 -> 新文件名
    const abandon = [];    // 无法转换的文件
    const usedNames = {};  // 用于检测目标文件名冲突

    for (const file of pdfFiles) {
        const newNameObj = await convertFileName(file);
        const [year, season, type, answer] = [newNameObj.year, newNameObj.season, newNameObj.type, newNameObj.answer];

        if (type === "INVALID" || !type) {
            abandon.push(file);
            continue;
        }
        const newName = `${year}${season}-${type}${answer ? '-答案' : ''}${postfix}`;
        
        console.log(newName);
        // 处理冲突：若存在同名文件, 则添加 -1, -2 后缀
        let finalName = newName;
        let count = 2;
        while (usedNames[finalName]) {
            const ext = path.extname(newName);
            const nameWithoutExt = newName.slice(0, -ext.length);
            finalName = `${nameWithoutExt}-${count}${ext}`;
            count++;
        }
        usedNames[finalName] = true;
        mapping[file] = finalName;
    }
    return { mapping, abandon };
}

async function main() {
    const targetDir = input["path"];
    const { mapping, abandon } = await createRenameMapping(targetDir);
    console.log("\n无法转换的文件：");
    console.log(JSON.stringify(abandon, null, 2));
    for (const [oldName, newName] of Object.entries(mapping)) {
        const oldPath = path.join(targetDir, oldName);
        const newPath = path.join(targetDir, `${input["prefix"]}-${newName}`);
        console.log(`重命名 ${oldName} -> ${newName}`);
        await fs.renameSync(oldPath, newPath);
    }
}

main().catch(console.error);