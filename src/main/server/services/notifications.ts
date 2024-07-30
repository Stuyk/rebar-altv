import * as alt from 'alt-server';
import { useServices } from './index.js';
import { Events } from '../../shared/events/index.js';

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
        notificationService: Partial<NotificationService>;
    }
}

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        playerEmitNotification: (...args: Parameters<NotificationService['emit']>) => void;
        broadcastNotification: (...args: Parameters<NotificationService['broadcast']>) => void;
    }
}

export function useNotificationService() {
    return {
        emit(...args: Parameters<NotificationService['emit']>) {
            const services = useServices().get('notificationService');
            const player = args[0];
            if (!player || !player.valid) {
                return;
            }

            if (services.length <= 1) {
                for (let service of services) {
                    if (typeof service.emit !== 'function') {
                        continue;
                    }

                    service.emit(...args);
                }
            } else {
                args.shift();
                player.emit(Events.player.notify.notification.create, ...args);
            }

            alt.emit('playerEmitNotification', ...args);
        },
        broadcast(...args: Parameters<NotificationService['broadcast']>) {
            const services = useServices().get('notificationService');

            if (services.length >= 1) {
                for (let service of services) {
                    if (typeof service.broadcast !== 'function') {
                        continue;
                    }

                    service.broadcast(...args);
                }
            } else {
                for (let player of alt.Player.all) {
                    player.emit(Events.player.notify.notification.create, ...args);
                }
            }

            alt.emit('broadcastNotification', ...args);
        },
    };
}
