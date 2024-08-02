import * as alt from 'alt-server';
import { useServiceRegister } from './index.js';

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
        deathService: DeathService;
    }
}

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:playerRespawn': (...args: Parameters<DeathService['respawn']>) => void;
        'rebar:playerRevive': (...args: Parameters<DeathService['revive']>) => void;
    }
}

export function useDeathService() {
    return {
        respawn(...args: Parameters<DeathService['respawn']>) {
            const service = useServiceRegister().get('deathService');
            if (service && service.respawn) {
                service.respawn(...args);
            }

            alt.emit('rebar:playerRespawn', ...args);
        },
        revive(...args: Parameters<DeathService['revive']>) {
            const service = useServiceRegister().get('deathService');
            if (service && service.respawn) {
                service.revive(...args);
            }

            alt.emit('rebar:playerRevive', ...args);
        },
    };
}
