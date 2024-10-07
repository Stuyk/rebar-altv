import * as alt from 'alt-server';
import { useCharacter } from '@Server/document/character.js';
import {Character, ClothingComponent} from '@Shared/types/index.js';
import { ClothingKey, PropKey } from '@Shared/data/clothingKeys.js';

const fModel = alt.hash('mp_f_freemode_01');
const mModel = alt.hash(`mp_m_freemode_01`);

let femaleClothes = {
    0: 1, // mask
    3: 15, // torso
    4: 14, // pants
    5: 0, // bag
    6: 35, // shoes
    7: 0, // accessories
    8: 15, // undershirt
    9: 0, // body armour
    11: 15, // top
};

// Do not customize. Use the function 'setDefaults'
let maleClothes = {
    0: 1, // mask
    3: 15, // torso
    5: 0, // pants
    4: 14, // bag
    6: 34, // shoes
    7: 0, // accessories
    8: 15, // undershirt
    9: 0, // body armour
    11: 91, // top
};

async function updateClothing(document: ReturnType<typeof useCharacter>, componentData: ClothingComponent) {
    const data = document.get();
    if (typeof data === 'undefined') {
        return false;
    }

    if (!data.clothing) {
        const newClothing: ClothingComponent[] = [componentData];
        await document.set('clothing', newClothing);
        return true;
    }

    const modifiedClothes = [...data.clothing];
    const index = modifiedClothes.findIndex((x) => x.id == componentData.id && x.isProp === componentData.isProp);
    if (index <= -1) {
        modifiedClothes.push(componentData);
        await document.set('clothing', modifiedClothes);
        return true;
    }

    modifiedClothes[index] = componentData;
    await document.set('clothing', modifiedClothes);
    return true;
}

export function useClothing(player: alt.Player) {
    function apply(data: Character) {
        const propComponents = [0, 1, 2, 6, 7];
        for (let i = 0; i < propComponents.length; i++) {
            player.clearProp(propComponents[i]);
        }

        let sex = 1;
        if (data.appearance && typeof data.appearance.sex !== 'undefined') {
            sex = data.appearance.sex;
        }

        if (data.skin === null || typeof data.skin === 'undefined') {
            const useModel = sex ? mModel : fModel;
            if (player.model !== useModel) {
                player.model = useModel;
            }
        } else {
            const customModel = typeof data.skin !== 'number' ? alt.hash(data.skin) : data.skin;
            if (player.model === customModel) {
                return;
            }

            player.model = customModel;
            return;
        }

        const dataSet = sex === 0 ? femaleClothes : maleClothes;
        Object.keys(dataSet).forEach((key) => {
            player.setDlcClothes(0, parseInt(key), parseInt(dataSet[key]), 0, 0);
        });

        // Apply Clothing
        if (Array.isArray(data.clothing)) {
            for (let i = 0; i < data.clothing.length; i++) {
                const component = data.clothing[i];

                // We look at the equipped item data sets; and find compatible clothing information in the 'data' field.
                // Check if the data property is the correct format for the item.
                if (component.isProp) {
                    player.setDlcProp(component.dlc, component.id, component.drawable, component.texture);
                } else {
                    const palette = typeof component.palette === 'number' ? component.palette : 0;
                    player.setDlcClothes(component.dlc, component.id, component.drawable, component.texture, palette);
                }
            }
        }

        // Apply Uniform if available
        if (Array.isArray(data.uniform)) {
            for (let i = 0; i < data.uniform.length; i++) {
                const component = data.uniform[i];

                // We look at the equipped item data sets; and find compatible clothing information in the 'data' field.
                // Check if the data property is the correct format for the item.
                if (component.isProp) {
                    player.setDlcProp(component.dlc, component.id, component.drawable, component.texture);
                } else {
                    const palette = typeof component.palette === 'number' ? component.palette : 0;
                    player.setDlcClothes(component.dlc, component.id, component.drawable, component.texture, palette);
                }
            }
        }
    }

    /**
     * This function sets a uniform for a player in game.
     *
     * @param player - The player parameter is an instance of the alt.Player class, which represents a
     * player in the game. It is used to identify the player for whom the uniform is being set.
     *
     * @param components - An array of ClothingComponent objects that represent the clothing items to be
     * set as the player's uniform.
     *
     * @returns a Promise that resolves to a boolean value.
     */
    async function setUniform(components: Array<ClothingComponent>): Promise<boolean> {
        const document = useCharacter(player);
        const data = document.get();
        if (typeof data === 'undefined') {
            return false;
        }

        await document.set('uniform', components);
        sync();
        return true;
    }

    /**
     * This function clears a player's uniform and triggers an event.
     *
     * @returns a Promise that resolves to void (i.e., nothing).
     */
    async function clearUniform(): Promise<void> {
        const document = useCharacter(player);
        const data = document.get();
        if (typeof data === 'undefined') {
            return;
        }

        await document.set('uniform', undefined);
        sync();
    }

    /**
     * This function sets clothing for a player in game.
     *
     * @param components - An array of ClothingComponent objects that represent the clothing items to be
     * set as the player's clothing.
     *
     * @returns a Promise that resolves to a boolean value.
     */
    async function setClothing(components: Array<ClothingComponent>): Promise<boolean> {
        const document = useCharacter(player);
        const data = document.get();
        if (typeof data === 'undefined') {
            return false;
        }

        await document.set('clothing', components);
        sync();
        return true;
    }

    /**
     * Set a clothing component on the character to a specific clothing component.
     *
     * Overrides any existing component.
     *
     * @param {keyof typeof ClothingKey} component
     * @param {number} dlc
     * @param {number} drawable
     * @param {number} texture
     * @param {number} [palette=0]
     * @return
     */
    async function setClothingComponent(
        component: keyof typeof ClothingKey,
        dlc: number,
        drawable: number,
        texture: number,
        palette = 0,
    ) {
        const id = ClothingKey[component];

        try {
            player.setDlcClothes(dlc, id, drawable, texture, palette);
        } catch (err) {
            return false;
        }

        const document = useCharacter(player);
        const componentData = { id, dlc, drawable, texture, palette };
        return await updateClothing(document, componentData);
    }

    /**
     * Set a prop component on the character to a specific prop component.
     *
     * Overrides any existing component.
     *
     * @param {keyof typeof PropKey} component
     * @param {number} dlc
     * @param {number} drawable
     * @param {number} texture
     * @return
     */
    async function setPropComponent(component: keyof typeof PropKey, dlc: number, drawable: number, texture: number) {
        const id = PropKey[component];

        try {
            player.setDlcProp(dlc, id, drawable, texture);
        } catch (err) {
            return false;
        }

        const document = useCharacter(player);
        const componentData = { id, dlc, drawable, texture, isProp: true };
        return await updateClothing(document, componentData);
    }

    /**
     * Remove a clothing component if it is available
     *
     * @param {keyof typeof ClothingKey} component
     * @return
     */
    async function removeClothingComponent(component: keyof typeof ClothingKey) {
        const id = ClothingKey[component];
        const document = useCharacter(player);
        const data = document.get();

        if (!data.clothing) {
            return false;
        }

        const modifiedClothes = [...data.clothing];
        for (let i = modifiedClothes.length - 1; i >= 0; i--) {
            if (modifiedClothes[i].id == id && !modifiedClothes[i].isProp) {
                modifiedClothes.splice(i, 1);
                break;
            }
        }

        return await document.set('clothing', modifiedClothes);
    }

    /**
     * Remove a prop component if it is available
     *
     * @param {keyof typeof PropKey} component
     * @return
     */
    async function removePropComponent(component: keyof typeof PropKey) {
        const id = PropKey[component];
        const document = useCharacter(player);
        const data = document.get();

        if (!data.clothing) {
            return false;
        }

        const modifiedClothes = [...data.clothing];
        for (let i = modifiedClothes.length - 1; i >= 0; i--) {
            if (modifiedClothes[i].id == id && !modifiedClothes[i].isProp) {
                modifiedClothes.splice(i, 1);
                break;
            }
        }

        return await document.set('clothing', modifiedClothes);
    }

    /**
     * This function clears a player's clothing entirely and triggers an event.
     */
    async function clearClothing(): Promise<void> {
        const document = useCharacter(player);
        const data = document.get();
        if (typeof data === 'undefined') {
            return;
        }

        await document.set('clothing', []);
        sync();
    }

    /**
     * Set player appearance to a skin / model / ped.
     *
     * @export
     * @param {(string | number)} model
     */
    async function setSkin(model: string | number) {
        const document = useCharacter(player);
        const data = document.get();
        if (typeof data === 'undefined') {
            return false;
        }

        await document.set('skin', typeof model === 'string' ? alt.hash(model) : model);
        sync();
        return true;
    }

    /**
     * Clear player custom model.
     */
    async function clearSkin() {
        const document = useCharacter(player);
        const data = document.get();
        if (typeof data === 'undefined') {
            return false;
        }

        await document.set('skin', undefined);
        sync();
        return true;
    }

    /**
     * This function updates a player's appearance and clothing based on their character data.
     *
     * @param {Character} document - The `document` parameter is an optional parameter of type `Character`.
     * If it is not provided, the function will retrieve the character data for the player from the
     * `Athena.document.character` object. If it is provided, the function will use the provided
     * `Character` object instead.
     *
     * @returns The function does not always return a value. It may return the result of the
     * `Overrides.update` function if it exists and is called, but otherwise it may not return anything.
     */
    function sync(document: Character = undefined) {
        if (!player || !player.valid) {
            return;
        }

        let data: Character;
        if (typeof document === 'undefined') {
            const characterDocument = useCharacter(player);
            data = characterDocument.get();
        } else {
            data = document;
        }

        if (typeof data === 'undefined') {
            return;
        }

        apply(data);
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
        clearClothing,
        clearSkin,
        clearUniform,
        removeClothingComponent,
        removePropComponent,
        setSkin,
        setClothing,
        setClothingComponent,
        setPropComponent,
        setUniform,
        sync,
        update,
    };
}
