import * as alt from 'alt-client';
import * as ScreenText from '../screen/textlabel.js';
import * as ScreenShapes from '../screen/shapes.js';
import { Events } from '@Shared/events/index.js';
import { distance2d } from '@Shared/utility/vector.js';
import { ProgressBar } from '../../shared/types/progressBar.js';

const MAX_DISTANCE = 20;
const bars: ProgressBar[] = [];
const blackBarSize = { x: 0.2, y: 0.05 };
const overBarSize = { x: 0.19, y: 0.035 };

function draw() {
    if (bars.length <= 0) {
        return;
    }

    for (let bar of bars) {
        const dist = distance2d(alt.Player.local.pos, bar.pos);
        if (dist > MAX_DISTANCE) {
            continue;
        }

        if (bar.dimension !== alt.Player.local.dimension) {
            continue;
        }

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

function handleCreate(bar: ProgressBar) {
    const idx = bars.findIndex((x) => x.uid == bar.uid);
    if (idx <= -1) {
        bars.push(bar);
    } else {
        bars[idx] = bar;
    }
}

function handleDestroy(uid: string) {
    for (let i = bars.length - 1; i >= 0; i--) {
        if (bars[i].uid != uid) {
            continue;
        }

        bars.splice(i, 1);
    }
}

alt.onServer(Events.controllers.progressbar.create, handleCreate);
alt.onServer(Events.controllers.progressbar.destroy, handleDestroy);
alt.everyTick(draw);
