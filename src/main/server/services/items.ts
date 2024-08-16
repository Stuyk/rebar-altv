import * as alt from 'alt-server';
import { useServiceRegister } from './index.js';
import { Item, RebarBaseItem } from '@Shared/types/items.js';

export interface ItemService {
    /**
     * Add an item to the given entity with a given quantity based on a common id
     *
     * Additionally, a sobject data may be passed if necessary.
     *
     * @memberof ItemService
     */
    add: (entity: alt.Entity, id: string, quantity: number, data?: any) => Promise<boolean>;

    /**
     * Subtract an item quanatiy from the given entity with a given quantity based on a common id
     *
     * @memberof ItemService
     */
    sub: (entity: alt.Entity, id: string, quantity: number) => Promise<boolean>;

    /**
     * Check if the entity has enough of an item based on a common id
     *
     * @memberof ItemService
     */
    has: (entity: alt.Entity, id: string, quantity: number) => Promise<boolean>;

    /**
     * Remove an item from the entity based on a unique identifier
     *
     * @memberof ItemService
     */
    remove: (entity: alt.Entity, uid: string) => Promise<boolean>;

    /**
     * Use an item if it can be used, based on unique identifier
     *
     * @param entity
     * @param uid
     * @returns
     */
    use: (entity: alt.Entity, uid: string) => Promise<boolean>;

    /**
     * Verify if an entity has enough space to store the item
     *
     * @memberof ItemService
     */
    hasSpace: (entity: alt.Entity, item: Item) => Promise<boolean>;

    /**
     * Create an item in the database if it does not exist
     *
     * @memberof ItemService
     */
    itemCreate: (data: RebarBaseItem) => Promise<void>;

    /**
     * Remove an item from the database if it exists
     *
     * @memberof ItemService
     */
    itemRemove: (id: keyof RebarItems) => Promise<void>;
}

declare global {
    interface RebarServices {
        itemService: ItemService;
    }
}

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:entityItemAdd': (entity: alt.Entity, id: string, quantity: number, data?: any) => void;
        'rebar:entityItemSub': (entity: alt.Entity, id: string, quantity: number) => void;
        'rebar:entityItemRemove': (entity: alt.Entity, uid: string) => void;
        'rebar:entityItemUse': (entity: alt.Entity, uid: string) => void;
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
            alt.emit('rebar:entityItemAdd', ...args);
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
            alt.emit('rebar:entityItemSub', ...args);
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
            alt.emit('rebar:entityItemRemove', ...args);
        }

        return result;
    }

    async function use(...args: Parameters<ItemService['use']>) {
        const service = useServiceRegister().get('itemService');
        if (!service || !service.use) {
            return false;
        }

        const result = await service.use(...args);
        if (result) {
            alt.emit('rebar:entityItemUse', ...args);
        }

        return result;
    }

    async function hasSpace(...args: Parameters<ItemService['hasSpace']>) {
        const service = useServiceRegister().get('itemService');
        if (!service || !service.hasSpace) {
            return false;
        }

        return await service.hasSpace(...args);
    }

    async function itemCreate(...args: Parameters<ItemService['itemCreate']>) {
        const service = useServiceRegister().get('itemService');
        if (!service || !service.itemCreate) {
            return;
        }

        await service.itemCreate(...args);
    }

    async function itemRemove(...args: Parameters<ItemService['itemRemove']>) {
        const service = useServiceRegister().get('itemService');
        if (!service || !service.itemRemove) {
            return;
        }

        await service.itemRemove(...args);
    }

    return {
        add,
        sub,
        has,
        hasSpace,
        itemCreate,
        itemRemove,
        remove,
        use,
    };
}
