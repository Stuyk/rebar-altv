import * as alt from 'alt-server';
import * as Utility from './utility/index.js';
import '../translate/index.js';
import { useTranslate } from '@Shared/translate.js';

const { t } = useTranslate();
const { reconnect } = Utility.useDevReconnect();

async function handleStart() {
    // Handle server setup

    // Handle plugin loading
    alt.log(':: Loading Plugins');
    await import('./plugins.js');
    alt.log(':: Plugins Loaded');

    // Handle local client reconnection, should always be called last...
    if (alt.debug) {
        reconnect();
    }

    alt.log(t('system.server.started'));
}

alt.on('serverStarted', handleStart);
