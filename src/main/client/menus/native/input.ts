import * as alt from 'alt-client';
import * as native from 'natives';

let document: alt.RmlDocument;
let isInputVisible = false;

export function isInputOpen() {
    return isInputVisible;
}

export function clearInput() {
    isInputVisible = false;
    document.destroy();
    document = undefined;

    alt.toggleRmlControls(false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
}

export async function getInput(previousValue: string): Promise<string> {
    isInputVisible = true;

    if (document) {
        document.destroy();
        document = undefined;
    }

    document = new alt.RmlDocument('@rmlui/input/index.rml');
    document.show();
    document.focus();

    alt.toggleRmlControls(true);
    alt.toggleGameControls(false);
    alt.showCursor(true);

    const input = document.getElementByID('input');
    input.setAttribute('value', previousValue);
    input.focus();

    return new Promise((resolve) => {
        let ignoreFirstPress = true;

        const handleKeyPress = (key: number) => {
            if (key !== 13) {
                return;
            }

            if (ignoreFirstPress) {
                ignoreFirstPress = false;
                return;
            }

            alt.off('keyup', handleKeyPress);
            const result = document.getElementByID('input').getAttribute('value');
            native.playSoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_MP_SOUNDSET', true);
            clearInput();
            return resolve(result);
        };

        alt.on('keyup', handleKeyPress);
    });
}

alt.on('disconnect', () => {
    if (document && document.valid) {
        document.destroy();
        document = undefined;
    }
})