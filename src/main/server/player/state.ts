import * as alt from 'alt-server';
import { BaseCharacter } from '../../shared/types/character.js';
import { useCharacter } from '../document/character.js';

export function useState(player: alt.Player) {
    /**
     * Apply state changes based on partial character document
     *
     * @param {Partial<BaseCharacter>} document
     */
    function apply(document: Partial<BaseCharacter>) {
        if (document.pos) {
            player.pos = new alt.Vector3(document.pos.x, document.pos.y, document.pos.z);
        }

        if (document.rot) {
            player.rot = new alt.Vector3(document.rot.x, document.rot.y, document.rot.z);
        }

        if (document.health) {
            player.health = document.health ?? 200;
        }

        if (document.armour) {
            player.armour = document.armour ?? 0;
        }

        if (document.dimension) {
            player.dimension = document.dimension ?? 0;
        }

        if (document.isDead) {
            player.health = 99;
        }
    }

    /**
     * Save current player position, rot, health, armor, etc.
     */
    function save() {
        const document = useCharacter(player);
        if (!document.get()) {
            return;
        }

        document.setBulk({
            pos: player.pos,
            rot: player.rot,
            health: player.health,
            armour: player.armour,
            isDead: player.isDead,
        });
    }

    /**
     * Synchronize state based on document
     *
     * @return
     */
    function sync() {
        const document = useCharacter(player);
        const data = document.get();
        if (!data) {
            return;
        }

        apply(data);
    }

    return {
        apply,
        save,
        sync,
    };
}
