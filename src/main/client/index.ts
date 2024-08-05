import * as alt from 'alt-client';
import './startup.js';
import { useClientApi } from './api/index.js';

import { useClientInteraction } from './controllers/interaction.js';

import { getInput, isInputOpen } from './menus/native/input.js';
import { useNativeMenu } from './menus/native/index.js';

import { useClonedPed } from './ped/clone.js';

import { useCamera } from './player/camera.js';
import { useControls } from './player/controls.js';

import * as math from './utility/math/index.js';
import * as text from './utility/text/index.js';

import { useWebview } from './webview/index.js';
import { getMinimap } from './utility/minimap/index.js';
import { isNativeMenuOpen } from './menus/native/page.js';
import { useMessenger } from './system/messenger.js';
import { useProxyFetch } from './system/proxyFetch.js';
import { useRaycast } from './system/raycasts.js';
import { isWorldMenuOpen, useWorldMenu } from './menus/world/index.js';
import { drawText2D, drawText3D } from './screen/textlabel.js';
import { draw, drawSimple } from './screen/marker.js';
import { useStreamSyncedGetter } from './system/streamSyncedGetter.js';

export function useRebarClient() {
    return {
        useClientApi,
        controllers: {
            interaction: {
                useClientInteraction,
            },
        },
        messenger: {
            useMessenger,
        },
        menus: {
            useNativeMenu,
            isNativeMenuOpen,
            input: {
                getInput,
                isInputOpen,
            },
            isWorldMenuOpen,
            useWorldMenu,
        },
        ped: {
            useClonedPed,
        },
        player: {
            useCamera,
            useRaycast,
            useControls,
        },
        screen: {
            text: {
                drawText2D,
                drawText3D,
            },
            marker: {
                draw,
                drawSimple,
            },
        },
        systems: {
            useStreamSyncedGetter,
            useProxyFetch,
        },
        utility: {
            math,
            text,
            getMinimap,
        },
        webview: {
            useWebview,
        },
    };
}
