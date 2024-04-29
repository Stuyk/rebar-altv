import * as alt from 'alt-client';
import * as native from 'natives';

/**
 * Used as a utility for string length.
 * @param {string} text
 * @return {void}
 *
 */
export function addLongString(text: string): void {
    if (!text.length) {
        return;
    }

    const maxStringLength = 99;

    for (let i = 0, position; i < text.length; i += maxStringLength) {
        let currentText = text.substring(i, i + maxStringLength);
        let currentIndex = i;
        if ((currentText.match(/~/g) || []).length % 2 !== 0) {
            position = currentText.lastIndexOf('~');
            i -= maxStringLength - position;
        } else {
            position = Math.min(maxStringLength, text.length - currentIndex);
        }

        native.addTextComponentSubstringPlayerName(text.substring(currentIndex, position));
    }
}

/**
 * Get the float width of text. (0.1 - 1)
 * @param {string} text
 * @param {number} font
 * @param {number} scale
 * @return {number}
 *
 */
export function getStringWidth(text: string, font: number, scale: number): number {
    native.beginTextCommandGetScreenWidthOfDisplayText('CELL_EMAIL_BCON');
    addLongString(text);
    native.setTextFont(font);
    native.setTextScale(1, scale);
    return native.endTextCommandGetScreenWidthOfDisplayText(true);
}

export function drawTextAbsolute(
    text: string,
    anchor: alt.Vector2,
    width: number,
    scale: number,
    absY: number,
    alignment: 'center' | 'left' | 'right'
) {
    const subHeight = native.getRenderedCharacterHeight(scale, 4) / 1.5;
    let position = new alt.Vector2(anchor.x - width / 2, anchor.y + absY).sub(0, subHeight);

    if (alignment === 'left') {
        position = position.add(getStringWidth(text, 4, scale) / 2, 0);
        position = position.add(0.01, 0);
    }

    if (alignment === 'center') {
        position = position.add(width / 2, 0);
    }

    if (alignment === 'right') {
        position = position.add(width - getStringWidth(text, 4, scale) / 2, 0);
        position = position.sub(0.01, 0);
    }

    native.clearDrawOrigin();
    native.beginTextCommandDisplayText('STRING');
    native.addTextComponentSubstringPlayerName(text);
    native.setTextFont(4);
    native.setTextScale(1, scale);
    native.setTextColour(255, 255, 255, 255);
    native.setTextJustification(0); // Always Center
    native.endTextCommandDisplayText(position.x, position.y, 0);
}
