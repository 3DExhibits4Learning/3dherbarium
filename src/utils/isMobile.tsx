/**
 * @function isMobileOrTablet
 * 

'use client'

/**
 * @function isMobileOrTablet
 * 
 * @returns {boolean} true if the user is on a mobile device, false otherwise
 */
export function isMobileOrTablet(): boolean {
  const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;

  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  return mobileRegex.test(userAgent);
}


