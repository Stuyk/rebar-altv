declare global {
    interface RebarServices {}
}

const Services: Map<keyof RebarServices, Object> = new Map();

export function useServiceRegister() {
    /**
     * Add a service handler with a service name, and service handlers
     *
     * @template K
     * @param {K} serviceName
     * @param {RebarServices[K]} serviceHandler
     * @return
     */
    function register<K extends keyof RebarServices>(serviceName: K, serviceHandler: RebarServices[K]) {
        if (Services.has(serviceName)) {
            throw new Error(
                `Service ${serviceName} is already registered. Services should only have one library handler.`,
            );
        }

        Services.set(serviceName, serviceHandler);

        return {
            remove: () => {
                remove(serviceName);
            },
        };
    }

    /**
     * Remove a service handler by service name
     *
     * @template K
     * @param {K} serviceName
     * @param {string} uid
     * @return
     */
    function remove<K extends keyof RebarServices>(serviceName: K) {
        if (!Services.has(serviceName)) {
            return;
        }

        Services.delete(serviceName);
    }

    /**
     * Get all services by service name
     *
     * @template K
     * @param {K} serviceName
     * @return
     */
    function get<K extends keyof RebarServices>(serviceName: K) {
        if (!Services.has(serviceName)) {
            return undefined as Partial<RebarServices[K]>;
        }

        return Services.get(serviceName) as Partial<RebarServices[K]>;
    }

    return {
        register,
        get,
        remove,
    };
}
