import * as alt from 'alt-server';
import { useRebar } from '@Server/index.js';
import { Doors } from './doors.js';
const Rebar = useRebar();

const doorController = Rebar.controllers.useDoor();
Doors.forEach((door) => {
    doorController.register(door);
});

const spawnPosition = new alt.Vector3({
    x: 231.5570526123047,
    y: 213.99053955078125,
    z: 106.08091735839844,
});

Rebar.useKeybinder().on(76, async (player: alt.Player) => {
    const door = await doorController.getNearestDoor(player);
    if (!door) return;
    doorController.toggleLockState(player, door.uid);
});

alt.on('playerConnect', async (player) => {
    new alt.Vehicle('adder', spawnPosition.x, spawnPosition.y, spawnPosition.z, 0, 0, 0);
    await alt.Utils.wait(1000);
    player.model = 'mp_m_freemode_01';
    player.spawn(spawnPosition);
    Rebar.useKeybinder().updateKeybindForPlayer(player);
});
