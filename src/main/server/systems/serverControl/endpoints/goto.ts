import * as alt from 'alt-server';
import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';

export async function goto(req: IncomingMessage, res: ServerResponse, data: { altvid: string; pos: alt.IVector3 }) {
    if (!data.pos || !data.altvid) {
        return sendServerControlResponse(res, 400, { message: `Invalid pos, or altvid provided` });
    }

    const pos = new alt.Vector3(data.pos.x, data.pos.y, data.pos.z);
    if (pos === alt.Vector3.zero) {
        return sendServerControlResponse(res, 400, { message: `Invalid coordinates` });
    }

    try {
        const player = alt.Player.all.find((x) => x.id === parseInt(data.altvid));
        player.pos = pos;
        return sendServerControlResponse(res, 200, { message: 'Successfully teleported' });
    } catch (err) {
        return sendServerControlResponse(res, 200, { message: 'Failed to teleport' });
    }
}
