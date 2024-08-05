import * as alt from 'alt-server';
import { useServiceRegister } from './index.js';
import { Events } from '@Shared/events/index.js';

export interface NotificationService {
    /**
     * emit a notification to player
     *
     * @memberof NotificationService
     */
    emit: (player: alt.Player, msg: string, type?: string) => void;

    /**
     * Send a notification to all players
     *
     * @memberof NotificationService
     */
    broadcast: (msg: string, type?: string) => void;
}

declare global {
    interface RebarServices {
        notificationService: NotificationService;
    }
}

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:playerEmitNotification': (...args: Parameters<NotificationService['emit']>) => void;
        'rebar:broadcastNotification': (...args: Parameters<NotificationService['broadcast']>) => void;
    }
}

export function useNotificationService() {
    return {
        emit(...args: Parameters<NotificationService['emit']>) {
            const service = useServiceRegister().get('notificationService');
            const player = args[0];
            if (!player || !player.valid) {
                return;
            }

            if (service && service.emit) {
                service.emit(...args);
            } else {
                args.shift();
                player.emit(Events.player.notify.notification.create, ...args);
            }

            alt.emit('rebar:playerEmitNotification', ...args);
        },
        broadcast(...args: Parameters<NotificationService['broadcast']>) {
            const service = useServiceRegister().get('notificationService');

            if (service && service.broadcast) {
                service.broadcast(...args);
            } else {
                for (let player of alt.Player.all) {
                    player.emit(Events.player.notify.notification.create, ...args);
                }
            }

            alt.emit('rebar:broadcastNotification', ...args);
        },
    };
}
