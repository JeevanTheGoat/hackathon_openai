/**
 * Creates a URL path for a given page name.
 * Handles the special case for the 'Home' page which should be the root path '/'.
 * @param {string} pageName - The name of the page (e.g., 'Home', 'Debate').
 * @returns {string} The URL path (e.g., '/', '/debate').
 */
export const createPageUrl = (pageName) => {
  if (pageName === 'Home') {
    return '/';
  }
  return `/${pageName.toLowerCase()}`;
};