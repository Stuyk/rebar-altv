# Vehicle Document

See [Documents Section](./index.md) for further information on documents.

## Extending Vehicle

Extending the default Vehicle Interface is super simple. Just add a `declare module` to any plugin.

```ts
declare module '@Shared/types/vehicle.js' {
    export interface Vehicle {
        newCoolData: string;
    }
}
```

## useVehicleBinder

### bind

```ts
const someVehicleData = {
    _id: 'jklfdjksllfkds',
    model: 418536135,
};

const document = Rebar.document.vehicle.useVehicleBinder(someVehicle).bind(someVehicleData);
```

## useVehicle

### get

Data can be retrieved for the bound character like this.

```ts
async function someFunction(vehicle: alt.Vehicle) {
    const document = Rebar.document.vehicle.useVehicle(vehicle);
    const data = document.get();
    console.log(data.model);
}
```

### getField

Data can be retrieved for the bound character like this.

```ts
async function someFunction(vehicle: alt.Vehicle) {
    const document = Rebar.document.vehicle.useVehicle(vehicle);
    const model = document.getField('model');
    console.log(model);
}
```

### isValid

If you need to check if a vehicle has a document bound to them, you can use the following method.

```ts
async function someFunction(vehicle: alt.Vehicle) {
    if (!Rebar.document.vehicle.useVehicle(vehicle).isValid()) {
        // No vehicle document bound
        return;
    }
}
```

### set

Set a single field for the given document

```ts
function someFunction(vehicle: alt.Vehicle) {
    const document = Rebar.document.vehicle.useVehicle(vehicle);
    document.set('model', 1663218586);
}
```

### setBulk

Set multiple fields for the given document

```ts
function someFunction(vehicle: alt.Vehicle) {
    const document = Rebar.document.vehicle.useVehicle(vehicle);
    document.setBulk({ model: 1663218586};
}
```
