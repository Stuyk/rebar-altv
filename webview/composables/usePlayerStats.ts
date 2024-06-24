import { ref, computed } from 'vue';
import { Events } from '../../src/main/shared/events/index.js';
import { useEvents } from './useEvents.js';
import { PlayerStats } from '../../src/main/shared/types/playerStats.js';

const events = useEvents();

const data = ref<PlayerStats>({
    health: 200,
    armour: 0,
    speed: 0,
    weapon: 0xa2719263, // Fist
    ammo: 0,
    stamina: 0,
    inVehicle: false,
    inWater: false,
    isAiming: false,
    isFlying: false,
    isMetric: true,
    gear: 0,
    maxGear: 0,
    engineOn: false,
    locked: false,
    seat: 0,
    vehicleHealth: 0,
    fps: 0,
    ping: 0,
    isTalking: false,
    time: { hour: 0, minute: 0, second: 0 },
    street: { streetName: '', crossingRoad: '' },
    direction: '',
    weather: '',
    indicatorLights: 0,
    lights: [false, false],
    vehicleClass: -1,
    zone: '',
});

let isInit = false;

export function usePlayerStats() {
    if (!isInit) {
        events.on(Events.localPlayer.stats.set, (stats: PlayerStats) => (data.value = stats));
        isInit = true;
    }

    return {
        health: computed(() => {
            return data.value.health;
        }),
        armour: computed(() => {
            return data.value.armour;
        }),
        speed: computed(() => {
            return data.value.speed;
        }),
        weapon: computed(() => {
            return data.value.weapon;
        }),
        stamina: computed(() => {
            return data.value.stamina;
        }),
        inVehicle: computed(() => {
            return data.value.inVehicle;
        }),
        inWater: computed(() => {
            return data.value.inWater;
        }),
        isMetric: computed(() => {
            return data.value.isMetric;
        }),
        gear: computed(() => {
            return data.value.gear;
        }),
        maxGear: computed(() => {
            return data.value.maxGear;
        }),
        engineOn: computed(() => {
            return data.value.engineOn;
        }),
        locked: computed(() => {
            return data.value.locked;
        }),
        seat: computed(() => {
            return data.value.seat;
        }),
        vehicleClass: computed(() => {
            return data.value.vehicleClass;
        }),
        vehicleHealth: computed(() => {
            return data.value.vehicleHealth;
        }),
        ping: computed(() => {
            return data.value.ping;
        }),
        fps: computed(() => {
            return data.value.fps;
        }),
        isTalking: computed(() => {
            return data.value.isTalking;
        }),
        time: computed(() => {
            return data.value.time;
        }),
        street: computed(() => {
            return data.value.street.streetName;
        }),
        crossingRoad: computed(() => {
            return data.value.street.crossingRoad;
        }),
        direction: computed(() => {
            return data.value.direction;
        }),
        weather: computed(() => {
            return data.value.weather;
        }),
        indicatorLights: computed(() => {
            return data.value.indicatorLights;
        }),
        headlights: computed(() => {
            return data.value.lights[0];
        }),
        highbeams: computed(() => {
            return data.value.lights[1];
        }),
        zone: computed(() => {
            return data.value.zone;
        }),
        isAiming: computed(() => {
            return data.value.isAiming;
        }),
        isFlying: computed(() => {
            return data.value.isFlying;
        }),
    };
}
