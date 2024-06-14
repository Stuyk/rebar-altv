import * as alt from 'alt-server';
import * as Utility from './utility/index.js';
import '../translate/index.js';
import { useTranslate } from '@Shared/translate.js';
import { useConfig } from './config/index.js';
import { useDatabase } from './database/index.js';
import './systems/vscodeTransmitter.js';

const config = useConfig();
const database = useDatabase();
const { t } = useTranslate('en');
const { reconnect } = Utility.useDevReconnect();

async function handleStart() {
    // Handle server setup
    await database.init(config.get().mongodb);

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
