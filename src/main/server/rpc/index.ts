import * as alt from 'alt-server';
import { Hono } from 'hono';
import { serve, type HttpBindings } from '@hono/node-server';

const app = new Hono<{ Bindings: HttpBindings }>();

app.get('/', (c) => {
    c.status(200);
    return c.json({ data: c.env.incoming.socket.remoteAddress });
});

app.get('/health', (c) => {
    c.status(200);
    return c.json({ data: 'ok' });
});

app.get('/restart', (c) => {
    if (c.env.incoming.socket.remoteAddress !== '127.0.0.1') {
        c.status(403);
        return c.json({ data: 'Unauthorized' });
    }

    alt.log(`Restart Invoked - Kicking all players`);

    alt.Player.all.forEach((player) => {
        player.kick('Restart Invoked - All Players Kicked');
    });

    c.status(200);
    return c.json({ data: 'ok' });
});

serve({ fetch: app.fetch, port: 8787 });
