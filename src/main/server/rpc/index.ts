import * as alt from 'alt-server';
import { Context, Hono } from 'hono';
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

alt.on('rebar:rpcRestart', () => {
    if (!server) {
        return;
    }

    alt.log('RPC - Stopping RPC Server');
    server.close();
});

function init() {
    if (server) return;
    server = serve({ fetch: app.fetch, port: 8787 });
}

init();

export function useHono() {
    function addRouter(path: string, router: Hono<{ Bindings: HttpBindings }>) {
        app.route(path, router);
        alt.logDebug('— Registered Router: ' + path);
    }

    const middlewares = {
        localOnly: async (c: Context, next: Function) => {
            if (c.env.incoming.socket.remoteAddress !== '127.0.0.1') {
                c.status(403);
                return c.json({ data: 'Unauthorized' });
            }
            return await next();
        },
    };

    return { addRouter, middlewares };
}
