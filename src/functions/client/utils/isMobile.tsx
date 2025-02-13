/**
 * @function isMobileOrTablet
 * 
 * @returns {boolean} true if the user is on a mobile device, false otherwise
 */

'use client'

export function isMobileOrTablet(): boolean | undefined{
  if(typeof window){
    const userAgent = window.navigator.userAgent
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(userAgent);
  }
  else return undefined
}


