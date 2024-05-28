import * as alt from 'alt-server';
import { ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';
import { Account } from '../../../../shared/types/account.js';
import { useRebar } from '../../../index.js';

const Rebar = useRebar();
const db = Rebar.database.useDatabase();

export async function addAccPerm(res: ServerResponse, data: { _id: string; permission: string }) {
    if (!data._id || !data.permission) {
        return sendServerControlResponse(res, 400, {
            message: '_id or permission was not provided as url parameters',
        });
    }

    const onlinePlayers = alt.Player.all.filter((x) => x.valid && Rebar.player.useStatus(x).hasAccount());
    const player = onlinePlayers.find((x) => Rebar.document.account.useAccount(x).getField('_id') === data._id);
    if (!player) {
        const account = await db.get<Account>({ _id: data._id }, Rebar.database.CollectionNames.Accounts);
        if (!account) {
            return sendServerControlResponse(res, 400, { message: `Account with specified _id does not exist` });
        }

        const perms = account.permissions ?? [];
        if (perms.includes(data.permission)) {
            return sendServerControlResponse(res, 400, { message: 'Permission already exists on the account' });
        }

        perms.push(data.permission);
        const result = await db.update<Account>(
            { _id: account._id, permissions: perms },
            Rebar.database.CollectionNames.Accounts,
        );

        if (!result) {
            return sendServerControlResponse(res, 400, { message: 'Failed to add permission' });
        }

        return sendServerControlResponse(res, 200, { message: `Added permission successfully` });
    }

    const account = Rebar.document.account.useAccount(player);
    const perms = account.getField<{}, string[]>('permissions') ?? [];
    if (perms.includes(data.permission)) {
        return sendServerControlResponse(res, 400, { message: 'Permission already exists on the account' });
    }

    perms.push(data.permission);
    await account.set('permissions', perms);
    return sendServerControlResponse(res, 200, { message: `Added permission successfully` });
}
