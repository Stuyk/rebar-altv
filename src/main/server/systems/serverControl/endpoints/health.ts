import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';

export function health(req: IncomingMessage, res: ServerResponse) {
    sendServerControlResponse(res, 200, { message: 'ok' });
}
