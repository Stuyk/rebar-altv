export interface ServerConfig {
    /**
     * Hit the armour, and health bar in the bottom left
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    hideHealthArmour?: boolean;
    /**
     * Hide the minimap when the player is on foot
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    hideMinimapOnFoot?: boolean;

    /**
     * Hide the minimap when the player is in a WebView Page
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    hideMinimapInPage?: boolean;

    /**
     * Hide the minimap when the player is in a vehicle
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    hideMinimapInVehicle?: boolean;

    /**
     * Hide default GTA:V vehicle name when entering a vehicle
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    hideVehicleName?: boolean;

    /**
     * Hide default GTA:V vehicle class when entering a vehicle
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    hideVehicleClass?: boolean;

    /**
     * Hide street names
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    hideStreetName?: boolean;

    /**
     * Hide area name
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    hideAreaName?: boolean;

    /**
     * Disable pistol whipping entirely
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    disablePistolWhip?: boolean;

    /**
     * Disable starting vehicle engine when entering vehicle
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    disableVehicleEngineAutoStart?: boolean;

    /**
     * Disable stopping vehicle engine when leaving a vehicle
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    disableVehicleEngineAutoStop?: boolean;

    /**
     * Disable swapping seats in a vehicle
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    disableVehicleSeatSwap?: boolean;

    /**
     * Disables headshot damage
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    disableCriticalHits?: boolean;

    /**
     * Disables props from being knocked off
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    disablePropKnockoff?: boolean;

    /**
     * Disable scuba gear from being automatically taken off
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    disableScubaGearRemoval?: boolean;

    /**
     * Disable shooting from a vehicle
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    disableDriveBys?: boolean;

    /**
     * Prevents players from going into cover
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    disableCover?: boolean;

    /**
     * Disable ambient noise throughout the entire server
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    disableAmbientNoise?: boolean;

    /**
     * Disable weapon radial menu
     *
     * @type {boolean}
     * @memberof ServerConfig
     */
    disableWeaponRadial?: boolean;
}
