import * as alt from 'alt-client';
import * as native from 'natives';
import { useWebview } from '../../webview/index.js';
import { Events } from '@Shared/events/index.js';

const { emit, onWebviewReady } = useWebview();

export function getMinimap() {
    const aspectRatio = native.getAspectRatio(false);
    const { x: w, y: h } = alt.getScreenResolution();
    let width = w / (4 * aspectRatio);
    let height = h / 5.674;
    native.setScriptGfxAlign(76, 66);
    let [, x, y] = native.getScriptGfxAlignPosition(-0.0045, 0.002 + -0.188888);
    x = x * w + h * 0.0074;
    y += y * h + h * 0.0095;
    native.resetScriptGfxAlign();
    const safeZone = native.getSafeZoneSize();

    // if needed uncomment this for big map
    // width = (width / w) * 1.587 * w;
    // y -= height * 1.34;
    // height = (height / h) * 2.34 * h;

    return {
        x,
        y,
        top: y,
        left: x,
        bottom: y + height,
        right: x + width,
        width,
        height,
        aspectRatio,
        safeZone,
        screenWidth: w,
        screenHeight: h,
    };
}

function updateMinimap() {
    emit(Events.view.updateMinimap, getMinimap());
}

alt.on('windowResolutionChange', updateMinimap);
onWebviewReady(updateMinimap);
