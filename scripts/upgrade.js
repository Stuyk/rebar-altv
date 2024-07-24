import { execSync } from 'child_process';
import * as fs from 'fs';
import path from 'path';

const repoUrl = 'https://github.com/Stuyk/rebar-altv';

const tmpPath = path.resolve(process.cwd(), 'tmp');

const foldersToCopy = [
    'src/main',
    'webview/composables',
    'webview/src',
    'webview/public',
    'webview/vite.config.ts',
    'docs',
    'scripts',
    'package.json',
    'tsconfig.json',
    'nodemon-dev.json',
    'nodemon-hot.json',
];

function cloneRepository(repoUrl, clonePath) {
    console.log(`Cloning repository from ${repoUrl} to ${clonePath}...`);
    execSync(`git clone ${repoUrl} ${clonePath}`, { stdio: 'inherit' });
}

function moveDirectory(src, dest, makeDirectory = true) {
    if (!fs.existsSync(dest) && makeDirectory) {
        fs.mkdirSync(dest, { recursive: true });
    }

    fs.cpSync(src, dest, { recursive: true });
}

try {
    cloneRepository(repoUrl, tmpPath);
    for (let file of foldersToCopy) {
        const from = path.join(tmpPath, file);
        const to = path.resolve(process.cwd(), file);
        moveDirectory(from, to, file.includes('.') ? false : true);
    }

    execSync(`node ./scripts/buildPluginDependencies.js`, { stdio: 'inherit' });
    execSync(`pnpm upgrade`, { stdio: 'inherit' });
    execSync(`pnpm install`, { stdio: 'inherit' });
    fs.rmSync(tmpPath, { force: true, recursive: true });
    console.log('Upgraded Successfully!');
} catch (error) {
    fs.rmSync(tmpPath, { force: true, recursive: true });
    console.error('An error occurred:', error);
}
