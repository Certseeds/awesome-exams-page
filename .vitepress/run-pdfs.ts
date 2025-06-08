#!/usr/bin/env node
/**
 * 扫描README文件，找出不包含TODO的markdown文件，
 * 并使用pandoc转换为PDF，放置到public目录下
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import config from './config.mts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getSidebarLinksFromConfig() {
    try {
        const sidebar = config.themeConfig?.sidebar;
        
        if (!sidebar || !Array.isArray(sidebar)) {
            console.error('未找到sidebar配置或格式不正确');
            return [];
        }
        
        const links: string[] = [];
        
        // 遍历sidebar配置
        for (const section of sidebar) {
            if (section.items && Array.isArray(section.items)) {
                for (const item of section.items) {
                    if (item.link) {
                        let link = item.link;
                        // 移除开头的斜杠，转换为相对路径
                        if (link.startsWith('/')) {
                            link = link.slice(1);
                        }
                        links.push(`${link}.md`);
                    }
                }
            }
        }
        
        return links;
    } catch (error) {
        console.error(`错误：无法读取配置文件: ${error.message}`);
        return [];
    }
}

/**
 * 解析README文件，提取不含TODO的markdown文件链接
 */
function parseReadmeForLinks(readmePath) {
    const mdLinks: { title: string; path: string; readmeDir: string }[] = [];
    
    try {
        const content = fs.readFileSync(readmePath, 'utf-8');
        const lines = content.split('\n');
        
        // 匹配格式：+ [文件名](/路径/文件.md)
        // 排除包含TODO的行
        const pattern = /^\+ \[([^\]]+)\]\(([^)]+\.md)\)$/;
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            
            if (trimmedLine.includes('TODO')) {
                continue;
            }
            
            const match = trimmedLine.match(pattern);
            if (match) {
                const title = match[1];
                let filePath = match[2];
                
                // 移除开头的斜杠，转换为相对路径
                if (filePath.startsWith('/')) {
                    filePath = filePath.slice(1);
                }
                
                mdLinks.push({
                    title: title,
                    path: filePath,
                    readmeDir: path.dirname(readmePath)
                });
            }
        }
    } catch (error) {
        console.error(`错误：无法读取文件 ${readmePath}: ${error.message}`);
    }
    
    return mdLinks;
}

/**
 * 创建临时的LaTeX头文件
 */
function createTempHeader() {
    const tmpDir = path.join(os.tmpdir(), 'awesome-exams-pdfs');
    fs.mkdirSync(tmpDir, { recursive: true });
    const headerFile = path.join(tmpDir, `header-${Date.now()}.tex`);
    
    // 写入LaTeX包引用
    fs.writeFileSync(headerFile, '\\usepackage{amsmath,amssymb,xeCJK}');
    
    return headerFile;
}

/**
 * 使用pandoc将markdown转换为PDF
 */
function convertMdToPdf(mdPath, outputPath) {
    return new Promise((resolve) => {
        try {
            // 确保输出目录存在
            const outputDir = path.dirname(outputPath);
            fs.mkdirSync(outputDir, { recursive: true });
            // 创建临时头文件
            const headerFile = createTempHeader();
            
            // pandoc命令参数
            const args = [
                mdPath, '-o', outputPath,
                '--pdf-engine=xelatex',
                '--variable', 'geometry:margin=2cm',
                '--variable', 'fontsize=12pt',
                '--variable', 'documentclass=article',
                '--include-in-header', headerFile
            ];
            
            console.log(`转换: ${mdPath} -> ${outputPath}`);
            
            // 执行pandoc命令
            const pandoc = spawn('pandoc', args);
            
            let stderr = '';
            
            pandoc.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            
            pandoc.on('close', (code) => {
                if (code === 0) {
                    console.log(`✓ 成功转换: ${path.basename(outputPath)}`);
                    resolve(true);
                } else {
                    console.log(`✗ 转换失败: ${mdPath}`);
                    if (stderr) {
                        console.log(`错误信息: ${stderr}`);
                    }
                    resolve(false);
                }
            });
            
            pandoc.on('error', (error) => {
                console.log(`✗ 转换异常: ${mdPath}, 错误: ${error.message}`);
                resolve(false);
            });
            
        } catch (error) {
            console.log(`✗ 转换异常: ${mdPath}, 错误: ${error.message}`);
            resolve(false);
        }
    });
}

/**
 * 主函数
 */
async function main() {
    // 获取项目根目录
    const rootDir = path.resolve(__dirname, '..');
    const publicDir = path.join(rootDir, 'public');
    
    console.log(`项目根目录: ${rootDir}`);
    console.log(`公共目录: ${publicDir}`);
    
    // 确保public目录存在
    fs.mkdirSync(publicDir, { recursive: true });
    
    // 查找所有README文件
    const readmeFiles = getSidebarLinksFromConfig();
    console.log(`找到 ${readmeFiles.length} 个README文件`);
    
    // 统计变量
    let totalFiles = 0;
    let successCount = 0;
    
    // 处理每个README文件
    for (const readmePath of readmeFiles) {
        console.log(`\n处理README: ${readmePath}`);
        
        // 解析README文件中的链接
        const mdLinks = parseReadmeForLinks(readmePath);
        
        if (mdLinks.length === 0) {
            console.log('  没有找到有效的markdown链接');
            continue;
        }
        
        console.log(`  找到 ${mdLinks.length} 个markdown文件链接`);
        
        // 转换每个markdown文件
        for (const link of mdLinks) {
            totalFiles++;
            const mdPath = path.join(rootDir, link.path);
            
            // 检查文件是否存在
            if (!fs.existsSync(mdPath)) {
                console.log(`  ✗ 文件不存在: ${mdPath}`);
                continue;
            }
            
            // 生成PDF输出路径
            const relPath = link.path;
            const pdfName = path.parse(relPath).name + '.pdf';
            const pdfDir = path.join(publicDir, path.dirname(relPath));
            const pdfPath = path.join(pdfDir, pdfName);
            
            // 转换为PDF
            const success = await convertMdToPdf(mdPath, pdfPath);
            if (success) {
                successCount++;
            }
        }
    }
    
    // 输出统计结果
    console.log(`\n=== 转换完成 ===`);
    console.log(`总计文件: ${totalFiles}`);
    console.log(`成功转换: ${successCount}`);
    console.log(`失败数量: ${totalFiles - successCount}`);
    
    if (successCount > 0) {
        console.log(`PDF文件已保存到: ${publicDir}`);
    }
}

// 执行主函数
main().catch(error => {
    console.error('脚本执行失败:', error);
    process.exit(1);
});
