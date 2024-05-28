import * as alt from 'alt-server';
import { ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';
import { useRebar } from '../../../index.js';

const Rebar = useRebar();

// http://localhost:3000/teleport?altvid=1&pos=-777,-106,38
export async function teleport(res: ServerResponse, data: { altvid: string; pos: string }) {
    if (!data.pos || !data.altvid) {
        return sendServerControlResponse(res, 400, { message: `Invalid pos, or altvid provided` });
    }

    const [x, y, z] = data.pos.split(',');
    const pos = new alt.Vector3(parseFloat(x) ?? 0, parseFloat(y) ?? 0, parseFloat(z) ?? 0);
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
