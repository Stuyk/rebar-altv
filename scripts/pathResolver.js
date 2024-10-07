import glob from 'fast-glob';
import * as fs from 'fs';

function updatePaths(path) {
    const strippedPath = path.replace('./resources/core/', './');
    const pathDepth = strippedPath.split('/').length - 2;
    const relativePath = `../`.repeat(pathDepth);

    let file = fs.readFileSync(path, 'utf-8');
    file = file.replace(/\@Server/gm, `${relativePath}main/server`);
    file = file.replace(/\@Client/gm, `${relativePath}main/client`);
    file = file.replace(/\@Shared/gm, `${relativePath}main/shared`);
    file = file.replace(/\@Plugins/gm, `${relativePath}plugins`);
    fs.writeFileSync(path, file);
}

async function updateFiles() {
    for (let file of glob.sync('./resources/core/**/*.js')) {
        updatePaths(file);
    }
}

updateFiles();
