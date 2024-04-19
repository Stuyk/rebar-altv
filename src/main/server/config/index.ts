import dotenv from 'dotenv';

export function useConfig() {
    dotenv.config();

    function get() {
        return {
            mongodb: process.env.MONGODB ?? 'mongodb://127.0.0.1:27017',
        };
    }

    return {
        get,
    };
}
