/**
 * Normalizes a path by removing expo-router route group segments.
 * Route groups are patterns like /(volunteer), /(guest), etc.
 * 
 * @param path - The path to normalize
 * @returns The path with route group segments removed
 * @example
 * normalizePath('/(volunteer)/home') // returns '/home'
 * normalizePath('/(guest)/search/123') // returns '/search/123'
 */

export const normalizePath = (path: string) => {
    return path.replace(/\/\([^)]+\)/g, ''); // Retire /(...)
};