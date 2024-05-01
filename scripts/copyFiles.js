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
}

copyFiles();
