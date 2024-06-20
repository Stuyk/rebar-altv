import * as alt from 'alt-server';
import fs from 'fs';
import { Events } from '@Shared/events/index.js';
import { useBuffer } from '@Shared/utility/buffer.js';

const BufferHelper = useBuffer();

const cache: { [id: string]: { data: Array<string>; isComplete: boolean } } = {};

export function useScreenshot(player: alt.Player) {
    async function take(screenshotName: string) {
        player.emit(Events.systems.screenshot.take, screenshotName);
        await alt.Utils.waitFor(() => typeof cache[screenshotName] !== 'undefined', 10000);
        await alt.Utils.waitFor(() => cache[screenshotName].isComplete, 10000);
        if (!cache[screenshotName].isComplete) {
            throw new Error(`Failed to capture screenshot for Player ID - ${player.id}`);
        }

        let data = BufferHelper.fromBuffer(cache[screenshotName].data);
        delete cache[screenshotName];

        if (!fs.existsSync(`${process.cwd()}/screenshots`)) {
            fs.mkdirSync(`${process.cwd()}/screenshots`, { recursive: true });
        }

        alt.log(`Saved Screenshot: ${screenshotName}`);
        const path = `${process.cwd()}/screenshots/${screenshotName}.jpg`;
        data = data.replace(/^data:image\/\w+;base64,/, '');
        const buf = Buffer.from(data, 'base64');
        fs.writeFileSync(path, buf);
    }

    return { take };
}

alt.onClient(
    Events.systems.screenshot.get,
    (player: alt.Player, id: string, data: string, index: number, maxLength: number) => {
        if (!cache[id]) {
            cache[id] = {
                data: new Array(maxLength),
                isComplete: false,
            };
        }

        cache[id].data[index] = data;
        if (index === maxLength - 1) {
            cache[id].isComplete = true;
        }
    },
);
