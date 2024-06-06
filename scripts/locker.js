import fs from 'fs';
import path from 'path';
import obfuscator from 'javascript-obfuscator';
import glob from 'fast-glob';
import { execSync } from 'child_process';
import { writeFile } from './fileHelpers.js';

const assetPackContent = `type = 'asset-pack'\r\nclient-files = [ '*' ]`;

/**
 * Extracts just the path of the import
 * 
 * @param {string} line 
 * @return 
 */
function getImportFromLine(line) {
    return line.match(/(?<=').*(?=')/g)[0];
}

function adjustServerImports(pluginName, code) {
    pluginName = `rebar-${pluginName}`;
    const lines = code.split('\n');
    for(let i = 0; i < lines.length; i++) {
        if (!lines[i].includes('import')) {
            continue;
        }

        // Handle Server Import
        if (lines[i].includes('@Server')) {
            lines[i] = lines[i].replace('@Server', '../../core/main/server');
            console.log(lines[i]);
            continue;
        }

        // Handle Shared Import
        if (lines[i].includes('@Shared')) {
            lines[i] = lines[i].replace('@Shared', '../../core/main/shared');
            continue;
        }

        // Handle Relative Import
        if (!lines[i].includes('.js')) {
            continue;
        }

        const importLine = getImportFromLine(lines[i]);
        const pathing = importLine.split('/')
        if (!pathing || pathing.length <= 0) {
            continue;
        }

        while(pathing[0].includes('.')) {
            if (pathing[0].includes('.js')) {
                break;
            }

            pathing.shift();
        }

        const serverOrShared = !importLine.includes('shared') && !importLine.includes('translate') ? 'server/' : ''

        const newPath = `../../${pluginName}/` + serverOrShared + pathing.join('/');
        lines[i] = lines[i].replace(importLine, newPath);
    }

    return lines.join('\n');
}

/**
 * @param {string} pluginName 
 * @param {string} line 
 * @param {string|undefined} prefix
 */
function updateClientLine(pluginName, line, prefix) {
    if (!line.includes('from') || !line.includes('import')) {
        return line;
    }

    if (line.includes('alt-client') || line.includes('native') || line.includes('game')) {
        return line;
    }

    if (line.includes('import')) {
        line = line.replace('import', 'const');
    }

    if (line.includes('@Client')) {
        const importPath = getImportFromLine(line);
        const newPath = importPath.replace('@Client', '/main/client');
        return line.replace(/from.*/, `= await import('${newPath}')`);
    }

    if (line.includes('import') && !line.includes('from')) {
        line = line.replace('import', 'const');
        return line;
    }

    pluginName = `rebar-${pluginName}`;

    // modifying this: '../shared/helpers.js'
    let importPath = getImportFromLine(line)
    const splitPath = importPath.split('/');
    while(splitPath[0].includes('.')) {
        if (splitPath[0].includes('.js')) {
            break;
        }

        splitPath.shift();
    }

    // shared/helpers.js
    importPath = splitPath.join('/');
    const endPrefix = prefix ? `${prefix}/${importPath}` : importPath

    if (line.includes('from') && line.includes('.js')) {
        line = line.replace(/from.*/, `= await import('@${pluginName}/client/${endPrefix}')`)
    }

    return line;
}

/**
 * Adjust the imports for the given code base
 *
 * @param {string} code 
 */
function adjustClientImports(pluginName, code, prefix) {
    const lines = code.split('\n');
    for(let i = 0; i < lines.length; i++) {
        lines[i] = updateClientLine(pluginName, lines[i], prefix)
    }

    return lines.join('\n');
}

function main() {
    console.log(`Building Plugins...`)
    execSync('pnpm build:locker')
    console.log(`Build Complete, building plugin...`)

    const args = process.argv.slice(2);
    if (args.length <= 0) {
        console.error(`Please provide a plugin name as an argument`);
        process.exit(1);
    }

    const name = args[0];
    const folderPath = `resources/core/plugins/${name}`;
    if (!fs.existsSync(folderPath)) {
        console.error(`Plugin does not exist, are you sure you typed the folder name correctly?`);
        process.exit(1);
    }

    const files = glob.globSync(folderPath + '/**/(server|client|shared|translate)/*.js');
    for(let filePath of files) {
        const originalCode = fs.readFileSync(filePath, 'utf-8');
        let importAdjustedCodeServer = adjustServerImports(name, originalCode)
        let importAdjustedCodeClient = adjustClientImports(name, originalCode, filePath.includes('/shared') ? 'shared' : undefined);

        if (filePath.includes('/server/')) {
            const newPath = filePath.replace('core/plugins/', '').replace(name, `rebar-${name}`);
            const obfuscatedCode = obfuscator.obfuscate(importAdjustedCodeServer, { compact: true, stringArray: true, stringArrayRotate: true, stringArrayShuffle: true, stringArrayIndexShift: true, simplify: true }).getObfuscatedCode();
            writeFile(newPath, obfuscatedCode);
            continue;
        }

        // const obfuscatedCode = obfuscator.obfuscate(importAdjustedCode, { compact: true, stringArray: true, stringArrayRotate: true, stringArrayShuffle: true, stringArrayIndexShift: true, simplify: true }).getObfuscatedCode();
        // const obfuscatedCode = importAdjustedCode;
        if (filePath.includes(`${name}/shared/`) || filePath.includes(`${name}/translate/`)) {
            const newPath = filePath.replace('core/plugins/', '').replace(name, `rebar-${name}/client`); 
            const obfuscatedCode = obfuscator.obfuscate(importAdjustedCodeClient, { compact: true, stringArray: true, stringArrayRotate: true, stringArrayShuffle: true, stringArrayIndexShift: true, simplify: true }).getObfuscatedCode();
            writeFile(newPath, obfuscatedCode);
        }

        const newPath = filePath.replace('core/plugins/', '').replace(name, `rebar-${name}`);
        const codeToUse = filePath.includes(`${name}/translate`) || filePath.includes(`${name}/shared`) ? importAdjustedCodeServer : importAdjustedCodeClient;
        const obfuscatedCode = obfuscator.obfuscate(codeToUse, { compact: true, stringArray: true, stringArrayRotate: true, stringArrayShuffle: true, stringArrayIndexShift: true, simplify: true }).getObfuscatedCode();
        writeFile(newPath, obfuscatedCode);
    }

    const newFolderPath = `resources/rebar-${name}`;
    writeFile(newFolderPath + '/resource.toml', assetPackContent);
}

main();
