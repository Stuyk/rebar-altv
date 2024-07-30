import * as alt from 'alt-server';
import { useServices } from './index.js';

export interface DeathService {
    /**
     * Called when a player is respawned in a new location
     *
     * @memberof DeathService
     */
    respawn: (player: alt.Player, pos: alt.Vector3) => void;

    /**
     * Called when a player is revived in the same location
     *
     * @memberof DeathService
     */
    revive: (player: alt.Player) => void;
}

declare global {
    interface RebarServices {
        deathService: Partial<DeathService>;
    }
}

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        playerRespawn: (...args: Parameters<DeathService['respawn']>) => void;
        playerRevive: (...args: Parameters<DeathService['revive']>) => void;
    }
}

export function useDeathService() {
    return {
        respawn(...args: Parameters<DeathService['respawn']>) {
            const services = useServices().get('deathService');
            if (services.length <= 0) {
                return;
            }

            for (let service of services) {
                if (typeof service.respawn !== 'function') {
                    continue;
                }

                service.respawn(...args);
            }

            alt.emit('playerRespawn', ...args);
        },
        revive(...args: Parameters<DeathService['revive']>) {
            const services = useServices().get('deathService');
            if (services.length <= 0) {
                return;
            }

            for (let service of services) {
                if (typeof service.revive !== 'function') {
                    continue;
                }

                service.revive(...args);
            }

            alt.emit('playerRevive', ...args);
        },
    };
}
