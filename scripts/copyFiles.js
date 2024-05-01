import * as fs from 'fs';
import glob from 'fast-glob';

const filesToCopy = {
    'src/plugins/**/sounds/**/*.ogg': {
        destination: 'resources',
        keyword: 'sounds',
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

            const finalPath = destination + '/' + splitPath.join('/');
            fs.copyFileSync(file, finalPath);
        }
    }
}

copyFiles();
