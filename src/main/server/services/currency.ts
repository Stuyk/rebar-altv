import * as alt from 'alt-server';
import { useServiceRegister } from './index.js';

export interface CurrencyService {
    /**
     * Called when you want to add a currency to a player
     *
     * @memberof CurrencyService
     */
    add: (player: alt.Player, type: string, quantity: number) => Promise<boolean>;

    /**
     * Called when you want to remove a currency from a player
     *
     * @memberof CurrencyService
     */
    sub: (player: alt.Player, type: string, quantity: number) => Promise<boolean>;

    /**
     * Called when you want to check if the player has enough currency
     *
     * @memberof CurrencyService
     */
    has: (player: alt.Player, type: string, quantity: number) => Promise<boolean>;
}

declare global {
    interface RebarServices {
        currencyService: CurrencyService;
    }
}

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:playerCurrencyAdd': (...args: Parameters<CurrencyService['add']>) => void;
        'rebar:playerCurrencySub': (...args: Parameters<CurrencyService['sub']>) => void;
    }
}

export function useCurrencyService() {
    return {
        add(...args: Parameters<CurrencyService['add']>) {
            const service = useServiceRegister().get('currencyService');
            if (!service || !service.add) {
                return false;
            }

            const result = service.add(...args);
            if (result) {
                alt.emit('rebar:playerCurrencyAdd', ...args);
            }

            return result;
        },
        sub(...args: Parameters<CurrencyService['sub']>) {
            const service = useServiceRegister().get('currencyService');
            if (!service || !service.sub) {
                return false;
            }

            const result = service.sub(...args);
            if (result) {
                alt.emit('rebar:playerCurrencySub', ...args);
            }

            return result;
        },
        has(...args: Parameters<CurrencyService['has']>) {
            const service = useServiceRegister().get('currencyService');
            if (!service || !service.has) {
                return false;
            }

            return service.has(...args);
        },
    };
}
