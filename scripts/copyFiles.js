import * as fs from 'fs';
import glob from 'fast-glob';

const filesToCopy = {
    'src/plugins/**/sounds/**/*.ogg': {
        destination: ['resources', 'webview/public'],
        keyword: 'sounds',
    },
    'src/plugins/**/images/**/*.+(jpg|jpeg|png|bmp|svg|webp)': {
        destination: ['resources', 'webview/public'],
        keyword: 'images',
    },
};

/**
 * Changes html tags to rml tags
 *
 * @param {string} content
 * @return
 */
function fixRmluiFile(content) {
    return content.replaceAll(/html>/gm, 'rml>');
}

/**
 * Moves rmlui files to resources/rmlui/plugins
 *
 * Making all rmlui files accessible under @rmlui/plugins/plugin-name/file.rmlui
 */
function moveRmluiFiles() {
    const pluginPath = 'resources/rmlui/plugins';
    if (fs.existsSync(pluginPath)) {
        try {
            fs.rmSync(pluginPath, { recursive: true, force: true });
        } catch (err) {}
    }

    const rmluiFiles = glob.sync(`src/plugins/**/rmlui/**/*.+(html|ttf)`);
    for (let file of rmluiFiles) {
        const splitPath = file.split('/');
        const pluginName = getPluginName(splitPath);
        const fileName = splitPath[splitPath.length - 1].replace('.html', '.rml');
        const filePath = `${pluginPath}/${pluginName}`;

        fs.mkdirSync(filePath, { recursive: true });

        if (fileName.includes('.ttf')) {
            fs.copyFileSync(file, filePath + '/' + fileName);
            continue;
        }

        let content = fs.readFileSync(file, 'utf-8');
        content = fixRmluiFile(content);
        fs.writeFileSync(filePath + '/' + fileName, content);
    }
}

/**
 * Returns the name of the plugin
 *
 * @param {Array<string>} splitPath
 */
function getPluginName(splitPath) {
    let index = splitPath.findIndex((x) => x.includes('plugins'));
    return splitPath[index + 1];
}

function copyFiles() {
    const folders = Object.keys(filesToCopy);
    for (let folder of folders) {
        const files = glob.sync(folder);
        const { destination, keyword } = filesToCopy[folder];

        for (let file of files) {
            const splitPath = file.split('/');

            while (!splitPath[0].includes(keyword)) {
                splitPath.shift();
            }

            if (!splitPath) {
                continue;
            }

            if (Array.isArray(destination)) {
                for (let dest of destination) {
                    const finalPath = dest + '/' + splitPath.join('/');
                    fs.copyFileSync(file, finalPath);
                }
            } else {
                const finalPath = destination + '/' + splitPath.join('/');
                fs.copyFileSync(file, finalPath);
            }
        }
    }

    moveRmluiFiles();
}

copyFiles();
