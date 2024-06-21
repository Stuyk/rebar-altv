import * as alt from 'alt-server';
import fs from 'fs';
import { Events } from '@Shared/events/index.js';
import { useBuffer } from '@Shared/utility/buffer.js';
import { useRebar } from '../index.js';

const Rebar = useRebar();
const BufferHelper = useBuffer();

const cache: { [id: string]: { data: Array<string>; isComplete: boolean } } = {};

export function useScreenshot(player: alt.Player) {
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

    async function takeVehicleScreenshot(player: alt.Player, pos: alt.Vector3, name: string, model: number) {
        const rPlayer = Rebar.usePlayer(player);
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

    async function takeWeaponScreenshot(player: alt.Player, name: string) {
        const rPlayer = Rebar.usePlayer(player);
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

    return { take, takeVehicleScreenshot, takeWeaponScreenshot };
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
