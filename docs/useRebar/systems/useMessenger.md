# useMessenger

The messenger system allows for developers to easily send up messages from players and process them as `commands` or `messages` for other players to read.

However, the messages are not automatically sent to other players. You as a developer get to decide who sees what messages or if they see text messages at all.

Commands have permission system built-in, so you can easily allow players to use certain commands based on their permissions.
For more details on how to use permissions, check [useEntityPermissions](/userebar/systems/permissions/useEntityPermissions.md).

## Usage

```ts
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const messenger = Rebar.messenger.useMessenger();

// Simple command, no arguments, no restrictions
messenger.commands.register({
    name: '/id',
    desc: 'Print your current identifier',
    callback: (player: alt.Player) => {
        messenger.message.send(player, { type: 'info', content: `ID: ${player.id}` });
    },
});

// Gated command, requires permissions
// Below checks if a 'account' has the 'moderator' permission before executing the command
messenger.commands.register({
    name: '/goto',
    desc: '/goto [x][y][z]',
    options: { permissions: ['moderator'] },
    callback: (player: alt.Player, x: string, y: string, z: string) => {
        try {
            const pos = new alt.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
            player.pos = pos;
        } catch (err) {
            messenger.message.send(player, { type: 'warning', content: 'X,Y,Z coords were not valid.' });
        }
    },
});

messenger.message.on((player: alt.Player, msg: string) => {
    // You shouldn't use `player.name` in production.
    console.log(`${player.name} says: ${msg}`);

    // Let's forward the message to all players!
    for (let player of alt.Player.all) {
        messenger.message.send(player, { type: 'player', content: msg, author: player.name });
    }
});

// Get a list of all commands the player has permission for
const commands = await messenger.commands.getCommands(player);
```
