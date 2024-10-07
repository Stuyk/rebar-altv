import * as alt from 'alt-client';
import { Events } from '@Shared/events/index.js';

let chatIsFocused = false;

export function useMessenger() {
    function focusChat() {
        chatIsFocused = true;
    }

    function unfocusChat() {
        chatIsFocused = false;
    }

    function isChatFocused() {
        return chatIsFocused;
    }

    function send(message: string) {
        alt.emitServer(Events.systems.messenger.process, message);
    }

    return {
        focusChat,
        isChatFocused,
        unfocusChat,
        send
    };
}
