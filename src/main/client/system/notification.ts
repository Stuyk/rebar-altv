import * as alt from 'alt-client';
import { Events } from '@Shared/events/index.js';
import { createNotification } from '../screen/notification.js';

type NotificationCallback = (message: string) => void;

const callbacks: NotificationCallback[] = [];
const history: { date: number; message: string }[] = [];

function create(text: string) {
    history.unshift({ message: text, date: Date.now() });

    if (callbacks.length <= 0) {
        createNotification(text);
        return;
    }

    for (let callback of callbacks) {
        callback(text);
    }
}

export function useNotification() {
    function on(callback: NotificationCallback) {
        callbacks.push(callback);
    }

    return {
        on,
        getHistory() {
            return history;
        },
    };
}

alt.onServer(Events.player.notify.notification.create, create);
