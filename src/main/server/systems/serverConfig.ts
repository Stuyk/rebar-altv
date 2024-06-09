import * as alt from 'alt-server';
import { Events } from '../../shared/events/index.js';
import { ServerConfig } from '../../shared/types/serverConfig.js';

const config: ServerConfig = {};

function updatePlayers() {
    for (let player of alt.Player.all) {
        player.emit(Events.systems.serverConfig.set, config);
    }
}

export function useServerConfig() {
    function set<K extends keyof ServerConfig>(key: K, value: ServerConfig[K]) {
        config[key] = value;
        updatePlayers();
    }

    return {
        set,
    };
}

alt.on('playerConnect', (player) => player.emit(Events.systems.serverConfig.set, config));
