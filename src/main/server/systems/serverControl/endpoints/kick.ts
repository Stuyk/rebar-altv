import * as alt from 'alt-server';
import { ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';

// http://localhost:3000/kick?altvid=1&reason=being big dumb
export async function kick(res: ServerResponse, data: { altvid: string; reason: string }) {
    if (!data.reason || !data.altvid) {
        return sendServerControlResponse(res, 400, { message: `Did not provide reason or valid altvid` });
    }

    try {
        const player = alt.Player.all.find((x) => x.id === parseInt(data.altvid));
        player.kick(data.reason);
        return sendServerControlResponse(res, 200, { message: 'Successfully kicked' });
    } catch (err) {
        return sendServerControlResponse(res, 200, { message: 'Failed to kick' });
    }
}
