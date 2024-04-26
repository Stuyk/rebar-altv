import * as alt from 'alt-server';
import { Events } from '../../shared/events/index.js';
import { Spinner } from '../../shared/types/spinner.js';
import { Shard } from '../../shared/types/shard.js';
import { Credit } from '../../shared/types/credits.js';

export function useNotify(player: alt.Player) {
    function showNotification(message: string) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.notify.notification.create, message);
    }

    function showMissionText(message: string, duration?: number) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.notify.missiontext.create, message, duration);
    }

    function showSpinner(spinner: Spinner) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.notify.spinner.create, spinner);
    }

    function showShard(shard: Shard) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.notify.shard.create, shard);
    }

    function showCredits(credits: Credit) {
        if (!player || !player.valid) {
            return;
        }

        player.emit(Events.player.notify.credits.create, credits);
    }

    return {
        showNotification,
        showMissionText,
        showSpinner,
        showShard,
        showCredits,
    };
}
