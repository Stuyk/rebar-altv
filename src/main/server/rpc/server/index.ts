import * as alt from 'alt-server';
import { Hono } from 'hono';
import { type HttpBindings } from '@hono/node-server';

const app = new Hono<{ Bindings: HttpBindings }>();

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:rpcRestart': () => void;
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

    alt.emit('rebar:rpcRestart');

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
    alt.emit('rebar:rpcRestart');

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
