import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';
import { Account } from '@Shared/types/account.js';
import { useRebar } from '../../../index.js';

const Rebar = useRebar();
const db = Rebar.database.useDatabase();
export async function account(req: IncomingMessage, res: ServerResponse, data: { _id: string }) {
    const account = await db.get<Account>({ _id: data._id }, Rebar.database.CollectionNames.Accounts);
    if (!account) {
        return sendServerControlResponse(res, 400, { message: `Account with specified _id does not exist` });
    }

    return sendServerControlResponse(res, 200, account);
}
