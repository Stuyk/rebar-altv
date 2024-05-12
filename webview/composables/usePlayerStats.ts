import { ref, computed } from 'vue';
import { Events } from '../../src/main/shared/events/index.js';
import { useEvents } from './useEvents.js';
import { VehicleIndicatorLights } from 'alt-client';

const events = useEvents();

type StreetName = string;
type CrossingRoad = string;

type Stats = {
    health: number;
    armour: number;
    speed: number;
    weapon: number;
    ammo: number;
    stamina: number;
    inVehicle: boolean;
    inWater: boolean;
    engineOn: boolean;
    gear: number;
    maxGear: number;
    vehicleHealth: number;
    fps: number;
    ping: number;
    isTalking: boolean;
    time: [void, number, number, number, number, number, number];
    street: [StreetName, CrossingRoad];
    weather: string;
    indicatorLights: VehicleIndicatorLights;
    lights: [boolean, boolean];
};

const data = ref<Stats>({
    health: 200,
    armour: 0,
    speed: 0,
    weapon: 0xa2719263, // Fist
    ammo: 0,
    stamina: 0,
    inVehicle: false,
    inWater: false,
    gear: 0,
    maxGear: 0,
    engineOn: false,
    vehicleHealth: 0,
    fps: 0,
    ping: 0,
    isTalking: false,
    time: [null, 0, 0, 0, 0, 0, 0],
    street: ['', ''],
    weather: '',
    indicatorLights: 0,
    lights: [false, false],
});

let isInit = false;

export function usePlayerStats() {
    if (!isInit) {
        // Player
        events.on(Events.localPlayer.stats.armour, (armour: number) => (data.value.armour = armour));
        events.on(Events.localPlayer.stats.health, (health: number) => (data.value.health = health));
        events.on(Events.localPlayer.stats.speed, (speed: number) => (data.value.speed = speed));
        events.on(Events.localPlayer.stats.weapon, (weapon: number) => (data.value.weapon = weapon));
        events.on(Events.localPlayer.stats.stamina, (stamina: number) => (data.value.stamina = stamina));
        events.on(Events.localPlayer.stats.inWater, (inWater: boolean) => (data.value.inWater = inWater));
        events.on(Events.localPlayer.stats.ammo, (ammo: number) => (data.value.ammo = ammo));

        // General
        events.on(Events.localPlayer.stats.ping, (ping: number) => (data.value.ping = ping));
        events.on(Events.localPlayer.stats.fps, (fps: number) => (data.value.fps = fps));
        events.on(Events.localPlayer.stats.isTalking, (isTalking: boolean) => (data.value.isTalking = isTalking));

        // Vehicle
        events.on(Events.localPlayer.stats.inVehicle, (inVehicle: boolean) => (data.value.inVehicle = inVehicle));
        events.on(Events.localPlayer.stats.gear, (gear: number) => (data.value.gear = gear));
        events.on(Events.localPlayer.stats.maxGear, (maxGear: number) => (data.value.maxGear = maxGear));
        events.on(Events.localPlayer.stats.engineOn, (engineOn: boolean) => (data.value.engineOn = engineOn));
        events.on(Events.localPlayer.stats.lights, (lights: [boolean, boolean]) => (data.value.lights = lights));
        events.on(
            Events.localPlayer.stats.indicatorLights,
            (indicatorLights: VehicleIndicatorLights) => (data.value.indicatorLights = indicatorLights),
        );
        events.on(
            Events.localPlayer.stats.vehicleHealth,
            (vehicleHealth: number) => (data.value.vehicleHealth = vehicleHealth),
        );

        // World
        events.on(
            Events.localPlayer.stats.time,
            (time: [void, number, number, number, number, number, number]) => (data.value.time = time),
        );

        events.on(
            Events.localPlayer.stats.street,
            (street: [StreetName, CrossingRoad]) => (data.value.street = street),
        );

        events.on(Events.localPlayer.stats.weather, (weather: string) => (data.value.weather = weather));

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
        gear: computed(() => {
            return data.value.gear;
        }),
        maxGear: computed(() => {
            return data.value.maxGear;
        }),
        engineOn: computed(() => {
            return data.value.engineOn;
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
            return data.value.street[0];
        }),
        crossingRoad: computed(() => {
            return data.value.street[1];
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
    };
}
