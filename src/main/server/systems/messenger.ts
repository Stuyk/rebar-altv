import * as alt from 'alt-server';
import { useRebar } from '../index.js';
import { Events } from '../../shared/events/index.js';
import { Message } from '../../shared/types/message.js';

export type PlayerMessageCallback = (player: alt.Player, msg: string) => void;

export type PermissionOptions = {
    permissions?: string[];
    accountPermissions?: string[];
    groups?: Record<string, string[]>;
    accountGroups?: Record<string, string[]>;
};

export type Command = {
    name: string;
    desc: string;
    options?: PermissionOptions;
    callback: (player: alt.Player, ...args: string[]) => void | boolean | Promise<void> | Promise<boolean>;
};

const tagOrComment = new RegExp(
    '<(?:' +
        // Comment body.
        '!--(?:(?:-*[^->])*--+|-?)' +
        // Special "raw text" elements whose content should be elided.
        '|script\\b' +
        '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*' +
        '>[\\s\\S]*?</script\\s*' +
        '|style\\b' +
        '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*' +
        '>[\\s\\S]*?</style\\s*' +
        // Regular name
        '|/?[a-z]' +
        '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*' +
        ')>',
    'gi',
);

const Rebar = useRebar();
const RebarEvents = Rebar.events.useEvents();

const commands: Command[] = [];
const callbacks: PlayerMessageCallback[] = [];
let endCommandRegistrationTime = Date.now();

/**
 * 
 * @param {alt.Player} player Player to check permissions for.
 * @param {PermissionOptions} options Permission options to check against.
 * @returns {boolean} True if the player has access to the functionality.
 */
function isAvailableForPlayer(player: alt.Player, options?: PermissionOptions): boolean {
    if (!player.valid) return false;
    if (!options) return true;
    if (
        !options.accountPermissions &&
        !options.permissions &&
        !options.groups &&
        !options.accountGroups
    ) {
        return true;
    }

    const rPlayer = Rebar.usePlayer(player);
    
    if (rPlayer.account.groupPermissions.hasAtLeastOneGroupWithSpecificPerm(options.accountGroups)) {
        return true;
    }

    if (rPlayer.character.groupPermissions.hasAtLeastOneGroupWithSpecificPerm(options.groups)) {
        return true;
    }
    
    if (rPlayer.account.permissions.hasAnyPermission(options.accountPermissions)) {
        return true;
    }

    if (rPlayer.character.permissions.hasAnyPermission(options.permissions)) {
        return true;
    }

    return false;
}

export function useMessenger() {
    function registerCommand(command: Command) {
        command.name = command.name.replaceAll('/', '');
        command.name = command.name.toLowerCase();

        const index = commands.findIndex((x) => x.name === command.name);
        if (index >= 1) {
            throw new Error(`${command.name} is already a registered command.`);
        }

        commands.push(command);
        endCommandRegistrationTime = Date.now() + 5000;
    }

    function onMessage(cb: PlayerMessageCallback) {
        callbacks.push(cb);
    }

    function hasCommandPermission(player: alt.Player, command: Command) {
        return isAvailableForPlayer(player, command.options);
    }

    async function invokeCommand(player: alt.Player, cmdName: string, ...args: any[]): Promise<boolean> {
        cmdName = cmdName.replace('/', '');
        cmdName = cmdName.toLowerCase();

        const index = commands.findIndex((x) => x.name === cmdName);
        if (index <= -1) {
            return false;
        }

        const command = commands[index];
        if (command.options && !hasCommandPermission(player, command)) {
            return false;
        }

        try {
            await command.callback(player, ...args);
            RebarEvents.invoke('on-command', player, cmdName);
            return true;
        } catch (err) {
            return false;
        }
    }

    function sendMessage(player: alt.Player, message: Message) {
        const webview = Rebar.player.useWebview(player);
        webview.emit(Events.systems.messenger.send, message);
    }

    function broadcastMessage(message: Message, options?: PermissionOptions) {
        for (const player of alt.Player.all) {
            if (isAvailableForPlayer(player, options)) {
                sendMessage(player, message);
            }
        }
    }

    /**
     * Get all commands a player has access to, including permissioned commands.
     *
     * @param {alt.Player} player
     */
    async function getCommands(player: alt.Player) {
        await alt.Utils.waitFor(() => Date.now() > endCommandRegistrationTime, 5000);

        const availableCommands: Omit<Command, 'callback' | 'options'>[] = [];
        for (let command of commands) {
            if (!command.options) {
                availableCommands.push({ desc: command.desc, name: command.name });
                continue;
            }

            if (command.options && !hasCommandPermission(player, command)) {
                continue;
            }

            availableCommands.push({ desc: command.desc, name: command.name });
        }

        return availableCommands;
    }

    return {
        commands: {
            invoke: invokeCommand,
            register: registerCommand,
            getCommands: getCommands,
            hasCommandPermission,
        },
        message: {
            on: onMessage,
            send: sendMessage,
            broadcast: broadcastMessage,
        },
    };
}

/**
 * Removes HTML brackets, and other escaped garbage.
 *
 * @param {string} msg
 * @return {string}
 */
function cleanMessage(msg: string): string {
    return msg
        .replace(tagOrComment, '')
        .replace('/</g', '&lt;')
        .replace('/', '')
        .replace(/<\/?[^>]+(>|$)/gm, '');
}

/**
 * Process a command sent up from the client
 *
 * @param {alt.Player} player
 * @param {string} msg
 * @return
 */
function processMessage(player: alt.Player, msg: string) {
    if (!player.valid) {
        return;
    }

    if (!Rebar.player.useStatus(player).hasCharacter()) {
        return;
    }

    const messageSystem = useMessenger();
    if (msg.charAt(0) !== '/') {
        msg = cleanMessage(msg);
        for (let cb of callbacks) {
            cb(player, msg);
        }

        Rebar.events.useEvents().invoke('message', player, msg);
        return;
    }

    const args = msg.split(' ');
    const commandName = args.shift();
    messageSystem.commands.invoke(player, commandName, ...args);
}

alt.onClient(Events.systems.messenger.process, processMessage);
