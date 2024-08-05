import * as alt from 'alt-server';
import { Events } from '@Shared/events/index.js';
import {Spinner, Shard, Credit, Message} from '@Shared/types/index.js';
import { useMessenger } from '../systems/messenger.js';
import { useNotificationService } from '../services/notifications.js';

const messenger = useMessenger();

export function useNotify(player: alt.Player) {
    function showNotification(message: string, type?: string) {
        if (!player || !player.valid) {
            return;
        }

        useNotificationService().emit(player, message, type);
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

    function sendMessage(message: Message | string) {
        if (typeof message === 'string') {
            messenger.message.send(player, { content: message, type: 'custom' });
            return;
        }

        messenger.message.send(player, message);
    }

    return {
        sendMessage,
        showNotification,
        showMissionText,
        showSpinner,
        showShard,
        showCredits,
    };
}
