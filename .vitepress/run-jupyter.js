#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoDir = path.resolve(__dirname, '..');
const stageDir = path.join(repoDir, 'jupyter');
const stageDistDir = path.join(stageDir, 'dist');
const finalDistDir = path.join(repoDir, '.vitepress', 'dist', 'jupyter');
const configPath = path.join(repoDir, '.vitepress', 'config.mts');
const isDryRun = process.argv.includes('--dry-run');

function normalizeSlash(value) {
    return value.replaceAll('\\', '/');
}

function parseSidebarDirectories(configText) {
    const lines = configText.split(/\r?\n/);
    const links = [];
    let seenSidebar = false;
    let seenItems = false;

    for (const line of lines) {
        if (!seenSidebar) {
            if (line.includes('sidebar:')) {
                seenSidebar = true;
            }
            continue;
        }

        if (!seenItems) {
            if (line.includes('items:')) {
                seenItems = true;
            }
            continue;
        }

        if (/^\s*]\s*,?\s*$/.test(line)) {
            break;
        }

        const match = line.match(/link:\s*['"]([^'"]+)['"]/);
        if (match) {
            links.push(match[1]);
        }
    }

    const directories = [...new Set(links
        .map((link) => normalizeSlash(link).replace(/^\/+/, ''))
        .map((link) => link.split('/')[0])
        .filter(Boolean))];

    if (directories.length === 0) {
        throw new Error('No sidebar directories were found in .vitepress/config.mts.');
    }

    return directories;
}

async function assertDirectoriesExist(directories) {
    for (const directory of directories) {
        const sourceDir = path.join(repoDir, directory);
        const stat = await fs.stat(sourceDir).catch(() => null);
        if (!stat || !stat.isDirectory()) {
            throw new Error(`Sidebar directory does not exist: ${sourceDir}`);
        }
    }
}

async function clearStageDirectories() {
    await fs.rm(path.join(stageDir, 'jupyter', '.jupyterlite.doit.db'), { force: true }).catch(() => { });
}

async function copyCourseDirectories(directories) {
    for (const directory of directories) {
        const sourceDir = path.join(repoDir, directory);
        const targetDir = path.join(stageDir, directory);
        await fs.cp(sourceDir, targetDir, { recursive: true });
    }
}

async function runPnpmJupyterBuild() {
    const command = 'pnpm';
    const options = {
        cwd: stageDir,
        stdio: 'inherit',
        shell: process.platform === 'win32'
    };

    await new Promise((resolve, reject) => {
        const child = spawn(command, ['jupyter:build'], options);

        child.on('error', reject);
        child.on('exit', (code) => {
            if (code === 0) {
                resolve();
                return;
            }
            reject(new Error(`pnpm jupyter:build failed with exit code ${code}`));
        });
    });
}

async function copyBuildOutput() {
    const distStat = await fs.stat(stageDistDir).catch(() => null);
    if (!distStat || !distStat.isDirectory()) {
        throw new Error(`Stage dist directory was not created: ${stageDistDir}`);
    }

    await fs.rm(finalDistDir, { recursive: true, force: true });
    await fs.mkdir(path.dirname(finalDistDir), { recursive: true });
    await fs.cp(stageDistDir, finalDistDir, { recursive: true });
}

async function main() {
    const configText = await fs.readFile(configPath, 'utf8');
    const directories = parseSidebarDirectories(configText);

    await assertDirectoriesExist(directories);

    console.log('Selected sidebar directories:');
    for (const directory of directories) {
        console.log(`- ${directory}`);
    }

    if (isDryRun) {
        console.log('Dry run enabled, skipping copy/build steps.');
        return;
    }

    console.log(`Clearing stage directories in ${stageDir} while preserving root files...`);
    await clearStageDirectories();

    console.log('Copying selected course directories into stage...');
    await copyCourseDirectories(directories);

    console.log(`Running pnpm jupyter:build in ${stageDir}`);
    await runPnpmJupyterBuild();

    console.log(`Copying built dist to ${finalDistDir}`);
    await copyBuildOutput();

    console.log('Jupyter staging build completed.');
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
