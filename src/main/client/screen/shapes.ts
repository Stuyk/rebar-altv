import * as alt from 'alt-client';
import * as native from 'natives';

/**
 * Draw a box at a 3D coordinate
 *
 *
 * @param {alt.IVector3} pos A position in the world.
 * @param {alt.IVector2} size
 * @param {alt.RGBA} color
 * @return {void}
 */
export function drawRectangle(pos: alt.IVector3, size: alt.IVector2, color: alt.RGBA, offset = { x: 0, y: 0 }) {
    const [isOnScreen, x, y] = native.getScreenCoordFromWorldCoord(pos.x, pos.y, pos.z, 0, 0);
    if (!isOnScreen) {
        return;
    }

    native.setDrawOrigin(pos.x, pos.y, pos.z, false);
    native.drawRect(offset.x, offset.y, size.x, size.y, color.r, color.g, color.b, color.a, false);
    native.clearDrawOrigin();
}

/**
 * Draw a box on-screen
 *
 *
 * @param {alt.IVector2} pos
 * @param {alt.IVector2} size
 * @param {alt.RGBA} color
 */
export function drawRectangle2D(pos: alt.IVector2, size: alt.IVector2, color: alt.RGBA) {
    native.clearDrawOrigin();
    native.drawRect(pos.x, pos.y, size.x, size.y, color.r, color.g, color.b, color.a, false);
}
