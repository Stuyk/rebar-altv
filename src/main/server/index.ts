import './startup.js';
import { useApi } from './api/index.js';
import { useConfig } from './config/index.js';
import { useBlipGlobal } from './controllers/blip.js';
import { useBlipLocal } from './controllers/blip.js';
import { useInteraction } from './controllers/interaction.js';
import { useMarkerGlobal, useMarkerLocal } from './controllers/markers.js';
import { useObjectGlobal, useObjectLocal } from './controllers/object.js';
import { useTextLabelGlobal, useTextLabelLocal } from './controllers/textlabel.js';
import { useDatabase } from './database/index.js';
import { CollectionNames } from './document/shared.js';
import {
    useAccount,
    useAccountBinder,
    useAccountEvents,
    useCharacter,
    useCharacterBinder,
    useGlobal,
    useVehicle,
    useVehicleBinder,
    useVehicleEvents,
} from './document/index.js';
import { usePlayerGetter } from './getters/player.js';
import { usePlayersGetter } from './getters/players.js';
import { useVehiclesGetter } from './getters/vehicles.js';
import { useVehicleGetter } from './getters/vehicle.js';
import { useWorldGetter } from './getters/world.js';
import { useAnimation } from './player/animation.js';
import { usePlayerAppearance } from './player/appearance.js';
import { useAudio } from './player/audio.js';
import { useClothing } from './player/clothing.js';
import { useNative } from './player/native.js';
import { useNotify } from './player/notify.js';
import { useWebview } from './player/webview.js';
import { useWorld } from './player/world.js';
import { usePermission } from './systems/permission.js';
import { usePermissionGroup } from './systems/permissionGroup.js';
import { sha256, sha256Random } from './utility/hash.js';
import { check, hash } from './utility/password.js';
import { rpcOnClient, rpcEmitClient, rpcEmitView, rpcOnView } from './events/rpc.js';

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
                useVehicle,
                useVehicleBinder,
                useVehicleEvents,
            },
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
            usePlayerAppearance,
            useAudio,
            useClothing,
            useNative,
            useNotify,
            useWebview,
            useWorld,
        },
        permission: {
            usePermission,
            usePermissionGroup,
        },
        rpc: {
            rpcOnClient,
            rpcEmitClient,
            rpcEmitView,
            rpcOnView,
        },
        utility: {
            sha256,
            sha256Random,
            password: {
                check,
                hash,
            },
        },
    };
}
