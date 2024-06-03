import { execSync } from 'child_process';
import * as fs from 'fs';
import path from 'path';

const repoUrl = 'https://github.com/Stuyk/rebar-altv';
const tmpPath = path.resolve(process.cwd(), 'tmp');
const srcMainPath = path.resolve(process.cwd(), 'src/main');
const webviewComposablesPath = path.resolve(process.cwd(), 'webview/composables');
const webviewSrcPath = path.resolve(process.cwd(), 'webview/src');
const webviewPublicPath = path.resolve(process.cwd(), 'webview/public');
const docsPath = path.resolve(process.cwd(), 'docs');
const packagePath = path.resolve(process.cwd(), 'package.json');

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
    moveDirectory(path.join(tmpPath, 'src/main'), srcMainPath);
    moveDirectory(path.join(tmpPath, 'webview/composables'), webviewComposablesPath);
    moveDirectory(path.join(tmpPath, 'webview/src'), webviewSrcPath);
    moveDirectory(path.join(tmpPath, 'webview/public'), webviewPublicPath);
    moveDirectory(path.join(tmpPath, 'docs'), docsPath);
    moveDirectory(path.join(tmpPath, 'package.json'), packagePath, false);
    execSync(`pnpm upgrade`, { stdio: 'inherit' });
    execSync(`pnpm install`, { stdio: 'inherit' });
    fs.rmSync(tmpPath, { force: true, recursive: true });
    console.log('Upgraded Successfully!');
} catch (error) {
    fs.rmSync(tmpPath, { force: true, recursive: true });
    console.error('An error occurred:', error);
}
