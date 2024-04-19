/**
 * Verify if a bitwise flag is enabled.
 *
 * @param {number} flags
 * @param {number} flagToCheck
 * @return {boolean}
 */
export function isEnabled(flags: number, flagToCheck: number): boolean {
    let currentFlags: number = flags as number;
    let currentFlagToCheck: number = flagToCheck as number;
    return (currentFlags & currentFlagToCheck) !== 0;
}
