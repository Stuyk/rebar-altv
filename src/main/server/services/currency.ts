import * as alt from 'alt-server';
import { useServices } from './index.js';

export interface CurrencyService {
    /**
     * Called when you want to add a currency to a player
     *
     * @memberof CurrencyService
     */
    add: (player: alt.Player, type: string, quantity: number) => void;

    /**
     * Called when you want to remove a currency from a player
     *
     * @memberof CurrencyService
     */
    sub: (player: alt.Player, type: string, quantity: number) => void;

    /**
     * Called when you want to check if the player has enough currency
     *
     * @memberof CurrencyService
     */
    has: (player: alt.Player, type: string, quantity: number) => boolean;
}

declare global {
    interface RebarServices {
        currencyService: Partial<CurrencyService>;
    }
}

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        playerCurrencyAdd: (...args: Parameters<CurrencyService['add']>) => void;
        playerCurrencySub: (...args: Parameters<CurrencyService['sub']>) => void;
    }
}

export function useCurrencyService() {
    return {
        add(...args: Parameters<CurrencyService['add']>) {
            const services = useServices().get('currencyService');
            if (services.length <= 0) {
                return;
            }

            for (let service of services) {
                if (typeof service.add !== 'function') {
                    continue;
                }

                service.add(...args);
            }

            alt.emit('playerCurrencyAdd', ...args);
        },
        sub(...args: Parameters<CurrencyService['sub']>) {
            const services = useServices().get('currencyService');
            if (services.length <= 0) {
                return;
            }

            for (let service of services) {
                if (typeof service.sub !== 'function') {
                    continue;
                }

                service.sub(...args);
            }

            alt.emit('playerCurrencySub', ...args);
        },
        has(...args: Parameters<CurrencyService['has']>) {
            const services = useServices().get('currencyService');
            if (services.length <= 0) {
                return false;
            }

            for (let service of services) {
                if (typeof service.sub !== 'function') {
                    continue;
                }

                const result = service.has(...args);
                if (!result) {
                    return false;
                }
            }

            return true;
        },
    };
}
