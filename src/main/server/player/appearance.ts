import * as alt from 'alt-server';
import { useCharacter } from '@Server/document/character.js';
import { getHairOverlay } from '@Shared/data/hairOverlay.js';
import { Appearance } from '../../shared/types/appearance.js';

export type Decorator = { overlay: string; collection: string };
export type HairStyle = { hair: number; dlc?: string | number; color1: number; color2: number; decorator: Decorator };
export type BaseStyle = { style: number; opacity: number; color: number };

export function usePlayerAppearance(player: alt.Player) {
    /**
     * Apply appearance data to the given player.
     *
     * @param {Partial<Appearance>} data
     */
    function apply(data: Partial<Appearance>) {
        if (typeof data.sex !== undefined) {
            player.model = data.sex === 0 ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
        }

        clear();

        // Set Face
        player.setHeadBlendData(
            data.faceMother ?? 0,
            data.faceFather ?? 0,
            0,
            data.skinMother ?? 0,
            data.skinFather ?? 0,
            0,
            parseFloat(data.faceMix.toString()) ?? 0.5,
            parseFloat(data.skinMix.toString()) ?? 0.5,
            0,
        );

        // Facial Features
        if (Array.isArray(data.structure)) {
            for (let i = 0; i < data.structure.length; i++) {
                const value = data.structure[i];
                player.setFaceFeature(i, value);
            }
        }

        // Hair - Tattoo
        updateTattoos();

        // Hair - Supports DLC
        if (typeof data.hairDlc === 'undefined' || data.hairDlc === 0) {
            player.setClothes(2, data.hair ?? 0, 0, 0);
        } else {
            player.setDlcClothes(data.hairDlc, 2, data.hair ?? 0, 0, 0);
        }

        player.setHairColor(data.hairColor1 ?? 0);
        player.setHairHighlightColor(data.hairColor2 ?? 0);

        // Facial Hair
        if (typeof data.facialHair !== 'undefined') {
            player.setHeadOverlay(1, data.facialHair, data.facialHairOpacity);
            player.setHeadOverlayColor(1, 1, data.facialHairColor1, data.facialHairColor1);
        }

        // Chest Hair
        if (data.chestHair !== null && data.chestHair !== undefined) {
            player.setHeadOverlay(10, data.chestHair, data.chestHairOpacity);
            player.setHeadOverlayColor(10, 1, data.chestHairColor1, data.chestHairColor1);
        }

        // Eyebrows
        if (typeof data.eyebrows !== 'undefined') {
            player.setHeadOverlay(2, data.eyebrows, data.eyebrowsOpacity);
            player.setHeadOverlayColor(2, 1, data.eyebrowsColor1, data.eyebrowsColor1);
        }

        // Decor
        if (Array.isArray(data.headOverlays)) {
            for (let i = 0; i < data.headOverlays.length; i++) {
                const overlay = data.headOverlays[i];
                const color2 = overlay.color2 ? overlay.color2 : overlay.color1;

                player.setHeadOverlay(overlay.id, overlay.value, parseFloat(overlay.opacity.toString()));
                player.setHeadOverlayColor(overlay.id, 1, overlay.color1, color2);
            }
        }

        // Eyes
        player.setEyeColor(data.eyes ?? 0);
    }

    /**
     * Set a player's hairstyle.
     *
     * Automatically saves to Database.
     *
     * @param {HairStyle} style
     * @return {void}
     */
    async function setHairStyle(style: HairStyle) {
        const document = useCharacter(player);
        const data = document.get();
        if (!data) {
            return;
        }

        if (!data.appearance) {
            data.appearance = {};
        }

        data.appearance.hair = style.hair;
        data.appearance.hairColor1 = style.color1;
        data.appearance.hairColor2 = style.color2;

        if (style.dlc) {
            data.appearance.hairDlc = typeof style.dlc === 'number' ? style.dlc : alt.hash(style.dlc);
        } else {
            player.setClothes(2, style.hair, 0, 0);
            const dlcInfo = player.getDlcClothes(2);
            data.appearance.hair = dlcInfo.drawable;
            data.appearance.hairDlc = dlcInfo.dlc;
        }

        data.appearance.hairOverlay = style.decorator;

        await document.set('appearance', data.appearance);
    }

    /**
     * Apply facial hair style to a player.
     *
     * Automatically saves to database.
     *
     *
     * @param {FacialHair} style
     * @return {void}
     */
    async function setFacialHair(choice: BaseStyle) {
        const document = useCharacter(player);
        const data = document.get();
        if (!data) {
            return;
        }

        if (!data.appearance) {
            data.appearance = {};
        }

        data.appearance.facialHair = choice.style;
        data.appearance.facialHairColor1 = choice.color;
        data.appearance.facialHairOpacity = choice.opacity;

        await document.set('appearance', data.appearance);
    }

    /**
     * Update eyebrow style for a player.
     *
     * Automatically saves to the database.
     *
     *
     * @param {BaseStyle} choice
     * @return {void}
     */
    async function setEyebrows(choice: BaseStyle) {
        const document = useCharacter(player);
        const data = document.get();
        if (!data) {
            return;
        }

        if (!data.appearance) {
            data.appearance = {};
        }

        data.appearance.eyebrows = choice.style;
        data.appearance.eyebrowsColor1 = choice.color;
        data.appearance.eyebrowsOpacity = choice.opacity;

        await document.set('appearance', data.appearance);
    }

    /**
     * Change the base model of the player to either a masculine base, or feminine base.
     *
     * Automatically saves to database.
     *
     *
     * @param {boolean} isFeminine
     * @return {void}
     */
    async function setModel(isFeminine: boolean) {
        const document = useCharacter(player);
        const data = document.get();
        if (!data) {
            return;
        }

        if (!data.appearance) {
            data.appearance = {};
        }

        data.appearance.sex = isFeminine ? 0 : 1;
        await document.set('appearance', data.appearance);
    }

    /**
     * Set an eye color on a player.
     *
     * Automatically saves to database.
     *
     * @param {number} color
     * @return {void}
     */
    async function setEyeColor(color: number) {
        const document = useCharacter(player);
        const data = document.get();
        if (!data) {
            return;
        }

        if (!data.appearance) {
            data.appearance = {};
        }

        data.appearance.eyes = color;
        await document.set('appearance', data.appearance);
    }

    /**
     * Change the player's face
     *
     * @export
     * @param {{
     *         faceFather: number;
     *         faceMother: number;
     *         skinFather: number;
     *         skinMother: number;
     *         faceMix: number;
     *         skinMix: number;
     *     }} faceData
     * @return {*}
     */
    async function setHeadBlendData(faceData: {
        faceFather: number;
        faceMother: number;
        skinFather: number;
        skinMother: number;
        faceMix: number;
        skinMix: number;
    }) {
        const document = useCharacter(player);
        const data = document.get();
        if (!data) {
            return;
        }

        if (!data.appearance) {
            data.appearance = {};
        }
        data.appearance = { ...data.appearance, ...faceData };
        await document.set('appearance', data.appearance);
    }

    /**
     * Set tattoos
     *
     * @param {Decorator[]} tattoos
     * @return
     */
    async function setTattoos(tattoos: Decorator[]) {
        const document = useCharacter(player);
        const data = document.get();
        if (!data || !data.appearance) {
            return;
        }

        data.appearance = { ...data.appearance, tattoos };
        await document.set('appearance', data.appearance);
    }

    function clear() {
        player.clearBloodDamage();
        player.clearDecorations();
        player.removeHeadBlendData();
        player.removeHeadBlendPaletteColor();

        for (let i = 0; i < 13; i++) {
            player.removeHeadOverlay(i);
        }

        for (let i = 0; i < 20; i++) {
            player.removeFaceFeature(i);
        }
    }

    /**
     * Updates facial and model appearance for the player, does not apply clothes.
     *
     * @return
     */
    function sync() {
        const document = useCharacter(player);
        const dataDocument = document.get();
        if (!dataDocument || !dataDocument.appearance) {
            return;
        }

        apply(dataDocument.appearance);
    }

    /**
     * Used to update tattoos, and a hair overlay if present.
     * Add the 'decorators' paramater to override player appearance.
     *
     * @param {Array<{ overlay: string; collection: string }>} [decorators=undefined]
     */
    function updateTattoos() {
        const document = useCharacter(player);
        const data = document.get();
        if (!data || !data.appearance) {
            return;
        }

        let decors: Array<Decorator> = [];
        if (data.appearance.hairOverlay) {
            decors.push(data.appearance.hairOverlay);
        }

        if (data.appearance.tattoos) {
            decors = decors.concat(data.appearance.tattoos);
        }

        player.clearDecorations();

        for (let decor of decors) {
            player.addDecoration(decor.collection, decor.overlay);
        }
    }

    /**
     * @deprecated use sync
     *
     */
    function update() {
        sync();
    }

    return {
        apply,
        clear,
        getHairOverlay,
        setEyeColor,
        setEyebrows,
        setFacialHair,
        setHairStyle,
        setHeadBlendData,
        setModel,
        setTattoos,
        sync,
        update,
        updateTattoos,
    };
}
