import * as alt from 'alt-server';
import { Hono } from 'hono';
import { type HttpBindings } from '@hono/node-server';
import { useRebar } from '@Server/index.js';
import { Events } from '@Shared/events/index.js';

const Rebar = useRebar();
const app = new Hono<{ Bindings: HttpBindings }>();
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

app.post('/server', async (c) => {
    const body = await c.req.text();
    await new AsyncFunction('alt', 'console', 'Rebar', body)({ ...alt }, { ...console }, { ...Rebar });
    return c.text('Code Executed on Server');
});

app.post('/client', async (c) => {
    if (alt.Player.all.length <= 0) {
        return c.text('No players on server to execute code against');
    }
    const body = await c.req.text();
    for (const player of alt.Player.all) {
        if (!player || !player.valid) continue;
        player.emit(Events.systems.transmitter.execute, body);
    }
    return c.text('Code Executed on Client');
});

export function get() {
    return app;
}
