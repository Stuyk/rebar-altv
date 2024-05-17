import * as fs from 'fs';
import glob from 'fast-glob';
import { execSync } from 'child_process';

async function buildDependencies() {
    const filePaths = [
        ...glob.sync('./src/plugins/**/package.json'),
        ...glob.sync('./src/plugins/**/dependencies.json'),
    ];

    if (filePaths.length <= 0) {
        return;
    }

    const packageList = [];
    for (let filePath of filePaths) {
        const file = fs.readFileSync(filePath);

        try {
            /** @type {{ dependencies?: { [key: string]: string }}} */
            const data = JSON.parse(file);
            if (!data.dependencies) {
                continue;
            }

            for (let packageName of Object.keys(data.dependencies)) {
                if (fs.existsSync(`node_modules/${packageName}`)) {
                    continue;
                }

                packageList.push(`${packageName}@${data.dependencies[packageName]}`);
            }
        } catch (err) {
            console.warn(`Could not read, is JSON file valid? ${filePath}`);
        }
    }

    if (packageList.length <= 0) {
        return;
    }

    const cmd = `pnpm install ${packageList.join(' ')}`;
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (err) {
        console.warn(`Failed to install additional dependencies.`);
    }
}

buildDependencies();
