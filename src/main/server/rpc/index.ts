import * as alt from 'alt-server';
import { Hono } from 'hono';
import { serve, ServerType, type HttpBindings } from '@hono/node-server';
import * as Server from './server/index.js';
import * as Api from './api/index.js';
import * as Admin from './admin/index.js';
import * as Transmitter from './transmitter/index.js';

const app = new Hono<{ Bindings: HttpBindings }>();
let server: ServerType;

app.get('/', (c) => {
    c.status(200);
    return c.json({ data: c.env.incoming.socket.remoteAddress });
});

app.route('/api', Api.get());
app.route('/server', Server.get());
app.route('/admin', Admin.get());
if (alt.debug) {
    app.route('/transmitter', Transmitter.get());
}

server = serve({ fetch: app.fetch, port: 8787 });

alt.on('on-rpc-restart', () => {
    if (!server) {
        return;
    }

    alt.log('RPC - Stopping RPC Server');
    server.close();
});
