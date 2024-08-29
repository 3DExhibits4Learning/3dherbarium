/**
 * @function toUpperFirstLetter
 * 
 * @param {string | null} value 
 * @returns a new string where the first character is uppercase
 */
export const toUpperFirstLetter = (value: string | null): string => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
};
