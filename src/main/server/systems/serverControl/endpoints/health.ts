import { ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';

// http://localhost:3000/health
export function health(res: ServerResponse) {
    sendServerControlResponse(res, 200, { message: 'ok' });
}
