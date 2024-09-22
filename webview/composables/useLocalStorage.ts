import { Events } from '../../src/main/shared/events/index.js';

const requests: { [key: string]: Function } = {};
const mock: { [key: string]: any } = {};

let isInit = false;

function handleLocalStorage(key: string, value: any) {
    if (!requests[key]) {
        return;
    }

    requests[key](value);
    delete requests[key];
}

export function useLocalStorage() {
    if (!isInit) {
        isInit = true;
        if ('alt' in window) {
            alt.on(Events.view.localStorageGet, handleLocalStorage);
        }
    }

    function set(key: string, value: any) {
        if (!('alt' in window)) {
            mock[key] = value;
            return;
        }

        alt.emit(Events.view.localStorageSet, key, value);
    }

    async function get<T = any>(key: string): Promise<T | undefined> {
        if (!('alt' in window)) {
            return mock[key];
        }

        const result = await new Promise((resolve: Function) => {
            const callback = (result: any) => {
                return resolve(result);
            };

            requests[key] = callback;
            alt.emit(Events.view.localStorageGet, key);
        });

        return result as T;
    }

    function remove(key: string) {
        if (!('alt' in window)) {
            delete mock[key];
            return;
        }

        alt.emit(Events.view.localStorageDelete, key);
    }

    return {
        get,
        remove,
        set,
    };
}
