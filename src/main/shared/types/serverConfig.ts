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
}
