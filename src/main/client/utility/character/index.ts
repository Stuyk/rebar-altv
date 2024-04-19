import * as alt from 'alt-client';
import * as native from 'natives';

export function opacityToIndex(opacity: number) {
    if (opacity >= 1) {
        return 1.0;
    }

    return Math.floor(opacity * 10);
}

export function getOpacity(dataName: string): Array<{ text: string; value: any }> {
    const options = [];

    for (let i = 0; i < 11; i++) {
        const floatValue = i * 0.1;
        options.push({ text: `${floatValue.toFixed(1)}`, value: { [dataName]: floatValue } });
    }

    return options;
}

export function getOverlays(id: number, dataName: string) {
    const options = [];
    const eyebrowCount = native.getPedHeadOverlayNum(id);
    for (let i = 0; i < eyebrowCount; i++) {
        options.push({ text: `Style ${i}`, value: { [dataName]: i } });
    }

    return options;
}

export function getPrimaryColorList(dataName: string) {
    const colors = [];

    const hairColorCount = native.getNumPedHairTints();
    for (let i = 0; i < hairColorCount; i++) {
        const [_, r, g, b] = native.getPedHairTintColor(i);
        colors.push({ text: `${i}`, color: new alt.RGBA(r, g, b), value: { [dataName]: i } });
    }

    return colors;
}

export function getSecondaryColorList(id: number, dataName: string) {
    const colors = [];

    const tintCount = native.getNumPedMakeupTints();
    for (let i = 0; i < tintCount; i++) {
        const [_, r, g, b] = native.getPedMakeupTintColor(i);
        colors.push({ text: `${i}`, color: new alt.RGBA(r, g, b), value: { id, [dataName]: i } });
    }

    return colors;
}
