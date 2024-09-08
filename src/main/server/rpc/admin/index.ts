import * as alt from 'alt-server';
import { Hono } from 'hono';
import { type HttpBindings } from '@hono/node-server';

const app = new Hono<{ Bindings: HttpBindings }>();

// 127.0.0.1:8787/admin/kick?r=dumb&id=5
app.get('/kick', (c) => {
    if (c.env.incoming.socket.remoteAddress !== '127.0.0.1') {
        c.status(403);
        return c.json({ data: 'Unauthorized' });
    }

    let { r, id } = c.req.query();

    if (!id) {
        c.status(400);
        return c.json({ data: 'ID was not provided' });
    }

    if (!r) {
        r = 'No Reason Given';
    }

    const player = alt.Player.all.find((x) => x.id.toString() === id);
    if (!player) {
        c.status(400);
        return c.json({ data: `Player does not exist on the server` });
    }

    player.kick(r);
    c.status(200);
    return c.json({ data: `Kicked ${player.id} with reason '${r}'` });
});

// 127.0.0.1:8787/admin/kickall
app.get('/kickall', (c) => {
    if (c.env.incoming.socket.remoteAddress !== '127.0.0.1') {
        c.status(403);
        return c.json({ data: 'Unauthorized' });
    }

    c.status(200);
    return c.json({ data: 'ok' });
});

export function get() {
    return app;
}
