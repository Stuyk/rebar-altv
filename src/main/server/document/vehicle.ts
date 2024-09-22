import * as alt from 'alt-server';
import {Vehicle as VehicleDocument} from '@Shared/types/index.js';
import { useDatabase } from '@Server/database/index.js';
import { CollectionNames, KeyChangeCallback } from './shared.js';
import { useIncrementalId } from './increment.js';
import { useVehicle as useVehicleRebar } from '../vehicle/index.js';

declare module 'alt-server' {
    export interface ICustomEmitEvent {
        'rebar:vehicleBound': (vehicle: alt.Vehicle, document: VehicleDocument) => void;
        'rebar:vehicleUpdated': <K extends keyof VehicleDocument>(
            vehicle: alt.Vehicle,
            fieldName: K,
            value: VehicleDocument[K],
        ) => void;
    }
}

const sessionKey = 'document:vehicle';
const callbacks: { [key: string]: Array<KeyChangeCallback<alt.Vehicle>> } = {};
const db = useDatabase();

export function useVehicle(vehicle: alt.Vehicle) {
    /**
     * Check if the vehicle currently has a character bound to them
     */
    function isValid() {
        if (!vehicle.hasMeta(sessionKey)) {
            return false;
        }

        if (!vehicle.getMeta(sessionKey)) {
            return false;
        }

        return true;
    }

    /**
     * Return current vehicle data and their associated Vehicle object.
     *
     * @template T
     * @return {VehicleDocument | undefined}
     */
    function get(): VehicleDocument | undefined {
        if (!vehicle.hasMeta(sessionKey)) {
            return undefined;
        }

        return <VehicleDocument>vehicle.getMeta(sessionKey);
    }

    /**
     * Get the current value of a specific field inside of the vehicle data object.
     * Can be extended to obtain any value easily.
     *
     * @template T
     * @param {(keyof KnownKeys<Vehicle & T>)} fieldName
     * @return {ReturnType | undefined}
     */
    function getField<K extends keyof VehicleDocument>(fieldName: K): VehicleDocument[K] | undefined {
        if (!vehicle.hasMeta(sessionKey)) {
            return undefined;
        }

        return vehicle.getMeta(sessionKey)[String(fieldName)];
    }

    /**
     * Sets a vehicle document value, and saves it automatically to the selected Vehicle database.
     * Automatically calls all callbacks associated with the field name.
     *
     * @template T
     * @param {(keyof KnownKeys<Vehicle & T>)} fieldName
     * @param {*} value
     * @return {void}
     */
    async function set<K extends keyof VehicleDocument>(fieldName: K, value: VehicleDocument[K]) {
        if (!vehicle.hasMeta(sessionKey)) {
            return undefined;
        }

        const typeSafeFieldName = String(fieldName);
        let data = vehicle.getMeta(sessionKey) as VehicleDocument;
        let oldValue = undefined;

        if (data[typeSafeFieldName]) {
            oldValue = JSON.parse(JSON.stringify(data[typeSafeFieldName]));
        }

        const newData = { [typeSafeFieldName]: value };

        data = Object.assign(data, newData);
        vehicle.setMeta(sessionKey, data);
        await db.update({ _id: data._id, [typeSafeFieldName]: value }, CollectionNames.Vehicles);

        alt.emit('rebar:vehicleUpdated', vehicle, fieldName, value);

        if (typeof callbacks[typeSafeFieldName] === 'undefined') {
            return;
        }

        for (let cb of callbacks[typeSafeFieldName]) {
            cb(vehicle, value, oldValue);
        }
    }

    /**
     * Sets vehicle document values, and saves it automatically to the selected Vehicle's database.
     * Automatically calls all callbacks associated with the field name.
     *
     * @template T
     * @param {(Partial<Vehicle & T>)} fields
     * @returns {void}
     */
    async function setBulk(fields: Partial<VehicleDocument>) {
        if (!vehicle.hasMeta(sessionKey)) {
            return undefined;
        }

        let data = vehicle.getMeta(sessionKey) as VehicleDocument;

        const oldValues = {};

        Object.keys(fields).forEach((key) => {
            if (typeof data[key] === 'undefined') {
                oldValues[key] = undefined;
                return;
            }

            oldValues[key] = JSON.parse(JSON.stringify(data[key]));
        });

        data = Object.assign(data, fields);
        vehicle.setMeta(sessionKey, data);
        await db.update({ _id: data._id, ...fields }, CollectionNames.Vehicles);

        Object.keys(fields).forEach((key) => {
            alt.emit('rebar:vehicleUpdated', vehicle, key as keyof VehicleDocument, data[key]);

            if (typeof callbacks[key] === 'undefined') {
                return;
            }

            for (let cb of callbacks[key]) {
                cb(vehicle, data[key], oldValues[key]);
            }
        });
    }

    async function addIdentifier() {
        if (typeof getField('id') !== 'undefined') {
            return getField('id');
        }

        const identifier = await useIncrementalId(CollectionNames.Vehicles);
        const id = await identifier.getNext();
        await setBulk({ id });
        return id;
    }

    return { addIdentifier, get, getField, isValid, set, setBulk };
}

export function useVehicleBinder(vehicle: alt.Vehicle) {
    /**
     * Binds a vehicle identifier to a Vehicle document.
     * This document is cleared on disconnected automatically.
     * This should be the first thing you do after having a user authenticate.
     *
     * @param {Vehicle & T} document
     */
    function bind(document: VehicleDocument, syncVehicle = true): ReturnType<typeof useVehicle> | undefined {
        if (!vehicle.valid) {
            return undefined;
        }

        vehicle.setMeta(sessionKey, document);
        alt.emit('rebar:vehicleBound', vehicle, document);

        if (syncVehicle) {
            useVehicleRebar(vehicle).sync();
        }

        const vehicleUse = useVehicle(vehicle);

        try {
            vehicleUse.addIdentifier();
        } catch (err) {}

        return vehicleUse;
    }

    /**
     * Unbind a document from a specific vehicle
     */
    function unbind() {
        if (!vehicle.valid) {
            return;
        }

        vehicle.deleteMeta(sessionKey);
    }

    return {
        bind,
        unbind,
    };
}
