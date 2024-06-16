import * as alt from 'alt-client';
import '../translate/index.js';

// Load all other files after translate
import './controllers/index.js';
import './menus/world/index.js';
import './player/controls.js';
import './rmlui/index.js';
import './screen/index.js';
import './system/index.js';
import './system/vscodeTransmitter.js';
import './virtualEntities/index.js';
import { useWebview } from './webview/index.js';

async function start() {
    useWebview();

    // Load Plugins
    alt.log(':: Loading Client Plugins');
    import('./plugins.js');
    alt.log(':: Loaded Client Plugins');
}

start();
