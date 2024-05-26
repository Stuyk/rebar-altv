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

    return {
        focusChat,
        isChatFocused,
        unfocusChat,
    };
}
