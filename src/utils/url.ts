/**
 * Creates a full page URL by combining the window's origin with a given path.
 * @param path - The path to append (e.g., '/dashboard').
 * @returns The full URL.
 */
export const createPageUrl = (path: string): string => {
  // Ensures there is a single leading slash
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  return window.location.origin + formattedPath;
};