import * as alt from 'alt-server';
import * as fs from 'fs';

const MainVersionPath = `https://raw.githubusercontent.com/Stuyk/rebar-altv/main/package.json`;

async function init() {
    const packageJSON = fs.readFileSync('package.json', 'utf-8');
    const packageContent: { version: number } = JSON.parse(packageJSON);

    const req = await fetch(MainVersionPath).catch((err) => {
        return undefined;
    });

    if (!req || !req.ok) {
        alt.log(req);
        return;
    }

    const data: { version: number } = await req.json();
    if (data.version == packageContent.version || packageContent.version > data.version) {
        return;
    }

    alt.setTimeout(() => {
        alt.logWarning(
            `Version ${data.version} of Rebar is now available! You are on version ${packageContent.version}.`,
        );
        alt.logWarning(`Check https://rebarv.com/install#auto-upgrade for instructions.`);
    }, 3000);
}

init();
