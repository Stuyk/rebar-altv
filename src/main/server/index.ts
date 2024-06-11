import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';
import './startup.js';

import { useApi } from './api/index.js';

import { useConfig } from './config/index.js';

import { useBlipGlobal, useBlipLocal } from './controllers/blip.js';
import { useInteraction } from './controllers/interaction.js';
import { useMarkerGlobal, useMarkerLocal } from './controllers/markers.js';
import { useObjectGlobal, useObjectLocal } from './controllers/object.js';
import { usePickupGlobal } from './controllers/pickups.js';
import { useTextLabelGlobal, useTextLabelLocal } from './controllers/textlabel.js';

import { useDatabase } from './database/index.js';

import {
    useAccount,
    useAccountBinder,
    useAccountEvents,
    useCharacter,
    useCharacterBinder,
    useGlobal,
    useVehicleBinder,
    useVehicle as useVehicleDocument,
    useVehicleEvents,
    useVirtual,
} from './document/index.js';
import { CollectionNames } from './document/shared.js';

import { useEvents } from './events/index.js';

import { usePlayerGetter } from './getters/player.js';
import { usePlayersGetter } from './getters/players.js';
import { useVehicleGetter } from './getters/vehicle.js';
import { useVehiclesGetter } from './getters/vehicles.js';
import { useWorldGetter } from './getters/world.js';

import { useAnimation } from './player/animation.js';
import { usePlayerAppearance } from './player/appearance.js';
import { useAudio } from './player/audio.js';
import { useClothing } from './player/clothing.js';
import { useNative } from './player/native.js';
import { useNotify } from './player/notify.js';
import { useStatus } from './player/status.js';
import { useWeapon } from './player/weapon.js';
import { useWebview } from './player/webview.js';
import { useWorld } from './player/world.js';

import { useMessenger } from './systems/messenger.js';
import { usePermission } from './systems/permission.js';
import { usePermissionGroup } from './systems/permissionGroup.js';

import { usePlayer } from './player/index.js';
import { useState } from './player/state.js';
import { useWaypoint } from './player/waypoint.js';
import { sha256, sha256Random } from './utility/hash.js';
import { check, hash } from './utility/password.js';
import { useVehicle } from './vehicle/index.js';
import { useProtectCallback } from './utility/protectCallback.js';
import { useServerTime } from './systems/serverTime.js';
import { useServerWeather } from './systems/serverWeather.js';
import { useProxyFetch } from './systems/proxyFetch.js';
import { usePed } from './controllers/ped.js';
import { useServerConfig } from './systems/serverConfig.js';
import { useRateLimitCallback } from './utility/rateLimitCallback.js';
import { useKeybinder } from './systems/serverKeybinds.js';

export function useRebar() {
    return {
        useApi,
        useConfig,
        controllers: {
            useBlipGlobal,
            useBlipLocal,
            useInteraction,
            useMarkerGlobal,
            useMarkerLocal,
            useObjectGlobal,
            useObjectLocal,
            useTextLabelGlobal,
            useTextLabelLocal,
            usePickupGlobal,
            usePed,
        },
        database: {
            useDatabase,
            CollectionNames,
        },
        document: {
            account: {
                useAccount,
                useAccountBinder,
                useAccountEvents,
            },
            character: {
                useCharacter,
                useCharacterBinder,
                useAccountEvents,
            },
            global: {
                useGlobal,
            },
            vehicle: {
                useVehicle: useVehicleDocument,
                useVehicleBinder,
                useVehicleEvents,
            },
            virtual: {
                useVirtual,
            },
        },
        events: {
            useEvents,
        },
        get: {
            usePlayerGetter,
            usePlayersGetter,
            useVehicleGetter,
            useVehiclesGetter,
            useWorldGetter,
        },
        player: {
            useAnimation,
            useStatus,
            usePlayerAppearance,
            useAudio,
            useClothing,
            useNative,
            useNotify,
            useState,
            useWaypoint,
            useWeapon,
            useWebview,
            useWorld,
        },
        messenger: {
            useMessenger,
        },
        permission: {
            usePermission,
            usePermissionGroup,
        },
        useKeybinder,
        usePlayer,
        useProxyFetch,
        useServerConfig,
        useServerTime,
        useServerWeather,
        utility: {
            sha256,
            sha256Random,
            password: {
                check,
                hash,
            },
            useProtectCallback,
            useRateLimitCallback,
            ...Utility,
        },
        vehicle: {
            useVehicle,
        },
    };
}

declare module 'alt-server' {
    // extending interface by interface merging
    export interface ICustomGlobalMeta {
        /**
         * Used for getting plugin APIs
         *
         * Only available on server-side, server folder
         *
         * @type {ReturnType<typeof useRebar>}
         * @memberof ICustomGlobalMeta
         */
        Rebar: ReturnType<typeof useRebar>;

        /**
         * Only available on server-side, server folder
         *
         * @type {ReturnType<typeof useApi>}
         * @memberof ICustomGlobalMeta
         */
        RebarAPI: ReturnType<typeof useApi>;
    }
}

alt.setMeta('Rebar', useRebar());
alt.setMeta('RebarPluginAPI', useRebar().useApi());
