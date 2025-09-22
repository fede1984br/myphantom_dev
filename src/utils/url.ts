export const createPageUrl = (path: string): string => {
  const formattedPath = path.startsWith('/') ? path : `/${path}`;
  return window.location.origin + formattedPath;
};