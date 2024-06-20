import * as alt from 'alt-client';
import { Events } from '../../shared/events/index.js';
import { useBuffer } from '../../shared/utility/buffer.js';

const BufferHelper = useBuffer();
let id: string;

export async function buildScreenshot() {
    const result = await alt.takeScreenshotGameOnly();
    const data = BufferHelper.toBuffer(result, 128);
    const totalLength = data.length;

    return {
        getData() {
            return data;
        },
        getLength() {
            return totalLength;
        },
    };
}

alt.onServer(Events.systems.screenshot.take, async (uid: string) => {
    id = uid;
    const screenshot = await buildScreenshot();
    for (let i = 0; i < screenshot.getLength(); i++) {
        alt.emitServer(Events.systems.screenshot.get, id, screenshot.getData()[i], i, screenshot.getLength());
    }
});
