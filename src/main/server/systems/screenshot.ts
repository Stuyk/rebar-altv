import * as alt from 'alt-server';
import fs from 'fs';
import { Events } from '@Shared/events/index.js';
import { useBuffer } from '@Shared/utility/buffer.js';
import * as Clothing from '@Shared/data/clothing.js';
import { usePlayer } from '../player/index.js';

const BufferHelper = useBuffer();

const cache: { [id: string]: { data: Array<string>; isComplete: boolean } } = {};

function cleanupPlayer(player: alt.Player, isMale: boolean) {
    player.clearProp(0);
    player.clearProp(1);
    player.clearProp(2);
    player.clearProp(6);
    player.clearProp(7);

    player.clearBloodDamage();
    player.setClothes(0, 0, 1, 0);
    player.setClothes(1, 0, 0, 0);
    player.setClothes(5, 0, 0, 0);
    player.setClothes(7, 0, 0, 0);
    player.setClothes(9, 0, 0, 0);

    if (isMale) {
        player.setHeadBlendData(0, 0, 0, 0, 0, 0, 0, 0, 0);
        player.setClothes(2, 0, 0, 0); // Hair
        player.setClothes(3, 3, 0, 0); // Torso
        player.setClothes(4, 11, 0, 0); // Legs
        player.setClothes(6, 13, 0, 0); // Shoes
        player.setClothes(8, 15, 0, 0); // Undershirt
        player.setClothes(11, 15, 0, 0); // Top
        player.setHairColor(9);
        player.setHairHighlightColor(10);
    } else {
        player.setClothes(2, 0, 0, 0); // Hair
        player.setClothes(3, 8, 0, 0); // Torso
        player.setClothes(4, 13, 0, 0); // Legs
        player.setClothes(6, 34, 0, 0); // Shoes
        player.setClothes(8, 10, 0, 0); // Undershirt
        player.setClothes(11, 82, 0, 0); // Top
        player.setHeadBlendData(21, 21, 21, 21, 21, 21, 0, 0, 0);
        player.setHairColor(9);
        player.setHairHighlightColor(10);
    }
}

export function useScreenshot(player: alt.Player) {
    /**
     * Takes a screenshot of the game screen
     *
     * @param {string} screenshotName
     */
    async function take(screenshotName: string) {
        player.emit(Events.systems.screenshot.take, screenshotName);
        await alt.Utils.waitFor(() => typeof cache[screenshotName] !== 'undefined', 10000);
        await alt.Utils.waitFor(() => cache[screenshotName].isComplete, 10000);
        if (!cache[screenshotName].isComplete) {
            throw new Error(`Failed to capture screenshot for Player ID - ${player.id}`);
        }

        let data = BufferHelper.fromBuffer(cache[screenshotName].data);
        delete cache[screenshotName];

        if (!fs.existsSync(`${process.cwd()}/screenshots`)) {
            fs.mkdirSync(`${process.cwd()}/screenshots`, { recursive: true });
        }

        alt.log(`Saved Screenshot: ${screenshotName}`);
        const path = `${process.cwd()}/screenshots/${screenshotName}.jpg`;
        data = data.replace(/^data:image\/\w+;base64,/, '');
        const buf = Buffer.from(data, 'base64');
        fs.writeFileSync(path, buf);
    }

    /**
     * Take a screenshot of a vehicle model
     *
     * @param {alt.Player} player
     * @param {alt.Vector3} pos
     * @param {string} name
     * @param {number} model
     * @return
     */
    async function takeVehicleScreenshot(pos: alt.Vector3, name: string, model: number) {
        const rPlayer = usePlayer(player);
        rPlayer.world.setWeather('EXTRASUNNY', 0);
        rPlayer.world.setTime(12, 0, 0);

        let veh: alt.Vehicle;

        try {
            veh = new alt.Vehicle(model, pos, new alt.Vector3(0, 0, 1));
        } catch (err) {
            alt.logWarning(`Skipping ${name}, invalid model`);
            return;
        }

        veh.customPrimaryColor = new alt.RGBA(200, 200, 200);
        veh.customSecondaryColor = new alt.RGBA(200, 200, 200);
        veh.frozen = true;

        const didCreate = await player.emitRpc(Events.systems.screenshot.takeVehicle, veh);
        if (!didCreate) {
            alt.logWarning(`Skipping ${name}, invalid model`);
            return;
        }

        await take(name);

        veh.visible = false;
        veh.destroy();

        await alt.Utils.wait(100);
    }

    /**
     * Take a screenshot of a weapon, works best when player visibility is off
     *
     * @param {alt.Player} player
     * @param {string} name
     * @return
     */
    async function takeWeaponScreenshot(name: string) {
        const rPlayer = usePlayer(player);
        rPlayer.world.setWeather('EXTRASUNNY', 0);
        rPlayer.world.setTime(12, 0, 0);

        player.removeAllWeapons();

        try {
            player.giveWeapon(name, 9999, true);
        } catch (err) {
            alt.logWarning(`Skipping ${name}, invalid model`);
            return;
        }

        player.playAnimation('nm@hands', 'hands_up', 8.0, 8.0, -1, 18, 2.0, false, false, false);

        const didCreate = await player.emitRpc(Events.systems.screenshot.takeWeapon);
        if (!didCreate) {
            alt.logWarning(`Skipping ${name}, invalid model`);
            return;
        }

        await alt.Utils.wait(100);

        await take(name);

        await alt.Utils.wait(200);
    }

    async function takeClothingScreenshots(
        dlcName: string,
        modelOverride: string = undefined,
        useDefaultCategory = false,
    ) {
        let isMale = dlcName.toLowerCase().includes('mp_m') || dlcName.includes('Male_');

        const rPlayer = usePlayer(player);
        rPlayer.world.setWeather('EXTRASUNNY', 0);
        rPlayer.world.setTime(12, 0, 0);

        player.model = isMale ? 'mp_m_freemode_01' : 'mp_f_freemode_01';
        if (modelOverride) {
            isMale = modelOverride === 'mp_m_freemode_01';
            player.model = modelOverride;
        }

        await alt.Utils.wait(1000);

        let data = Clothing.getCategory(dlcName);
        if (useDefaultCategory) {
            dlcName = `${isMale ? 'mp_m_0' : 'mp_f_0'}`;
            data = Clothing.getDefaultCategory(isMale ? 'male' : 'female');
        }

        const dlcHash = useDefaultCategory ? 0 : alt.hash(dlcName);
        if (!data) {
            return;
        }

        if (!data.clothes) {
            return;
        }

        for (let key of Object.keys(data.clothes)) {
            const id = parseInt(key);
            if (id === 10) {
                continue;
            }

            player.playAnimation('rcmjosh1', 'idle', 8.0, 8.0, -1, 2, 3.0, false, false, false);

            if (id === 1 || id === 7 || id === 2) {
                player.playAnimation('nm@hands', 'hands_up', 8.0, 8.0, -1, 2, 3.0, false, false, false);
            }

            cleanupPlayer(player, isMale);

            await alt.Utils.wait(250);

            for (let i = 0; i < data.clothes[key]; i++) {
                player.setDlcClothes(dlcHash, id, i, 0, 0);

                const flipCamera = id === 5;
                const isReady = await player.emitRpc(Events.systems.screenshot.setClothing, id, flipCamera);

                if (!isReady) {
                    alt.logWarning(`Skipping ${dlcName} - ID ${id}, Component ${i}, could not be set?`);
                    continue;
                }

                await alt.Utils.wait(50);

                await take(`${dlcName}_${id}_${i}`);

                await alt.Utils.wait(50);
            }
        }

        await alt.Utils.wait(200);
    }

    return { take, takeClothingScreenshots, takeVehicleScreenshot, takeWeaponScreenshot };
}

alt.onClient(
    Events.systems.screenshot.get,
    (player: alt.Player, id: string, data: string, index: number, maxLength: number) => {
        if (!cache[id]) {
            cache[id] = {
                data: new Array(maxLength),
                isComplete: false,
            };
        }

        cache[id].data[index] = data;
        if (index === maxLength - 1) {
            cache[id].isComplete = true;
        }
    },
);
