import dotenv from 'dotenv';

export interface Config {
    mongodb: string;
    database_name: string;
}

export interface ConfigInit<T extends keyof Config> {
    env: keyof NodeJS.ProcessEnv;
    required?: boolean;
    default?: Config[T];
    type?: 'number' | 'boolean';
}

const config = {} as Config;

export function useConfig() {
    dotenv.config();

    /**
     * Casts value to specific type.
     * 
     * @param {string | undefined} value Value to be casted.
     * @param {string | undefined} type Type for value to be casted to.
     * @returns {T | undefined} Casted value, string if type isn't provided.
     */
    function parseValue<T>(value: string | undefined, type: string | undefined): T | undefined {
        if (value === undefined) {
            return undefined;
        }

        if (type === 'number') {
            const parsedValue = parseFloat(value) as unknown as T;
            if (isNaN(parsedValue as number)) throw new Error(`Can't parse '${value}', it is not a valid number`)
            return parsedValue;
        } else if (type === 'boolean') {
            return value.toLowerCase() === 'true' ? (true as unknown as T) : (false as unknown as T);
        }

        // Default to string if type is not specified or unrecognized
        return value as unknown as T;
    }

    /**
     * Inits a variable in config using env variable.
     * Supports type cast for number/boolean, default value and check for mandatory.
     * 
     * @param {keyof Config} key Config variable name.
     * @param {ConfigInit[keyof Config]} options Options for config variable initialization.
     */
    function initFromEnv<T extends keyof Config>(
        key: T,
        options: ConfigInit<T>,
    ): void {
        const valueFromEnv = process.env[options.env];
        let parsedValue: Config[T];
        try {
            parsedValue = parseValue<Config[T]>(valueFromEnv, options.type);
        } catch (error) {
            throw new Error(`Can't set ${key}: ${error.message}`)
        }

        let value: Config[T] | undefined = parsedValue;

        if (value === undefined && options.default !== undefined) {
            value = options.default as Config[T];
        }

        if ((options.required || typeof options.required === 'undefined') && value === undefined) {
            throw new Error(`${options.env} should be defined in .env file.`);
        }

        config[key] = value;
    }

    /**
     * Sets/overrides a variable in runtime.
     * 
     * Warning: 
     * This function doesn't check a type programmatically, 
     * you will only get a lint issue in your IDE.
     * 
     * @param {keyof Config} key Name of config variable.
     * @param {Config[keyof Config]} value New value
     */
    function set<T extends keyof Config>(key: T, value: Config[T]): void {
        config[key] = value;
    }

    /**
     * Gets the whole config object.
     * @returns {Config} Config object.
     */
    function get(): Config {
        return config;
    }

    /**
     * Gets a specific field value from config.
     * 
     * @param {keyof Config} key Key of config variable.
     * @returns {Config[keyof Config]} Config variable value.
     */
    function getField<T extends keyof Config>(key: T): Config[T] | undefined {
        return config[key];
    }

    return {
        get,
        set,
        getField,
        initFromEnv,
    };
}

useConfig().initFromEnv('mongodb', {
    env: 'MONGODB',
    default: 'mongodb://127.0.0.1:27017'
});

useConfig().initFromEnv('database_name', {
    env: 'DATABASE_NAME',
    default: 'Rebar',
});
