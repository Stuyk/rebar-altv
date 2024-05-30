import { IncomingMessage, ServerResponse } from 'http';
import { sendServerControlResponse } from '../index.js';
import { PanelAccount } from '@Shared/types/panelAccount.js';
import { useRebar } from '../../../index.js';

const Rebar = useRebar();
const db = Rebar.database.useDatabase();

export async function firstinstall(req: IncomingMessage, res: ServerResponse) {
    const accounts = await db.getAll<PanelAccount>(Rebar.database.CollectionNames.PanelAccounts);
    return sendServerControlResponse(res, 200, { result: accounts.length <= 0 });
}
