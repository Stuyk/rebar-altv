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

    return {
        get,
        isReady,
        register,
    };
}
