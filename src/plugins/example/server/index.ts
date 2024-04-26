import * as alt from 'alt-server';

import '../translate/index.js';
import { useTranslate } from '../../../main/shared/translate.js';
import { useAccount, useAccountBinder } from '@Server/document/account.js';

const { t } = useTranslate('en');

alt.on('playerConnect', (player) => {
    const accBinder = useAccountBinder(player);
    accBinder.bind({ _id: 'test' });

    const account = useAccount(player);
    const data = account.get();

    account.set('banned', true);
    account.setBulk({ banned: true, reason: 'big nerd' });

    alt.log(`${player.name}, ${t('example.joined-server')}`);
});
