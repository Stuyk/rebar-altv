import * as alt from 'alt-server';

import { Events } from '@Shared/events/index.js';
import { InstructionalButtons } from '@Shared/types/instructionalButtons.js';


/**
 * Use Instructional Buttons for a player.
 * @param player The player to use Instructional Buttons for.
 */
export function useInstructionalButtons(player: alt.Player) {
    /**
     * Create Instructional Buttons for a player.
     * @param  buttons An array of buttons to create.
     * @return {Promise<boolean>} True if successful. False if buttons already exist.
     */
    async function create(buttons: InstructionalButtons): Promise<boolean> {
        const currentButtons = await player.emitRpc(Events.player.screen.instructionalButtons.get);
        if (currentButtons) {
            alt.logError(`Instructional Buttons already exist for this player. Prefer to destroy before creating.`);
            return false;
        };
        player.emit(Events.player.screen.instructionalButtons.create, buttons);
        return true;
    }

    /**
     * Destroy Instructional Buttons for a player.
     */
    function destroy(): void {
        player.emit(Events.player.screen.instructionalButtons.destroy);
    }

    return { create, destroy };
}
