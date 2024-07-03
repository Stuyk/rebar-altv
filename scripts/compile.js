import * as fs from 'fs';
import { exec } from 'child_process';

const assetPackContent = `type = 'asset-pack'\r\nclient-files = [ '*' ]`;

const assetPacks = [`./resources/images`, `./resources/sounds`, './resources/fonts'];

const foldersToClean = [
    `./resources/core`,
    `./resources/webview`,
    `./webview/public/images`,
    `./webview/public/sounds`,
    `./webview/public/fonts`,
    ...assetPacks,
];

const initialCommands = [
    `node ./scripts/webview.js`,
    `pnpm -C webview run build`,
    `npx sucrase ./src -d ./resources/core --exclude-dirs ./src/scratchpad --transforms typescript -q`,
    `node ./scripts/env.js`,
    `node ./scripts/copyFiles.js`,
];

const finalCommands = [`node ./scripts/buildPluginImports.js`, `node ./scripts/pathResolver.js`];

function formatTimestamp(time) {
    const date = new Date(time);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
        hour: hour <= 9 ? `0${hour}` : `${hour}`,
        minute: minutes <= 9 ? `0${minutes}` : `${minutes}`,
        second: seconds <= 9 ? `0${seconds}` : `${seconds}`,
    };
}

function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
                return;
            }
            resolve(stdout);
        });
    });
}

function copyResourceFile() {
    fs.cpSync(`./src/resource.toml`, `./resources/core/resource.toml`, { force: true });
}

function createAssetPackTomls() {
    for (let path of assetPacks) {
        const fullPath = path + '/resource.toml';
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }

        fs.writeFileSync(fullPath, assetPackContent);
    }
}

async function runCommands(commandList) {
    const promises = [];
    for (let cmd of commandList) {
        promises.push(execPromise(cmd));
    }

    const result = await Promise.all(promises).catch((err) => {
        console.error('Error executing commands:', err);
    });

    if (!result) {
        process.exit(1);
    }
}

function logMessage(msg) {
    const timestamp = formatTimestamp(Date.now());
    console.log(`[${timestamp.hour}:${timestamp.minute}:${timestamp.second}] ${msg}`);
}

async function compile() {
    const start = Date.now();
    logMessage(`Compile Started`);

    await runCommands([`node ./scripts/buildPluginDependencies.js`]);

    for (let pathsToClean of foldersToClean) {
        try {
            fs.rmSync(pathsToClean, { force: true, recursive: true });
        } catch (err) {}
    }

    createAssetPackTomls();

    if (!process.argv.includes('docker')) {
        initialCommands.push(`node ./scripts/pkill.js`);
    } else {
        logMessage(`Skipping process kill for Docker`);
    }

    await runCommands(initialCommands); // Transpile code, webview, copy files, etc.
    copyResourceFile(); // Copy resource file for core
    await runCommands(finalCommands); // Update file pathing

    logMessage(`Compile Time - ${Date.now() - start}ms`);
}

compile();
