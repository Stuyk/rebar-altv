import * as alt from 'alt-server';
import { Hono } from 'hono';
import { type HttpBindings } from '@hono/node-server';
import { useRebar } from '../../index.js';

const app = new Hono<{ Bindings: HttpBindings }>();
const Rebar = useRebar();
const RebarEvents = Rebar.events.useEvents();

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'on-rpc-restart': () => void;
    }
}

// 127.0.0.1:8787/server/restart
app.get('/restart', (c) => {
    if (c.env.incoming.socket.remoteAddress !== '127.0.0.1') {
        c.status(403);
        return c.json({ data: 'Unauthorized' });
    }

    alt.log(`RPC - Restart Invoked`);
    for (let player of alt.Player.all) {
        player.kick();
    }

    alt.emit('on-rpc-restart');

    c.status(200);
    return c.json({ data: 'ok' });
});

// 127.0.0.1:8787/server/reload?resource=core
app.get('/reload', async (c) => {
    const { resource } = c.req.query();
    if (!resource || !alt.hasResource(resource)) {
        c.status(404);
        return c.json({ data: `Resource '${resource}' does not exist` });
    }

    alt.log(`RPC - Restarting Resource '${resource}'`);
    alt.emit('on-rpc-restart');

    await alt.Utils.wait(500);

    if (resource === 'core') {
        alt.restartResource('webview');
    }

    alt.setMeta('hotreload', true);
    alt.restartResource(resource);

    c.status(200);
    return c.json({ data: `Resource '${resource}' reloaded` });
});

// 127.0.0.1:8787/server/stop
app.get('/stop', async (c) => {
    if (c.env.incoming.socket.remoteAddress !== '127.0.0.1') {
        c.status(403);
        return c.json({ data: 'Unauthorized' });
    }

    alt.log(`RPC - Server Stop Invoked`);

    for (let player of alt.Player.all) {
        player.kick();
    }

    await alt.Utils.wait(2000);

    alt.stopServer();

    c.status(200);
    return c.json({ data: 'ok' });
});

export function get() {
    return app;
}
