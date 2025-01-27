import { iNatFetchObj } from "@/functions/client/collections/iNat";

/**
 * @description creates the url to be fetched by the iNat API
 * @param fetchObj the parameters to get the data by 
 * @returns the completed url
 */
export const iNatUrl = (fetchObj: iNatFetchObj): string => {
    const { specimenName, coordinate, searchOptions } = fetchObj;

    const params = new URLSearchParams();
    params.set("taxon_name", specimenName);
    params.set("lat", coordinate.lat.toString());
    params.set("lng", coordinate.lng.toString());
    params.set("radius", searchOptions.radius.toString());
    params.set("quality_grade", searchOptions.gradeType);

    //handle parsing the dates
    if (searchOptions.sinceDate != '') 
        params.set("d1", new Date(searchOptions.sinceDate).toISOString())
    

    if (searchOptions.beforeDate != '') 
         params.set("d2", new Date(searchOptions.beforeDate).toISOString())

    return `https://api.inaturalist.org/v1/observations?${params.toString()}`;
};

/**
 * @description makes the url to be fetched by the iNat API
 * @param fetchObj all the parameters to fetch by
 * @param type either can fetch the top leaders or observers
 * @returns the completed url
 */
export const iNatLeaderUrl = (fetchObj: iNatFetchObj, type: string): string => {
    const { specimenName, coordinate, searchOptions } = fetchObj;

    const params = new URLSearchParams();
    params.set("taxon_name", specimenName);
    params.set("lat", coordinate.lat.toString());
    params.set("lng", coordinate.lng.toString());
    params.set("radius", searchOptions.radius.toString());
    params.set("quality_grade", searchOptions.gradeType);

    //handle parsing the dates
    if (searchOptions.sinceDate != '') 
        params.set("d1", new Date(searchOptions.sinceDate).toISOString())
    

    if (searchOptions.beforeDate != '') 
         params.set("d2", new Date(searchOptions.beforeDate).toISOString())

    return `https://api.inaturalist.org/v1/observations/${type}?${params.toString()}`;
};