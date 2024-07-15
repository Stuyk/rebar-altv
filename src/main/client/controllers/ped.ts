import * as alt from 'alt-client';
import * as native from 'natives';
import { Events } from '@Shared/events/index.js';

alt.on('gameEntityCreate', (entity) => {
    if (!(entity instanceof alt.Ped)) {
        return;
    }

    if (entity.getStreamSyncedMeta('makeStupid')) {
        native.disablePedPainAudio(entity, true);
    }

    if (entity.getStreamSyncedMeta('invincible')) {
        native.setEntityInvincible(entity, true);
    }
});

alt.everyTick(() => {
    for (let ped of alt.Ped.streamedIn) {
        if (ped.getStreamSyncedMeta('makeStupid')) {
            native.setPedCanRagdoll(ped, false);
            native.setBlockingOfNonTemporaryEvents(ped, true);
        }
        native.setPedResetFlag(ped, 458, true);
        native.setPedResetFlag(ped, 64, true);
        native.setPedResetFlag(ped, 249, true);
    }
});

async function invoke(nativeName: string, ...args: any[]) {
    if (nativeName === 'taskPlayAnim') {
        const [ped, dict, name, enterPlayback, exitPlayback, duration, flag, rate, lockX, lockY, lockZ] = args;

        await alt.Utils.requestAnimDict(args[1]);

        for (let i = 0; i < 64; i++) {
            await alt.Utils.wait(500);

            if (native.isEntityPlayingAnim(ped, dict, name, 3)) {
                break;
            }

            native[nativeName](ped, dict, name, enterPlayback, exitPlayback, duration, flag, rate, lockX, lockY, lockZ);
        }

        return;
    }

    native[nativeName](...args);
}

async function invokeRpc(nativeName: string, ...args: any[]) {
    return native[nativeName](...args);
}

async function fadeOut(ped: alt.Ped) {
    let alphaValue = 255;

    while (alphaValue > 0) {
        if (!ped || !ped.valid) {
            return;
        }

        alphaValue -= 7;
        if (alphaValue <= 25) {
            native.setEntityAlpha(ped, 0, false);
            break;
        }

        native.setEntityAlpha(ped, alphaValue, false);
        await alt.Utils.wait(100);
    }
}

alt.onServer(Events.controllers.ped.fadeOut, fadeOut);
alt.onServer(Events.controllers.ped.invoke, invoke);
alt.onRpc(Events.controllers.ped.invokeRpc, invokeRpc);
