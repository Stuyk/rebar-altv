import * as alt from 'alt-client';
import { distance2d } from '../../shared/utility/vector.js';

const Commands = {
    pos: () => {
        return alt.Player.local.pos;
    },
    floorpos: () => {
        return alt.Player.local.pos.sub(0, 0, 1);
    },
    vehpos: () => {
        return alt.Player.local.vehicle ? alt.Player.local.vehicle.pos : 'Not in a vehicle.';
    },
    rot: () => {
        return alt.Player.local.rot;
    },
    vehrot: () => {
        return alt.Player.local.vehicle ? alt.Player.local.vehicle.rot : 'Not in a vehicle.';
    },
    dimension: () => {
        return alt.Player.local.dimension;
    },
    weapons: () => {
        return alt.Player.local.weapons;
    },
    weapon: () => {
        return alt.Player.local.currentWeapon;
    },
    id: () => {
        return alt.Player.local.id;
    },
    remoteid: () => {
        return alt.Player.local.remoteID;
    },
    resources: () => {
        if (!alt.debug) {
            return 'Unavailable';
        }

        return alt.getAllResources();
    },
    ping: () => {
        return alt.getPing();
    },
    fps: () => {
        return alt.getFps();
    },
    debug: () => {
        return alt.debug;
    },
    players: () => {
        if (!alt.debug) {
            return 'Unavailable';
        }

        return alt.Player.all.map((x) => {
            const dist = distance2d(alt.Player.local.pos, x.pos);
            return { id: x.id, dimension: x.dimension, dist, pos: x.pos };
        });
    },
    objects: () => {
        if (!alt.debug) {
            return 'Unavailable';
        }

        return alt.Object.all.map((x) => {
            const dist = distance2d(alt.Player.local.pos, x.pos);
            return { id: x.id, dimension: x.dimension, dist, pos: x.pos, model: x.model };
        });
    },
    entities: () => {
        if (!alt.debug) {
            return 'Unavailable';
        }

        return JSON.stringify(
            alt.VirtualEntity.all.map((x) => {
                const dist = distance2d(alt.Player.local.pos, x.pos);
                const keys = x.getStreamSyncedMetaKeys();

                const data = {};
                for (let key of keys) {
                    data[key] = x.getStreamSyncedMeta(key);
                }

                return { id: x.id, dimension: x.dimension, dist, pos: x.pos, data };
            }),
            null,
            '\t'
        );
    },
    vehicles: () => {
        if (!alt.debug) {
            return 'Unavailable';
        }

        return alt.Vehicle.all.map((x) => {
            const dist = distance2d(alt.Player.local.pos, x.pos);
            return { id: x.id, dimension: x.dimension, dist, pos: x.pos, model: x.model };
        });
    },
};

function handleConsoleCommand(name: string, ...args: string[]) {
    name = name.toLowerCase();
    if (!Commands[name]) {
        alt.log(`That command does not exist.`);
        alt.log(`Here are the supported commands:`);
        for (let key of Object.keys(Commands)) {
            alt.log(key);
        }
        return;
    }

    const result = Commands[name](...args);
    if (!result) {
        return;
    }

    alt.log(`${name} - Command Result`);
    alt.log(result);
}

alt.on('consoleCommand', handleConsoleCommand);
