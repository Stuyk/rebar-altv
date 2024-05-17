import * as fs from 'fs';
import glob from 'fast-glob';

const serverImportsPath = './resources/core/main/server/plugins.js';
const clientImportsPath = './resources/core/main/client/plugins.js';

const options = { onlyDirectories: true };

function cleanupPath(path) {
    return path.replace('./src/plugins/', '../../plugins/').replace('.ts', '.js');
}

function getIndexPath(folder) {
    const exists = fs.existsSync(folder + '/index.ts');
    return exists ? cleanupPath(folder + '/index.ts') : null;
}

async function start() {
    const pluginFolders = await glob('./src/plugins/*', options);

    const serverFolders = [];
    const clientFolders = [];

    for (let pluginFolder of pluginFolders) {
        if (fs.existsSync(pluginFolder + '/.disable') || pluginFolder.includes('!')) {
            continue;
        }

        if (fs.existsSync(pluginFolder + '/client')) {
            clientFolders.push(pluginFolder + '/client');
        }

        if (fs.existsSync(pluginFolder + '/server')) {
            serverFolders.push(pluginFolder + '/server');
        }
    }

    // Propogate server import paths
    for (let serverFolder of serverFolders) {
        if (serverFolder.includes('!') || fs.existsSync(serverFolder + '../.disable')) {
            continue;
        }

        const path = getIndexPath(serverFolder);
        if (!path) {
            continue;
        }

        const folderSlice = serverFolder.split('/');
        const folderName = folderSlice[folderSlice.length - 2];
        fs.appendFileSync(serverImportsPath, `alt.log('::: Plugin: ${folderName}');` + '\r\n');
        const importLine = `import '${path}';`;
        fs.appendFileSync(serverImportsPath, importLine + '\r\n');
    }

    // Propogate client import paths
    for (let clientFolder of clientFolders) {
        if (clientFolder.includes('!') || fs.existsSync(clientFolder + '../.disable')) {
            continue;
        }

        const path = getIndexPath(clientFolder);
        if (!path) {
            continue;
        }

        const folderSlice = clientFolder.split('/');
        const folderName = folderSlice[folderSlice.length - 2];
        fs.appendFileSync(clientImportsPath, `alt.log('::: Plugin: ${folderName}');` + '\r\n');
        const importLine = `import '${path}';`;
        fs.appendFileSync(clientImportsPath, importLine + '\r\n');
    }
}

start();
