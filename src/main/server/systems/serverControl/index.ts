import * as alt from 'alt-server';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse, URLSearchParams } from 'url';
import * as Endpoints from './endpoints/index.js';
import { useConfig } from '../../config/index.js';
import { PanelPermission } from '@Shared/types/panelAccount.js';
import { useJwt } from './jwt.js';

const config = useConfig();
const jwt = useJwt();
const unprotectedEndpoints: Array<PanelPermission> = ['login', 'register', 'health', 'firstinstall'];

type PathCallback = (req: IncomingMessage, res: ServerResponse, data: Object) => void;

export const Responses: { [K in PanelPermission]?: PathCallback } = {
    // 'addaccperm': Endpoints.addAccPerm,
    // 'addcharperm': Endpoints.addCharPerm,
    account: Endpoints.account,
    accounts: Endpoints.accounts,
    character: Endpoints.character,
    characters: Endpoints.characters,
    firstinstall: Endpoints.firstinstall,
    freeze: Endpoints.freeze,
    goto: Endpoints.goto,
    health: Endpoints.health,
    kick: Endpoints.kick,
    login: Endpoints.login,
    register: Endpoints.register,
    tpto: Endpoints.tpto,
    unfreeze: Endpoints.unfreeze,
    verify: Endpoints.verify,
};

export function useServerControl() {
    function register(path: string, callback: PathCallback) {
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

async function handleRequest(req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    const { url, method, socket } = req;
    if (socket.remoteAddress !== '::1' && !socket.remoteAddress.includes('127.0.0.1')) {
        sendServerControlResponse(res, 403, { error: 'Access forbidden: only localhost requests are allowed' });
        return;
    }

    const parsedUrl = parse(url, true);
    const pathWithoutSlash = parsedUrl.pathname.replace('/', '') as PanelPermission;
    if (!Responses[pathWithoutSlash]) {
        sendServerControlResponse(res, 404, { error: 'Pathway does not exist' });
        return;
    }

    let skipAuth = false;
    for (let endpoint of unprotectedEndpoints) {
        if (pathWithoutSlash != endpoint) {
            continue;
        }

        skipAuth = true;
        break;
    }

    if (!skipAuth) {
        const hasPerm = await jwt.hasPermission(req, pathWithoutSlash);
        if (!hasPerm) {
            return sendServerControlResponse(res, 401, {
                message: `Unauthorized`,
            });
        }
    }

    let body = '';
    if (method === 'POST') {
        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        const data: Object = await new Promise((resolve) => {
            req.on('end', () => {
                try {
                    return resolve(JSON.parse(body));
                } catch (err) {
                    return resolve(undefined);
                }
            });
        });

        Responses[pathWithoutSlash](req, res, data);
        return;
    }

    const query = Object.fromEntries(new URLSearchParams(parsedUrl.query));
    Responses[pathWithoutSlash](req, res, query);
}

createServer(handleRequest).listen(config.getField('serverControlPort'), () => {
    alt.log(`Server Control Started on ${config.getField('serverControlPort')}, only accessible via localhost`);
});
