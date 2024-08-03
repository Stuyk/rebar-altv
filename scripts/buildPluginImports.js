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

    const APIMap = new Map();

    for (let serverFolder of serverFolders) {
        if (fs.existsSync(serverFolder + '/api.ts')) {
            const file = fs.readFileSync(serverFolder + '/api.ts', 'utf8');

            const regex = /Rebar\.useApi\(\)\.register\(([^,]+), useApi\(\)\);/;
            const match = file.match(regex);

            if (match && match[1]) {
                let extractedContent = match[1].trim();
                if ((extractedContent.startsWith('"') && extractedContent.endsWith('"')) || (extractedContent.startsWith("'") && extractedContent.endsWith("'"))) {
                    extractedContent = extractedContent.replace(/["']/g, '');
                } else {              
                    const regexApiConst = new RegExp(`const\\s+${extractedContent}\\s*=\\s*['"]([^'"]+)['"]\\s*;`);
                    const matchApiConst = file.match(regexApiConst);
                    if (matchApiConst && matchApiConst[1]) {
                        extractedContent = matchApiConst[1].trim();
                        extractedContent = extractedContent.replace(/["']/g, '');
                    }
                }

                const regexFunctions = /return\s*{([^}]+)}/;
                const matchFunctions = file.match(regexFunctions);
                if (matchFunctions && matchFunctions[1]) {
                    let extractedContentFunction = matchFunctions[1].trim();
                    let functionArray = extractedContentFunction.split(',').map(func => func.trim());
                    APIMap.set(extractedContent, functionArray);
                } else
                {
                    APIMap.set(extractedContent, functionArray);
                }
            } 
        }
    }
    

    // Propogate server import paths
    for (let serverFolder of serverFolders) {
        const path = getIndexPath(serverFolder);
        if (!path) {
            continue;
        }

        const folderSlice = serverFolder.split('/');
        const folderName = folderSlice[folderSlice.length - 2];
        let missing = false;

        if (fs.existsSync(serverFolder + '/dependencies.json')) {
            const file = fs.readFileSync(serverFolder + '/dependencies.json'); 
            try {
                /** @type {{ api?: { [key: string]: string[] }}} */
                const data = JSON.parse(file);
                if (!data.api) {
                    continue;
                }
    
                for (const apiKey in data.api) {
                    if (!APIMap.has(apiKey)) {
                        fs.appendFileSync(serverImportsPath, `alt.logError('::: Plugin: ${folderName} - Dependent API missing: ${apiKey}');` + '\r\n');
                        missing = true;
                        continue;
                    }


                    if (data.api.hasOwnProperty(apiKey)) {
                       for (const func of data.api[apiKey]) {
                            if (!APIMap.get(apiKey).includes(func)) {
                                fs.appendFileSync(serverImportsPath, `alt.logError('::: Plugin: ${folderName} - Dependent API function missing: ${apiKey} - ${func}');` + '\r\n');
                                missing = true;
                            }
                        }
                       
                    }
                }
            } catch (err) {
                console.warn(`Could not read, is JSON file valid? ${serverFolder}`);
            } 
        }

        if (missing === false) {
            fs.appendFileSync(serverImportsPath, `alt.log('::: Plugin: ${folderName}');` + '\r\n');
            const importLine = `import '${path}';`;
            fs.appendFileSync(serverImportsPath, importLine + '\r\n');  
        }
    }

    // Propogate client import paths
    for (let clientFolder of clientFolders) {
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
