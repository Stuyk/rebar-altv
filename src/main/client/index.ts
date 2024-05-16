import './startup.js';
import { useClientApi } from './api/index.js';

import { useClientInteraction } from './controllers/interaction.js';

import { getInput } from './menus/native/input.js';
import { useNativeMenu } from './menus/native/index.js';

import { useClonedPed } from './ped/clone.js';

import { useCamera } from './player/camera.js';

import * as math from './utility/math/index.js';
import * as text from './utility/text/index.js';

import { useWebview } from './webview/index.js';

export function useRebarClient() {
    return {
        useClientApi,
        controllers: {
            interaction: {
                useClientInteraction,
            },
        },
        menus: {
            useNativeMenu,
            input: {
                getInput,
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
        },
        webview: {
            useWebview,
        },
    };
}
