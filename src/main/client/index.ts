import * as alt from 'alt-client';
import './startup.js';
import { useClientApi } from './api/index.js';

import { useClientInteraction } from './controllers/interaction.js';

import { getInput, isInputOpen } from './menus/native/input.js';
import { useNativeMenu } from './menus/native/index.js';

import { useClonedPed } from './ped/clone.js';

import { useCamera } from './player/camera.js';

import * as math from './utility/math/index.js';
import * as text from './utility/text/index.js';

import { useWebview } from './webview/index.js';
import { getMinimap } from './utility/minimap/index.js';
import { isNativeMenuOpen } from './menus/native/page.js';
import { useMessenger } from './system/messenger.js';

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
        },
        ped: {
            useClonedPed,
        },
        player: {
            useCamera,
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

declare module "alt-shared" {
    // extending interface by interface merging
    export interface ICustomGlobalMeta {
        RebarClient: ReturnType<typeof useRebarClient>
    }
}

alt.setMeta('RebarClient', useRebarClient());