import * as fs from 'fs';
import * as path from 'path';

/**
 * Replace windows based pathing with linux based pathing
 *
 * @export
 * @param {string} path
 * @return {string}
 */
export function sanitizePath(path) {
    return path.replace(/\\/g, '/');
}

export function getEnabledPlugins() {
    const pluginsFolder = sanitizePath(path.join(process.cwd(), 'src/plugins'));
    const plugins = fs.readdirSync(pluginsFolder);

    return plugins.filter((plugin) => {
        if (plugin.includes('!')) {
            return false;
        }

        return true;
    });
}
