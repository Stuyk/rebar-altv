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
        return registeredApis[apiName] as ServerPlugin[K];
    }

    return {
        get,
        isReady,
        register,
    };
}
