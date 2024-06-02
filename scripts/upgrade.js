const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const repoUrl = 'https://github.com/Stuyk/rebar-altv';
const tmpPath = path.resolve(__dirname, 'tmp');
const srcMainPath = path.resolve(__dirname, 'src/main');
const webviewPath = path.resolve(__dirname, 'webview');
const docsPath = path.resolve(__dirname, 'docs');
const packagePath = path.resolve(__dirname, 'package.json');

function cloneRepository(repoUrl, clonePath) {
    console.log(`Cloning repository from ${repoUrl} to ${clonePath}...`);
    execSync(`git clone ${repoUrl} ${clonePath}`, { stdio: 'inherit' });
}

function moveDirectory(src, dest) {
    console.log(`Moving ${src} to ${dest}...`);
    fs.renameSync(src, dest);
}

try {
    cloneRepository(repoUrl, tmpPath);
    moveDirectory(path.join(tmpPath, 'src/main'), 'test/' + srcMainPath);
    moveDirectory(path.join(tmpPath, 'webview'), 'test/' + webviewPath);
    moveDirectory(path.join(tmpPath, 'docs'), 'test/' + docsPath);
    moveDirectory(path.join(tmpPath, 'package.json'), 'test/' + packagePath);
    fs.rmSync(tmpPath, { force: true, recursive: true });
    console.log('Upgraded Successfully!');
} catch (error) {
    console.error('An error occurred:', error);
}
