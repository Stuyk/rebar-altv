import sjcl from 'sjcl';

/**
 * Hash a string of data into a persistent SHA256 hash.
 *
 * @param  {string} data
 * @returns {string}
 */
export function sha256(data: string): string {
    const hashBits = sjcl.hash.sha256.hash(data);
    return sjcl.codec.hex.fromBits(hashBits);
}

/**
 * Hash a string of data into a random SHA256 hash.
 *
 * @param  {string} data
 * @returns {string}
 */
export function sha256Random(data: string): string {
    const randomValue = Math.random();
    return sha256(`${data} + ${randomValue}`);
}
