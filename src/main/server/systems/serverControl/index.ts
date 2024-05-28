import * as alt from 'alt-server';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse, URLSearchParams } from 'url';
import * as Endpoints from './endpoints/index.js';

const Responses = {
    '/account': Endpoints.account,
    '/accounts': Endpoints.accounts,
    '/addaccperm': Endpoints.addAccPerm,
    '/addcharperm': Endpoints.addCharPerm,
    '/character': Endpoints.character,
    '/characters': Endpoints.characters,
    '/health': Endpoints.health,
    '/teleport': Endpoints.teleport,
};

export function useServerControl() {
    function register(path: string, callback: (res: ServerResponse, data: Object) => void) {
        if (path.charAt(0) !== '/') {
            path = '/' + path;
        }

        Responses[path] = callback;
    }

    return {
        register,
    };
}

export function sendServerControlResponse(res: ServerResponse, statusCode: number, data: object) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function handleRequest(req: IncomingMessage, res: ServerResponse) {
    const { url, method, socket } = req;
    if (socket.remoteAddress !== '::1' && !socket.remoteAddress.includes('127.0.0.1')) {
        sendServerControlResponse(res, 403, { error: 'Access forbidden: only localhost requests are allowed' });
        return;
    }

    if (method !== 'GET') {
        sendServerControlResponse(res, 405, { error: 'Method not allowed' });
        return;
    }

    const parsedUrl = parse(url, true);
    if (!Responses[parsedUrl.pathname]) {
        sendServerControlResponse(res, 404, { error: 'Pathway does not exist' });
        return;
    }

    const query = Object.fromEntries(new URLSearchParams(parsedUrl.query));
    Responses[parsedUrl.pathname](res, query);
}

createServer(handleRequest).listen(3000, () => {
    alt.log(`Server Control Started on 3000, only accessible via localhost`);
});
