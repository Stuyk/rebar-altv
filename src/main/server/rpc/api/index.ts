import * as alt from 'alt-server';
import { Hono } from 'hono';
import { type HttpBindings } from '@hono/node-server';

const app = new Hono<{ Bindings: HttpBindings }>();

// 127.0.0.1:8787/api/health
app.get('/health', (c) => {
    c.status(200);
    return c.json({ data: 'ok' });
});

export function get() {
    return app;
}
