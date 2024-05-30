import * as alt from 'alt-server';
import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';

// http://localhost:3000/tpto?altvid=1&target=5
export async function tpto(req: IncomingMessage, res: ServerResponse, data: { altvid: string; target: string }) {
    if (!data.altvid || !data.target) {
        return sendServerControlResponse(res, 400, { message: `altvid, or target not provided` });
    }

    const player = alt.Player.all.find((x) => String(x.id) == data.altvid);
    if (!player) {
        return sendServerControlResponse(res, 400, { message: `Player was not found` });
    }

    const target = alt.Player.all.find((x) => String(x.id) == data.target);
    if (!target) {
        return sendServerControlResponse(res, 400, { message: `Target player was not found` });
    }

    player.pos = target.pos;
    return sendServerControlResponse(res, 200, { message: `Teleported successfully` });
}
