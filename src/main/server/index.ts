import * as alt from 'alt-server';
import * as Utility from '@Shared/utility/index.js';
import './startup.js';
import './systems/pageSystem.js';

import { useApi } from './api/index.js';

import { useConfig } from './config/index.js';

import { useCronJob } from './cronjob/index.js';

import { useBlipGlobal, useBlipLocal } from './controllers/blip.js';
import { useDoor } from './controllers/doors.js';
import { useInteraction } from './controllers/interaction.js';
import { useMarkerGlobal, useMarkerLocal } from './controllers/markers.js';
import { useObjectGlobal, useObjectLocal } from './controllers/object.js';
import { usePickupGlobal } from './controllers/pickups.js';
import { useTextLabelGlobal, useTextLabelLocal } from './controllers/textlabel.js';

import { useDatabase } from './database/index.js';

import {
    useAccount,
    useAccountBinder,
    useCharacter,
    useCharacterBinder,
    useGlobal,
    useIncrementalId,
    useVehicleBinder,
    useVehicle as useVehicleDocument,
    useVirtual,
} from './document/index.js';

import { CollectionNames } from './document/shared.js';

import { useProtectCallback } from './utility/protectCallback.js';
import { useRateLimitCallback } from './utility/rateLimitCallback.js';

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
import { usePermissionGroup, useEntityPermissions, usePermissions } from './systems/permissions/index.js';

import { usePlayer } from './player/index.js';
import { useState } from './player/state.js';
import { useWaypoint } from './player/waypoint.js';
import { sha256, sha256Random } from './utility/hash.js';
import { check, hash } from './utility/password.js';
import { useVehicle } from './vehicle/index.js';
import { useVehicleHandling } from './vehicle/vehicleHandling.js';
import { useProxyFetch } from './systems/proxyFetch.js';
import { usePed } from './controllers/ped.js';
import { useServerConfig } from './systems/serverConfig.js';

import { useKeybinder } from './systems/serverKeybinds.js';
import { useProgressbarGlobal, useProgressbarLocal } from './controllers/progressbar.js';
import { useWorldMenu } from './controllers/worldMenu.js';

import * as ClothingUtility from '@Shared/data/clothing.js';
import { useScreenshot } from './systems/screenshot.js';
import { useKeypress } from './systems/serverKeypress.js';
import { useD2DTextLabel, useD2DTextLabelLocal } from './controllers/d2dTextLabel.js';
import { useStreamSyncedBinder } from './systems/streamSyncedBinder.js';
import { useRaycast } from './player/raycast.js';
import { useAttachment } from './player/attachment.js';
import { useInteractionLocal } from './controllers/interactionLocal.js';
import { useInstructionalButtons } from './controllers/instructionalButtons.js';
import { useHono } from './rpc/index.js';
import { useDeathService } from './services/death.js';
import { useCurrencyService } from './services/currency.js';
import { useItemService } from './services/items.js';
import { useNotificationService } from './services/notifications.js';
import { useTimeService } from './services/time.js';
import { useWeatherService } from './services/weather.js';
import { useServiceRegister } from './services/index.js';

export function useRebar() {
    return {
        useApi,
        useConfig,
        useHono,
        useCronJob,
        controllers: {
            useBlipGlobal,
            useBlipLocal,
            useD2DTextLabel,
            useD2DTextLabelLocal,
            useDoor,
            useInstructionalButtons,
            useInteraction,
            useInteractionLocal,
            useMarkerGlobal,
            useMarkerLocal,
            useObjectGlobal,
            useObjectLocal,
            usePed,
            usePickupGlobal,
            useProgressbarGlobal,
            useProgressbarLocal,
            useTextLabelGlobal,
            useTextLabelLocal,
            useWorldMenu,
        },
        database: {
            useDatabase,
            useIncrementalId,
            CollectionNames,
        },
        document: {
            account: {
                useAccount,
                useAccountBinder,
            },
            character: {
                useCharacter,
                useCharacterBinder,
            },
            global: {
                useGlobal,
            },
            vehicle: {
                useVehicle: useVehicleDocument,
                useVehicleBinder,
            },
            virtual: {
                useVirtual,
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
            useAudio,
            useAttachment,
            useClothing,
            useNative,
            useNotify,
            usePlayerAppearance,
            useRaycast,
            useScreenshot,
            useState,
            useStatus,
            useWaypoint,
            useWeapon,
            useWebview,
            useWorld,
        },
        messenger: {
            useMessenger,
        },
        permissions: {
            usePermissionGroup,
            useEntityPermissions,
            usePermissions,
        },
        useKeybinder,
        useKeypress,
        usePlayer,
        useProxyFetch,
        useServerConfig,
        services: {
            useCurrencyService,
            useDeathService,
            useItemService,
            useNotificationService,
            useServiceRegister,
            useTimeService,
            useWeatherService,
        },
        systems: {
            useMessenger,
            useKeybinder,
            useKeypress,
            useProxyFetch,
            useServerConfig,
            useStreamSyncedBinder,
        },
        utility: {
            clothing: { ...ClothingUtility },
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
            useVehicleHandling,
        },
    };
}
