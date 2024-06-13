import * as alt from 'alt-client';
import * as native from 'natives';
import { useMessenger } from '../../system/messenger.js';
import * as ScreenText from '../../screen/textlabel.js';
import * as ScreenShapes from '../../screen/shapes.js';
import { WorldMenu } from '../../../shared/types/worldMenu.js';
import { Events } from '../../../shared/events/index.js';

const messenger = useMessenger();
const boxSize = { x: 0.22, y: 0.07 };
let isOpen = false;

const CONTROLS = {
    DOWN: 187,
    UP: 188,
    ACCEPT: 201,
    BACK: 202,
};

export function useWorldMenu(menu: WorldMenu) {
    isOpen = true;

    const interval = alt.setInterval(draw, 0);
    const onSelectCallbacks: Array<(event: string, args: any[]) => void> = [];
    const onBackCallbacks: Function[] = [];

    let index = 0;
    let controlCooldown = Date.now();
    let controlDebounce = 145;

    function drawOption(optionIndex: number, pos: alt.Vector3, text: string) {
        const bgColor = index === optionIndex ? new alt.RGBA(255, 255, 255, 100) : new alt.RGBA(0, 0, 0, 200);
        ScreenShapes.drawRectangle(pos, boxSize, bgColor, new alt.Vector2(0, boxSize.y * optionIndex));
        ScreenText.drawText3D(
            text,
            pos,
            0.5,
            new alt.RGBA(255, 255, 255, 255),
            new alt.Vector2(0, boxSize.y * optionIndex - boxSize.y / 4),
        );
    }

    function draw() {
        const canControl = Date.now() > controlCooldown;

        if (messenger.isChatFocused()) {
            return;
        }

        ScreenShapes.drawRectangle(menu.pos, boxSize, new alt.RGBA(0, 0, 0, 100), new alt.Vector2(0, -boxSize.y));
        ScreenText.drawText3D(
            menu.title,
            menu.pos,
            0.75,
            new alt.RGBA(255, 255, 255, 255),
            new alt.Vector2(0, -boxSize.y - boxSize.y / 3),
        );

        for (let i = 0; i < menu.options.length; i++) {
            drawOption(i, menu.pos, menu.options[i].name);
        }

        native.drawLightWithRange(menu.pos.x, menu.pos.y, menu.pos.z, 255, 255, 255, 3, 5);

        if (!canControl) {
            return;
        }

        if (native.isControlPressed(0, CONTROLS.UP) || native.isDisabledControlPressed(0, CONTROLS.UP)) {
            controlCooldown = Date.now() + controlDebounce;
            if (index - 1 < 0) {
                return;
            }

            native.playSoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
            index -= 1;
            return;
        }

        if (native.isControlPressed(0, CONTROLS.DOWN) || native.isDisabledControlPressed(0, CONTROLS.DOWN)) {
            controlCooldown = Date.now() + controlDebounce;
            if (index + 1 >= menu.options.length) {
                return;
            }

            native.playSoundFrontend(-1, 'NAV_UP_DOWN', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
            index += 1;
            return;
        }

        if (
            native.isControlJustPressed(0, CONTROLS.ACCEPT) ||
            native.isDisabledControlJustPressed(0, CONTROLS.ACCEPT)
        ) {
            controlCooldown = Date.now() + controlDebounce;
            isOpen = false;
            native.playSoundFrontend(-1, 'SELECT', 'HUD_FRONTEND_MP_SOUNDSET', true);
            alt.clearInterval(interval);

            const selection = menu.options[index];
            for (let cb of onSelectCallbacks) {
                cb(selection.event, selection.args);
            }
            return;
        }

        if (native.isControlJustPressed(0, CONTROLS.BACK) || native.isDisabledControlJustPressed(0, CONTROLS.BACK)) {
            controlCooldown = Date.now() + controlDebounce;
            isOpen = false;
            native.playSoundFrontend(-1, 'BACK', 'HUD_FRONTEND_DEFAULT_SOUNDSET', true);
            alt.clearInterval(interval);
            for (let cb of onBackCallbacks) {
                cb();
            }
            return;
        }
    }

    function onSelect(cb: (event: string, args: any[]) => void) {
        onSelectCallbacks.push(cb);
    }

    function onBack(cb: Function) {
        onBackCallbacks.push(cb);
    }

    return {
        onSelect,
        onBack,
    };
}

export function isWorldMenuOpen() {
    return isOpen;
}

alt.onRpc(Events.menus.worldmenu.show, async (menu: WorldMenu) => {
    const worldMenu = useWorldMenu(menu);

    const result: { event: string; args: any[] } = await new Promise((resolve: Function) => {
        worldMenu.onBack(() => {
            resolve(undefined);
        });

        worldMenu.onSelect((event, args) => {
            resolve({ event, args });
        });
    });

    return result;
});
