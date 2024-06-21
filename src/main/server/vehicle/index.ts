import * as alt from 'alt-server';
import { useRebar } from '../index.js';
import { Vehicle, WheelState } from '../../shared/types/vehicle.js';
import * as Utility from '@Shared/utility/index.js';

const Rebar = useRebar();
const db = Rebar.database.useDatabase();

export function useVehicle(vehicle: alt.Vehicle) {
    /**
     * Apply a document to the vehicle
     *
     * @param {Partial<Vehicle>} document
     */
    function apply(document: Partial<Vehicle>) {
        if (document.stateProps) {
            for (let prop of Object.keys(document.stateProps)) {
                vehicle[prop] = document.stateProps[prop];
            }
        }

        // Synchronize wheel state
        if (document.wheelState) {
            for (let i = 0; i < document.wheelState.length; i++) {
                const state = document.wheelState[i];
                if (state === 'burst') {
                    vehicle.setWheelBurst(i, true);
                    continue;
                }

                if (state === 'detached') {
                    vehicle.setWheelDetached(i, true);
                    continue;
                }
            }
        }

        // Synchronize mods
        if (document.mods) {
            for (let key of Object.keys(document.mods)) {
                const id = parseInt(key);
                try {
                    if (id === 23) {
                        vehicle.setWheels(23, document.mods[key]);
                        continue;
                    }

                    if (id === 24) {
                        vehicle.setRearWheels(document.mods[key]);
                        continue;
                    }

                    vehicle.setMod(id, document.mods[key]);
                } catch (err) {}
            }
        }

        // Synchronize neon
        if (document.neonPlacement && document.neonColor) {
            vehicle.neon = document.neonPlacement;
            vehicle.neonColor = document.neonColor;
        }

        // Synchronize primary custom paint job
        if (typeof document.customPrimaryColor !== 'undefined') {
            vehicle.customPrimaryColor = document.customPrimaryColor;
        }

        // Synchronize secondary custom paint job
        if (typeof document.customSecondaryColor !== 'undefined') {
            vehicle.customSecondaryColor = document.customSecondaryColor;
        }

        // Synchronize primary paint job
        if (typeof document.primaryColor !== 'undefined') {
            vehicle.primaryColor = document.primaryColor;
        }

        // Synchronize secondary paint job
        if (typeof document.secondaryColor !== 'undefined') {
            vehicle.secondaryColor = document.secondaryColor;
        }

        // Synchronize wheelColor
        if(typeof document.wheelColor !== 'undefined') {
            vehicle.wheelColor = document.pearlColor;
        }

        // Synchronize pearlColor
        if(typeof document.pearlColor !== 'undefined') {
            vehicle.pearlColor = document.pearlColor;
        }

        // Synchronize vehicle extras
        if (document.extras) {
            for (let key of Object.keys(document.extras)) {
                const id = parseInt(key);
                try {
                    vehicle.setExtra(id, document.extras[key]);
                } catch (err) {}
            }
        }

        // Synchronize windows
        if (document.windows) {
            const isArmored = vehicle.hasArmoredWindows;

            for (let key of Object.keys(document.windows)) {
                const id = parseInt(key);
                if (!isArmored) {
                    vehicle.setWindowDamaged(id, document.windows[key] ? true : false);
                    continue;
                }

                vehicle.setArmoredWindowHealth(id, document.windows[key]);
            }
        }

        // Synchronize dimension
        vehicle.dimension = document.dimension ?? 0;
        vehicle.numberPlateText = document.numberPlateText ?? 'ALTV';
    }

    /**
     * Create a document based on the assigned vehicle, and return document.
     *
     * If the vehicle is already bound, `undefined` will be returned.
     *
     * @param {string} owner
     * @param {string} model
     * @param {alt.Vector3} pos
     * @param {alt.Vector3} rot
     * @return
     */
    async function create(ownerIdOrIdentifier: string) {
        if (!vehicle.valid) {
            return undefined;
        }

        const document = Rebar.document.vehicle.useVehicle(vehicle);
        if (document.get()) {
            return undefined;
        }

        const id = await db.create<Partial<Vehicle>>(
            {
                model: vehicle.model,
                dimension: vehicle.dimension,
                fuel: 0,
                owner: ownerIdOrIdentifier,
                pos: vehicle.pos,
                rot: vehicle.rot,
            },
            Rebar.database.CollectionNames.Vehicles,
        );

        const vehicleDocument = await db.get<Vehicle>({ _id: id }, Rebar.database.CollectionNames.Vehicles);
        Rebar.document.vehicle.useVehicleBinder(vehicle).bind(vehicleDocument);
        return vehicleDocument;
    }

    /**
     * Bind a document to this vehicle
     *
     * Returns `true` if bound successfully
     *
     * @param {Vehicle} document
     */
    function bind(document: Vehicle) {
        if (vehicle.model !== document.model) {
            return false;
        }

        if (Rebar.document.vehicle.useVehicle(vehicle).get()) {
            return false;
        }

        Rebar.document.vehicle.useVehicleBinder(vehicle).bind(document);
        return true;
    }

    /**
     * Check if the vehicle already has a bound document
     *
     * @return
     */
    function isBound() {
        return Rebar.document.vehicle.useVehicle(vehicle).get() ? true : false;
    }

    /**
     * Despawns current vehicle, grabs existing document on the vehicle.
     * Recreates the vehicle, saves health, and then re-applies the document.
     *
     * @return
     */
    async function repair(): Promise<alt.Vehicle> {
        const document = Rebar.document.vehicle.useVehicle(vehicle);
        const model = vehicle.model;
        const pos = vehicle.pos;
        const rot = vehicle.rot;

        try {
            vehicle.destroy();
        } catch (err) {}

        vehicle = new alt.Vehicle(model, pos, rot);

        if (!document.get()) {
            return vehicle;
        }

        Rebar.document.vehicle.useVehicleBinder(vehicle).bind(document.get(), false);
        await save();
        sync();

        return vehicle;
    }

    /**
     * Only saves vehicles that already have a pre-existing document
     *
     * @return
     */
    function save() {
        const document = Rebar.document.vehicle.useVehicle(vehicle);
        if (!document.get()) {
            return;
        }

        const windows: { [key: string]: number } = {};
        const isArmored = vehicle.hasArmoredWindows;
        for (let i = 0; i < 6; i++) {
            if (!isArmored) {
                windows[i] = vehicle.isWindowDamaged(i) ? 1 : 0;
                continue;
            }

            windows[i] = vehicle.getArmoredWindowHealth(i);
        }

        const data: Partial<Vehicle> = {
            pos: vehicle.pos,
            rot: vehicle.rot,
            windows,
            stateProps: {
                bodyHealth: vehicle.bodyHealth,
                dirtLevel: vehicle.dirtLevel,
                engineHealth: vehicle.engineHealth,
                engineOn: vehicle.engineOn,
                lightState: vehicle.lightState,
                lockState: vehicle.lockState,
                modKit: vehicle.modKit,
            },
        };

        // Save wheel state
        if (vehicle.wheelsCount >= 1) {
            const wheelState: WheelState[] = [];
            for (let i = 0; i < vehicle.wheelsCount; i++) {
                if (vehicle.isWheelBurst(i)) {
                    wheelState.push('burst');
                    continue;
                }

                if (vehicle.isWheelDetached(i)) {
                    wheelState.push('detached');
                    continue;
                }

                wheelState.push('attached');
            }

            data.wheelState = wheelState;
        }

        document.setBulk(data);
    }

    /**
     * Determine if this vehicle has an owner
     *
     * @return
     */
    function hasOwner() {
        const document = Rebar.document.vehicle.useVehicle(vehicle);
        return document.get() ? true : false;
    }

    /**
     * Toggle door state for the given vehicle
     *
     * 0 - Driver
     * 1 - Passenger
     * 2 - Back Left
     * 3 - Back Right
     * 4 - Hood
     * 5 - Trunk
     *
     * @param {number} door
     */
    function toggleDoor(door: number) {
        vehicle.setDoorState(door, vehicle.getDoorState(door) === 0 ? 7 : 0);
    }

    /**
     * Toggle the door as a player, check ownership
     *
     * @param {alt.Player} player
     * @param {number} door
     * @return
     */
    function toggleDoorAsPlayer(player: alt.Player, door: number) {
        if (!verifyOwner(player, true)) {
            return;
        }

        toggleDoor(door);
    }

    /**
     * Toggle the engine on and off
     */
    function toggleEngine() {
        vehicle.engineOn = !vehicle.engineOn;
    }

    /**
     * Toggle the engine as a player, check ownership
     *
     * @param {alt.Player} player
     * @return
     */
    function toggleEngineAsPlayer(player: alt.Player) {
        if (!verifyOwner(player, true)) {
            return;
        }

        toggleEngine();
    }

    /**
     * Toggle the vehicle lock from locked to unlocked
     */
    function toggleLock() {
        const LOCKED = 2;
        const UNLOCKED = 1;
        vehicle.lockState = vehicle.lockState === LOCKED ? UNLOCKED : LOCKED;
    }

    /**
     * Toggle the door locks as a player, check ownership
     *
     * @param {alt.Player} player
     * @return
     */
    function toggleLockAsPlayer(player: alt.Player) {
        if (!verifyOwner(player, true)) {
            return;
        }

        toggleLock();
    }

    /**
     * Add a player who has keys to this vehicle
     *
     * @param {string} owner_document_id
     * @return
     */
    async function addKey(owner_document_id: string) {
        const document = Rebar.document.vehicle.useVehicle(vehicle);
        if (!document.get()) {
            return false;
        }

        const keys: string[] = document.getField('keys') ?? [];
        const index = keys.findIndex((x) => x === owner_document_id);
        if (index >= 0) {
            return false;
        }

        keys.push(owner_document_id);
        await document.set('keys', keys);
        return true;
    }

    /**
     * Remove a player who has keys to this vehicle
     *
     * @param {string} owner_document_id
     * @return
     */
    async function removeKey(owner_document_id: string) {
        const document = Rebar.document.vehicle.useVehicle(vehicle);
        if (!document.get()) {
            return false;
        }

        const keys: string[] = document.getField('keys') ?? [];
        const index = keys.findIndex((x) => x === owner_document_id);
        if (index <= -1) {
            return false;
        }

        keys.splice(index, 1);
        await document.set('keys', keys);
        return true;
    }

    /**
     * Clear all keys for this vehicle
     *
     * @return
     */
    async function clearKeys() {
        const document = Rebar.document.vehicle.useVehicle(vehicle);
        if (!document.get()) {
            return false;
        }

        await document.set('keys', []);
        return true;
    }

    /**
     * Verify ownership of the vehicle by checking the owner identifier, or keys.
     *
     * If `requireOwnership` is set to true, then a non-owned vehicle will return false.
     *
     * Otherwise it will return `true`.
     *
     * @param {alt.Player} player
     */
    function verifyOwner(player: alt.Player, requireOwnership: boolean, ownerOnly = false) {
        const document = Rebar.document.vehicle.useVehicle(vehicle);
        if (!document.get()) {
            return requireOwnership ? false : true;
        }

        const rPlayer = Rebar.usePlayer(player);
        const _id = rPlayer.character.getField('_id');
        if (!_id) {
            return false;
        }

        // Verify ownership directly
        const owner: string = document.getField('owner');
        if (owner && owner === _id) {
            return true;
        }

        if (ownerOnly) {
            return false;
        }

        // Verify any matching keys
        const keys: string[] = document.getField('keys') ?? [];
        if (keys && keys.includes(_id)) {
            return true;
        }

        // Verify any matching permissions
        if (owner) {
            const permissions: string[] = rPlayer.character.getField('permissions') ?? [];
            for (let perm of permissions) {
                if (owner === perm) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * If the vehicle has a `document` bound to it, it will apply the appearance.
     */
    function sync() {
        const document = Rebar.document.vehicle.useVehicle(vehicle);
        if (!document.get()) {
            return;
        }

        // Synchronize health, engine health, dirt level, modKit etc.
        const data = document.get();
        apply(data);
    }

    /**
     * Get the model name of the vehicle
     *
     * @return
     */
    function getVehicleModelName() {
        return Utility.vehicleHashes.getNameFromHash(vehicle.model);
    }

    return {
        apply,
        bind,
        create,
        getVehicleModelName,
        hasOwner,
        isBound,
        keys: {
            add: addKey,
            remove: removeKey,
            clear: clearKeys,
        },
        repair,
        save,
        sync,
        toggleDoor,
        toggleDoorAsPlayer,
        toggleEngine,
        toggleEngineAsPlayer,
        toggleLock,
        toggleLockAsPlayer,
        verifyOwner,
    };
}
