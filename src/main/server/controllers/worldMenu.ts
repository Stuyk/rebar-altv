import * as alt from 'alt-server';
import { WorldMenu } from '../../shared/types/worldMenu.js';
import { Events } from '../../shared/events/index.js';

export function useWorldMenu(menu: WorldMenu) {
    async function show(player: alt.Player): Promise<{ event: string; args: any[] } | undefined> {
        return await player.emitRpc(Events.menus.worldmenu.show, menu);
    }

    return {
        show,
    };
}
