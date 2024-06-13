import * as alt from 'alt-client';
import * as ScreenText from '../screen/textlabel.js';
import * as ScreenShapes from '../screen/shapes.js';
import { ProgressBar } from '../../shared/types/progressBar.js';

const GroupType = 'progressbar';
const blackBarSize = { x: 0.2, y: 0.05 };
const overBarSize = { x: 0.19, y: 0.035 };

let interval: number;
let bars: (ProgressBar & { entity: alt.Entity })[] = [];

function draw() {
    for (let bar of bars) {
        const wholeXSize = overBarSize.x * 100;
        const pct = (bar.value / bar.maxValue) * 0.01;
        const width = wholeXSize * pct;

        ScreenShapes.drawRectangle(
            bar.pos,
            new alt.Vector2(blackBarSize.x, blackBarSize.y),
            new alt.RGBA(0, 0, 0, 100),
        );
        ScreenShapes.drawRectangle(bar.pos, new alt.Vector2(width, overBarSize.y), new alt.RGBA(255, 255, 255, 200), {
            x: -(overBarSize.x / 2) + width / 2,
            y: 0,
        });
        ScreenText.drawText3D(bar.label, bar.pos, 0.4, new alt.RGBA(255, 255, 255, 255));
    }
}

function onStreamEnter(entity: alt.Object) {
    if (!isVirtualEntity(entity)) {
        return;
    }

    if (!interval) {
        interval = alt.setInterval(draw, 0);
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    const index = bars.findIndex((x) => x.uid === data.uid);
    if (index !== -1) {
        bars[index] = { ...data, entity };
    } else {
        bars.push({ ...data, entity });
    }
}

function onStreamExit(entity: alt.Object) {
    if (!isVirtualEntity(entity)) {
        return;
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    for (let i = bars.length - 1; i >= 0; i--) {
        if (bars[i].uid !== data.uid) {
            continue;
        }

        bars.splice(i, 1);
    }

    if (bars.length <= 0) {
        alt.clearInterval(interval);
        interval = undefined;
    }
}

function onStreamSyncedMetaChanged(entity: alt.Object, key: string, value: any) {
    if (!isVirtualEntity(entity)) {
        return;
    }

    const data = getData(entity);
    if (!data) {
        return;
    }

    const index = bars.findIndex((x) => x.uid === data.uid);
    if (index <= -1) {
        return;
    }

    bars[index] = { ...data, entity };
}

function getData(object: alt.Object) {
    return object.getStreamSyncedMeta(GroupType) as ProgressBar;
}

function isVirtualEntity(object: alt.Object) {
    if (!(object instanceof alt.VirtualEntity)) {
        return false;
    }

    return object.getStreamSyncedMeta('type') === GroupType;
}

alt.log(`Virtual Entities - Loaded Progressbar Handler`);
alt.on('worldObjectStreamIn', onStreamEnter);
alt.on('worldObjectStreamOut', onStreamExit);
alt.on('streamSyncedMetaChange', onStreamSyncedMetaChanged);
