import { useRebar } from '../index.js';

declare global {
    interface RebarServices {}
}

const Rebar = useRebar();
const Services: Map<keyof RebarServices, Map<string, Object>> = new Map();

export function useServices() {
    /**
     * Add a service handler with a service name, and service handlers
     *
     * @template K
     * @param {K} serviceName
     * @param {RebarServices[K]} serviceHandler
     * @return
     */
    function register<K extends keyof RebarServices>(serviceName: K, serviceHandler: RebarServices[K]) {
        if (!Services.has(serviceName)) {
            Services.set(serviceName, new Map());
        }

        const servicesList = Services.get(serviceName);
        const uid = Rebar.utility.uid.generate();
        servicesList.set(uid, serviceHandler);

        return {
            remove: () => {
                remove(serviceName, uid);
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
    function remove<K extends keyof RebarServices>(serviceName: K, uid: string) {
        if (!Services.has(serviceName)) {
            return;
        }

        const servicesList = Services.get(serviceName);
        if (!servicesList.has(uid)) {
            return;
        }

        servicesList.delete(uid);
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
            return [] as Partial<RebarServices[K]>[];
        }

        return [...Services.get(serviceName).values()] as Partial<RebarServices[K]>[];
    }

    return {
        register,
        get,
        remove,
    };
}
