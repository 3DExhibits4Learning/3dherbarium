/**
 * @file urlConfig.ts
 * @fileoverview contains the configuration for the APIs used throughout 
 * the application. Includes iNaturalist and GBIF APIs.
 */


/**
 * @function iNatUrl
 * @description Gets the URL of the iNaturalist API with inserted passed parameters.
 * 
 * @param {string} config the API URL endpoint configuration
 * @param {string} specimenName the name of the specimen to search information for
 * @param {string} searchParams the extra search parameters added to the end of the url
 */
export const iNatUrl = (config: string, specimenName: string, searchParams: string): string => (`https://api.inaturalist.org/v1/${config}=${specimenName}${searchParams}`);

/**
 * @function gbifUrl
 * @description Gets the URL of the GBIF API with inserted passed parameters.
 * 
 * @param {string} config the API URL endpoint configuration
 * @param {string} specimenName the name of the specimen to search information for
 */
export const gbifUrl = (config: string, key: number | undefined): string => (`https://api.gbif.org/v1/${config}=${key}`);
