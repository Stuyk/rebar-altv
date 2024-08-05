import * as alt from 'alt-server';
import { Events } from '@Shared/events/index.js';
import { PageNames } from '@Shared/webview/index.js';

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:playerPageClosed': (player: alt.Player, page: PageNames) => void;
        'rebar:playerPageOpened': (player: alt.Player, page: PageNames) => void;
    }
}

// Listens for when a page is opened
alt.onClient(Events.view.onPageOpen, (player: alt.Player, pageName: PageNames) =>
    alt.emit('rebar:playerPageOpened', player, pageName),
);

// Listens for when a page is closed
alt.onClient(Events.view.onPageClose, (player: alt.Player, pageName: PageNames) =>
    alt.emit('rebar:playerPageClosed', player, pageName),
);
