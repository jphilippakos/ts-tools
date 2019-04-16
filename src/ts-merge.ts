/**
 * Similar functionality to Javascript's Object.assign.
 * Creates a new object with the same prototype and constructor as the first argument passed in.
 * Enforces all further arguments to be partial type matches to first argument.
 */
export function tsMerge<T>(first: T, ...args: { [key in keyof T]?: T[key] }[]): T {
    const construct = first.constructor as new () => Object;
    return Object.assign(new construct(), first, ...args );
}