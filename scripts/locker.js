import fs from 'fs';
import path from 'path';
import obfuscator from 'javascript-obfuscator';
import glob from 'fast-glob';
import { execSync } from 'child_process';
import { writeFile } from './fileHelpers.js';

const assetPackContent = `type = 'asset-pack\r\n'client-files = [ '*' ]`;

/**
 * Extracts just the path of the import
 * 
 * @param {string} line 
 * @return 
 */
function getImportFromLine(line) {
    return line.match(/(?<=').*(?=')/g);
}

/**
 * Adjust the imports for the given code base
 *
 * @param {string} code 
 */
function adjustClientImports(code, pluginName) {
    const lines = code.split('\n');
    for(let i = 0; i < lines.length; i++) {
        // Fixes an import path issue for importing core files in a locker plugin
        if (lines[i].includes('../main')) {
            lines[i] = lines[i].replace(/\..*main/g, '/main')
            console.log(lines[i]);
            continue;
        }

        if (lines[i].includes('..')) {
            continue;
        }

        if (!lines[i].includes('import')) {
            continue;
        }

        if (lines[i].includes('native') || lines[i].includes('alt-') || lines[i].includes('game')) {
            continue;
        }

        // Only allows for relative imports to fix file pathing issues
        if (lines[i].includes('./')) {
            const importPath = getImportFromLine(lines[i].replace('./', ''));
            lines[i] = `import('@rebar-${pluginName}/client/${importPath}')`;
            console.log(lines[i]);
            continue;
        }

        console.log(`Import on Line ${i} needs to be a relative import with './' for the path. Replace your import with ./x/y/z.js`)
        process.exit(1);
    }

    return lines.join('\n');
}

function main() {
    console.log(`Building Plugins...`)
    execSync('pnpm build:docker')
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

    const files = glob.globSync(folderPath + '/**/*.js');
    for(let filePath of files) {
        let code = fs.readFileSync(filePath, 'utf-8');
        if (filePath.includes('/client')) {
            code = adjustClientImports(code, name);
        }

        const newPath = filePath.replace('core/plugins', '').replace(name, `rebar-${name}`);

        const obfuscatedCode = obfuscator.obfuscate(code, { compact: true, stringArray: true, stringArrayRotate: true, stringArrayShuffle: true, stringArrayIndexShift: true, simplify: true }).getObfuscatedCode();
        writeFile(newPath, obfuscatedCode);
    }

    const newFolderPath = `resources/rebar-${name}`;
    writeFile(newFolderPath + '/resource.toml', assetPackContent);
}

main();
