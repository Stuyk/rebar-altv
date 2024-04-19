import sjcl from 'sjcl';

/**
 * Hash a plain text password with pbkdf2 hash and salt.
 *
 * Returns a pbkdf2 key, and salt. Which can be seperated by the `$` sign.
 *
 * #### Example
 * ```ts
 * const result = Athena.utility.hash.hashPassword('somePassword');
 * ```
 *
 * @param  {string} plainTextPassword
 * @returns {string}
 */
export function hash(plainTextPassword: string): string {
    const saltBits = sjcl.random.randomWords(128, 0);
    const salt = sjcl.codec.base64.fromBits(saltBits);
    const key = sjcl.codec.base64.fromBits(sjcl.misc.pbkdf2(plainTextPassword, saltBits, 2000, 256));
    return `${key}$${salt}`;
}

/**
 * Test a plain text password against a stored pbkdf2 string.
 *
 * #### Example
 * ```ts
 * // Actual pbkdf2Hash is just mock string
 * const doesMatch = Athena.utility.hash.testPassword('test', 'kjfdskljfsdkl$90jj0f10f21f1')
 * ```
 *
 * @param  {string} plainTextPassword
 * @param  {string} pbkdf2Hash
 * @returns {boolean}
 */
export function check(plainTextPassword: string, pbkdf2Hash: string): boolean {
    const [_key, _salt] = pbkdf2Hash.split('$');
    const saltBits = sjcl.codec.base64.toBits(_salt);
    const derivedKey = sjcl.misc.pbkdf2(plainTextPassword, saltBits, 2000, 256);
    const derivedBaseKey = sjcl.codec.base64.fromBits(derivedKey);
    return _key === derivedBaseKey;
}
