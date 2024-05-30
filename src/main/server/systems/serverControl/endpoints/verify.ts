import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';

// http://localhost:3000/verify
export async function verify(req: IncomingMessage, res: ServerResponse) {
    return sendServerControlResponse(res, 200, { message: `Valid` });
}
