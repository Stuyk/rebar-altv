import * as alt from 'alt-client';
import * as native from 'natives';
import { ZoneNames } from '../../../shared/data/zoneNames.js';

const WeatherHashes = {
    '669657108': 'BLIZZARD',
    '916995460': 'CLEAR',
    '1840358669': 'CLEARING',
    '821931868': 'CLOUDS',
    '-1750463879': 'EXTRASUNNY',
    '-1368164796': 'FOGGY',
    '-921030142': 'HALLOWEEN',
    '-1148613331': 'OVERCAST',
    '1420204096': 'RAIN',
    '282916021': 'SMOG',
    '603685163': 'SNOWLIGHT',
    '-1233681761': 'THUNDER',
    '-1429616491': 'XMAS',
};

export function getPreviousWeatherType() {
    return WeatherHashes[native.getPrevWeatherTypeHashName()];
}


export function getStreetInfo(pos: alt.Vector3) {
    const [_, streetNameHash, crossingRoadHash] = native.getStreetNameAtCoord(pos.x, pos.y, pos.z);

    const streetName = native.getStreetNameFromHashKey(streetNameHash);
    const crossingRoad = native.getStreetNameFromHashKey(crossingRoadHash);

    return { streetName, crossingRoad };
}

export function getDirection(entity: alt.Player | alt.Vehicle) {
    let angle = native.getEntityHeading(entity);
    const directions = ['N', 'NW', 'W', 'SW', 'S', 'SE', 'E', 'NE'];
    const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index];
}

export function getZone(pos: alt.Vector3) {
    return ZoneNames[native.getNameOfZone(pos.x, pos.y, pos.z)];
}
