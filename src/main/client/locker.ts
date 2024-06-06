import * as alt from 'alt-client';
import { Events } from '../shared/events/index.js';

function handleInjection(resourceName: string) {
    if (!alt.hasResource(resourceName)) {
        return;
    }

    if (!alt.File.exists(`@${resourceName}/client/index.js`)) {
        return;
    }

    try {
        import(`@${resourceName}/client/index.js`);
    } catch(err) {};
}

alt.onServer(Events.locker.inject, handleInjection);