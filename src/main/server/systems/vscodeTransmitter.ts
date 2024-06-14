import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import http from 'http';
import { Events } from '../../shared/events/index.js';

const Rebar = useRebar();
const PORT = 9269;
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

if (alt.debug) {
    const server = http.createServer((req, res) => {
        if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Must be a POST request \n');
            return;
        }

        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            if (req.url === '/server') {
                await new AsyncFunction('alt', 'console', 'Rebar', body)(
                    { ...alt },
                    {
                        ...console,
                    },
                    { ...Rebar },
                );
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Code Executed on Server \n');
                return;
            }

            if (alt.Player.all.length <= 0) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('No players on server to execute code against \n');
                return;
            }

            for (let player of alt.Player.all) {
                if (!player || !player.valid) {
                    return;
                }

                player.emit(Events.systems.transmitter.execute, body);
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Code Executed on Client \n');
            return;
        });
    });

    server.listen(PORT);
}
