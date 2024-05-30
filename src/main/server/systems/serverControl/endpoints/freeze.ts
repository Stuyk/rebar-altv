import * as alt from 'alt-server';
import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';

export async function freeze(req: IncomingMessage, res: ServerResponse, data: { altvid: string }) {
    if (!data.altvid) {
        return sendServerControlResponse(res, 400, { message: `altvid not provided` });
    }

    const player = alt.Player.all.find((x) => String(x.id) == data.altvid);
    if (!player) {
        return sendServerControlResponse(res, 400, { message: `Player was not found` });
    }

    player.frozen = true;
}
