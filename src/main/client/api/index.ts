import * as alt from 'alt-client';

declare global {
    export interface ClientPlugin {}
}

const registeredApis: { [key: string]: Object } = {};

export function useClientApi() {
    function register(apiName: keyof ClientPlugin, api: { [key: string]: any }) {
        registeredApis[apiName] = api;
    }

    function isReady<K extends keyof ClientPlugin>(apiName: K) {
        return registeredApis[apiName] ? true : false;
    }

    function get<K extends keyof ClientPlugin>(apiName: K): ClientPlugin[K] {
        return registeredApis[apiName] as ClientPlugin[K];
    }

    async function getAsync<K extends keyof ClientPlugin>(apiName: K, timeout = 30000): Promise<ClientPlugin[K]> {
        await alt.Utils.waitFor(() => isReady(apiName), timeout).catch((err) => {
            console.warn(`Failed to load API for ${apiName}`);
        });

        return get(apiName);
    }

    return {
        get,
        getAsync,
        isReady,
        register,
    };
}
