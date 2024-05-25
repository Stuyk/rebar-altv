import * as alt from 'alt-server';
import { useRebar } from '../index.js';
import { Vehicle, WheelState } from '../../shared/types/vehicle.js';

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
                    vehicle.setMod(id, document.mods[key]);
                } catch (err) {}
            }
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

    return { apply, create, repair, save, sync };
}
