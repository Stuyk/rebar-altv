# usePed

Peds use the internal alt:V Peds that can be synchronized by invoking a set of hand-picked natives on them.

Default behavior:

-   When a pedestrian dies, it's despawned after 5 seconds

```ts
const ped = Rebar.controllers.usePed(new alt.Ped('mp_m_freemode_01', new alt.Vector3(0, 0, 0), alt.Vector3.ZERO, 100));

// Makes the ped not react to anything
ped.setOption('makeStupid', true);

// Makes the ped not take damage
ped.setOption('invincible', true);

// Invoke a native on the ped
// This one shows you how to play a simple dance animation
ped.invoke(
    'taskPlayAnim',
    'anim@amb@nightclub@mini@dance@dance_solo@female@var_a@',
    'med_center_up',
    8.0,
    8.0,
    -1,
    1,
    0,
    false,
    false,
    false,
);

// Listen for when this pedestrian dies
ped.onDeath((uid: string, killer: alt.Entity, weaponHash: number) => {
    console.log(`${uid} died`);
});

// Check if the pedestrian is near a position by 3 range
if (!ped.isNear(player.pos, 3)) {
    console.log('not close to the player');
}

// Freezes the ped in place
ped.setFrozen();

// Freeze ped in place, and disable collision entirely
ped.setNoCollision();

// Straight up just kill the ped, and make it disappear after 5 seconds
ped.kill();

// Fades out the ped over 5 seconds, and then destroys the ped
ped.fadeOutAndDestroy();
```

## Native List

These are the list of natives that are available to invoke.

This can be updated later but this is a general purpose list that should work fine with the ped.

```ts
type PedNatives = Pick<
    typeof native,
    | 'clearPedTasks'
    | 'clearPedTasksImmediately'
    | 'getIsTaskActive'
    | 'isEntityPlayingAnim'
    | 'isPedArmed'
    | 'isPedDeadOrDying'
    | 'isPedInCover'
    | 'isPedInVehicle'
    | 'isPedStopped'
    | 'taskAchieveHeading'
    | 'taskAimGunAtCoord'
    | 'taskAimGunAtEntity'
    | 'taskClearLookAt'
    | 'taskClimb'
    | 'taskClimbLadder'
    | 'taskCower'
    | 'taskEnterVehicle'
    | 'taskExitCover'
    | 'taskGetOffBoat'
    | 'taskGoStraightToCoord'
    | 'taskGoToCoordAnyMeans'
    | 'taskGoToEntity'
    | 'taskLeaveAnyVehicle'
    | 'taskOpenVehicleDoor'
    | 'taskPatrol'
    | 'taskPlayAnim'
    | 'taskReloadWeapon'
    | 'taskSeekCoverFromPos'
    | 'taskShootAtCoord'
    | 'taskShootAtEntity'
    | 'taskStartScenarioInPlace'
    | 'taskSynchronizedScene'
    | 'taskUseMobilePhone'
    | 'taskVehiclePark'
    | 'taskWanderInArea'
    | 'taskWanderSpecific'
    | 'taskWanderStandard'
>;
```
