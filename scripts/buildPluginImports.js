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
    

    function getSortedEntries(folders) {
        return folders
            .map(({ folder, category }) => {
                const path = getIndexPath(folder);
                if (!path) {
                    return null;
                }
                const folderSlice = folder.split('/');
                const folderName = folderSlice[folderSlice.length - 2];
                return { folderName, category, path };
            })
            .filter((entry) => entry !== null)
            .sort((a, b) => a.folderName.localeCompare(b.folderName));
    }

    const sortedServerEntries = getSortedEntries(serverFolders);
    for (const { folderName, category, path } of sortedServerEntries) {
        fs.appendFileSync(serverImportsPath, `alt.log('::: Plugin: ${folderName} | Category: ${category}');` + '\r\n');
        const importLine = `import '${path}';`;
        fs.appendFileSync(serverImportsPath, importLine + '\r\n');
    }

    const sortedClientEntries = getSortedEntries(clientFolders);
    for (const { folderName, category, path } of sortedClientEntries) {
        fs.appendFileSync(clientImportsPath, `alt.log('::: Plugin: ${folderName} | Category: ${category}');` + '\r\n');
        const importLine = `import '${path}';`;
        fs.appendFileSync(clientImportsPath, importLine + '\r\n');
    }
}

start();
