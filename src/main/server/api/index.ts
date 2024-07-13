import * as alt from 'alt-server';

declare global {
    export interface ServerPlugin {}
}

const registeredApis: { [key: string]: Object } = {};

export function useApi() {
    function register(apiName: keyof ServerPlugin, api: { [key: string]: any }) {
        registeredApis[apiName] = api;
    }

    function isReady<K extends keyof ServerPlugin>(apiName: K) {
        return registeredApis[apiName] ? true : false;
    }

    function get<K extends keyof ServerPlugin>(apiName: K): ServerPlugin[K] {
        if (!registeredApis[apiName]) {
            alt.logWarning(`The API, ${apiName} is undefined. Use 'getAsync' for obtaining the API instead.`);
            alt.logWarning(`Example: const result = await api.getAsync('${apiName}');`);
            alt.logWarning(`This could also be a missing plugin, make sure the plugin for ${apiName} is installed`);
        }

        return registeredApis[apiName] as ServerPlugin[K];
    }

    async function getAsync<K extends keyof ServerPlugin>(apiName: K, timeout = 30000): Promise<ServerPlugin[K]> {
        await alt.Utils.waitFor(() => isReady(apiName), timeout).catch((err) => {
            console.warn(`Failed to load API for ${apiName}`);
        });

        return get(apiName);
    }
    
    async function list() {
        return registeredApis;
    }
    
    return {
        get,
        getAsync,
        isReady,
        register,
        list,
    };
}
