import * as fs from 'fs';
import glob from 'fast-glob';
import path from 'path';

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

        if (path.basename(pluginFolder).startsWith('[') && path.basename(pluginFolder).endsWith(']')) {
            const category = path.basename(pluginFolder).slice(1, -1);
            const categoryPlugins = await glob(pluginFolder + '/*', options);
            for (let categoryPlugin of categoryPlugins) {
                if (fs.existsSync(categoryPlugin + '/client')) {
                    clientFolders.push({ folder: categoryPlugin + '/client', category });
                }
                if (fs.existsSync(categoryPlugin + '/server')) {
                    serverFolders.push({ folder: categoryPlugin + '/server', category });
                }
            }
        } else {
            if (fs.existsSync(pluginFolder + '/client')) {
                clientFolders.push({ folder: pluginFolder + '/client', category: 'Uncategorized' });
            }
            if (fs.existsSync(pluginFolder + '/server')) {
                serverFolders.push({ folder: pluginFolder + '/server', category: 'Uncategorized' });
            }
        }
    }

    for (let { folder: serverFolder, category } of serverFolders) {
        const path = getIndexPath(serverFolder);
        if (!path) {
            continue;
        }
        const folderSlice = serverFolder.split('/');
        const folderName = folderSlice[folderSlice.length - 2];
        fs.appendFileSync(serverImportsPath, `alt.log('::: Plugin: ${folderName} | Category: ${category}');` + '\r\n');
        const importLine = `import '${path}';`;
        fs.appendFileSync(serverImportsPath, importLine + '\r\n');
    }

    for (let { folder: clientFolder, category } of clientFolders) {
        const path = getIndexPath(clientFolder);
        if (!path) {
            continue;
        }
        const folderSlice = clientFolder.split('/');
        const folderName = folderSlice[folderSlice.length - 2];
        fs.appendFileSync(clientImportsPath, `alt.log('::: Plugin: ${folderName} | Category: ${category}');` + '\r\n');
        const importLine = `import '${path}';`;
        fs.appendFileSync(clientImportsPath, importLine + '\r\n');
    }
}

start();
