import * as alt from 'alt-client';
import * as native from 'natives';

import {requestScaleForm, Scaleform} from './scaleform.js';
import {Credit, CreditAlignment} from '@Shared/types/index.js';
import {Events} from '@Shared/events/index.js';

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
 * Creates on-screen text that looks like the GTA:V credits.
 *
 * @param {Credit} credit
 * @return {void}
 */
export async function create(credit: Credit) {
    clear();

    scaleform = await requestScaleForm('OPENING_CREDITS');

    if (!scaleform) {
        scaleform = null;
        return;
    }

    if (!credit.align) {
        credit.align = CreditAlignment.LEFT;
    }

    const identifier = 1;

    if (interval) {
        scaleform.passFunction('HIDE', identifier, 1, 3, 1);
        await alt.Utils.wait(3000);
    }

    const [_, x, y] = native.getActualScreenResolution();

    scaleform.passFunction('SETUP_CREDIT_BLOCK', identifier, 0.0, y / 2, credit.align, 1, 1);
    scaleform.passFunction('ADD_ROLE_TO_CREDIT_BLOCK', identifier, credit.largeText, 0.0, 4, true, '');
    scaleform.passFunction('ADD_NAMES_TO_CREDIT_BLOCK', identifier, credit.smallText, 100.1, ';', true);
    scaleform.passFunction('SHOW_CREDIT_BLOCK', identifier, 2, 'X', 1);

    interval = alt.setInterval(() => {
        scaleform.render(0.5, 0.5, 0.71, 0.68);
    }, 0);

    if (credit.duration <= 0) {
        credit.duration = 5000;
    }

    alt.setTimeout(async () => {
        scaleform.passFunction('HIDE', identifier, 1, 3, 1);
        await alt.Utils.wait(3000);
        scaleform.passFunction('REMOVE_ALL');
        clear();
    }, credit.duration);
}

alt.onServer(Events.player.notify.credits.create, create);
