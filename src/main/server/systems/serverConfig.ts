import * as alt from 'alt-server';

interface ServerConfig {
    hideHealthArmour?: boolean;
    hideMinimapOnFoot?: boolean;
    hideMinimapInPage?: boolean;
    hideVehicleName?: boolean;
    hideVehicleClass?: boolean;
    hideStreetName?: boolean;
    hideAreaName?: boolean;
}

declare module 'alt-shared' {
    // extending interface by interface merging
    export interface ICustomGlobalMeta {
        ServerConfig: ServerConfig;
    }
}

export function useServerConfig() {
    function set<K extends keyof ServerConfig>(key: K, value: ServerConfig[K]) {
        const config = alt.getMeta('ServerConfig') ?? {};
        config[key] = value;
        alt.setMeta('ServerConfig', config);
    }

    return {
        set,
    };
}
