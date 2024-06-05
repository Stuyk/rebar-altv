import * as fs from 'fs';
import * as path from 'path';
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

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

function copyFiles() {
    const folders = Object.keys(filesToCopy);
    for (let folder of folders) {
        const files = glob.sync(folder);
        const { destination, keyword } = filesToCopy[folder];

        for (let file of files) {
            const splitPath = file.split(path.sep);

            while (!splitPath[0].includes(keyword)) {
                splitPath.shift();
            }

            if (!splitPath.length) {
                continue;
            }

            if (Array.isArray(destination)) {
                for (let dest of destination) {
                    const finalPath = path.join(dest, ...splitPath);
                    ensureDirectoryExistence(finalPath);
                    fs.copyFileSync(file, finalPath);
                }
            } else {
                const finalPath = path.join(destination, ...splitPath);
                ensureDirectoryExistence(finalPath);
                fs.copyFileSync(file, finalPath);
            }
        }
    }
}

copyFiles();
