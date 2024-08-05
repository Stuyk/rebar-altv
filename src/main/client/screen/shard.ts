import * as alt from 'alt-client';
import { Scaleform, requestScaleForm } from './scaleform.js';
import {Shard} from '@Shared/types/index.js';
import { Events } from '@Shared/events/index.js';

let scaleform: Scaleform;
let interval: number;
let timeout: number;

function clear() {
    if (scaleform) {
        scaleform.destroy();
        scaleform = null;
    }

    if (timeout) {
        alt.clearTimeout(timeout);
        timeout = null;
    }

    if (interval) {
        alt.clearInterval(interval);
        interval = null;
    }
}

/**
 * Create a shard, a shard is essentially the mission passed / mission failed text.
 *
 * @param {IShard} shard
 * @return {void}
 */
export async function create(shard: Shard) {
    await clear();

    scaleform = await requestScaleForm('MP_BIG_MESSAGE_FREEMODE');

    if (!scaleform) {
        scaleform = null;
        return;
    }

    scaleform.passFunction('SHOW_SHARD_WASTED_MP_MESSAGE', shard.title, shard.subtitle ?? '');

    interval = alt.setInterval(() => {
        scaleform.render(0.5, 0.5, 1, 1);
    }, 0);

    if (shard.duration <= 0) {
        shard.duration = 5000;
    }

    alt.setTimeout(clear, shard.duration);
}

alt.onServer(Events.player.notify.shard.create, create);
