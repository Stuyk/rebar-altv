import * as alt from 'alt-server';
import { useServiceRegister } from './index.js';

export interface ItemService {
    /**
     * Add an item to the given player with a given quantity based on a common id
     *
     * Additionally, a sobject data may be passed if necessary.
     *
     * @memberof ItemService
     */
    add: (player: alt.Player, id: string, quantity: number, data?: Object) => Promise<boolean>;

    /**
     * Subtract an item quanatiy from the given player with a given quantity based on a common id
     *
     * @memberof ItemService
     */
    sub: (player: alt.Player, id: string, quantity: number) => Promise<boolean>;

    /**
     * Check if the player has enough of an item based on a common id
     *
     * @memberof ItemService
     */
    has: (player: alt.Player, id: string, quantity: number) => Promise<boolean>;

    /**
     * Remove an item from the player based on a unique identifier
     *
     * @memberof ItemService
     */
    remove: (player: alt.Player, uid: string) => Promise<boolean>;
}

declare global {
    interface RebarServices {
        itemService: ItemService;
    }
}

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:playerItemAdd': (...args: Parameters<ItemService['add']>) => void;
        'rebar:playerItemSub': (...args: Parameters<ItemService['sub']>) => void;
        'rebar:playerItemRemove': (...args: Parameters<ItemService['remove']>) => void;
    }
}

export function useItemService() {
    async function add(...args: Parameters<ItemService['add']>) {
        const service = useServiceRegister().get('itemService');
        if (!service || !service.add) {
            return false;
        }

        const result = await service.add(...args);
        if (result) {
            alt.emit('rebar:playerItemAdd', ...args);
        }

        return result;
    }

    async function sub(...args: Parameters<ItemService['sub']>) {
        const service = useServiceRegister().get('itemService');
        if (!service || !service.sub) {
            return false;
        }

        const result = await service.sub(...args);
        if (result) {
            alt.emit('rebar:playerItemSub', ...args);
        }

        return result;
    }

    async function has(...args: Parameters<ItemService['has']>) {
        const service = useServiceRegister().get('itemService');
        if (!service || !service.has) {
            return false;
        }

        return await service.has(...args);
    }

    async function remove(...args: Parameters<ItemService['remove']>) {
        const service = useServiceRegister().get('itemService');
        if (!service || !service.remove) {
            return false;
        }

        const result = await service.remove(...args);
        if (result) {
            alt.emit('rebar:playerItemRemove', ...args);
        }

        return result;
    }

    return {
        add,
        sub,
        has,
        remove,
    };
}
