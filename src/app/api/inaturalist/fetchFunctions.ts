/**
 * @file /src/app/api/fetchFunctions.ts
 * 
 * @fileoverview Holds api fetch utility functions to be used in routes
 * 
 * @todo add more default values with nullish coalescing,
 *  add in the constraint by date in api url 
 */


import { iNatUrl, iNatLeaderUrl } from '@/app/api/inaturalist/utils/inatUtils'
import { LatLngLiteral } from 'leaflet';
import { DisplayOptions, iNatApiResult, iNatFetchObj, iNatApiResponse, iNatUserObservation, iNatLeadingUser, Image } from '@/functions/client/collections/iNat';

export const basicFetch = async <ReturnType>(endpoint: string): Promise<ReturnType> => {
    const response: Response = await fetch(endpoint, { next: { revalidate: 86400 } })
    if (!response.ok) throw new Error('Error with fetching endpoint: ' + endpoint)

    const data: ReturnType = await response.json()

    return data
};

/**
 * @description fetches all observations, images, top identifiers and observers 
 * from the iNaturalist api
 * 
 * @param specimenName the name of the specimen to get all the data for
 * @param coordinate the center position on the map to get the surrounding data for
 * @param searchOptions the options the user can select in the {@link DisplayOptions}
 * @returns the {@link iNatApiResult} which contains all the relevant data
 */
export const fetchSpecimenObservations = async (specimenName: string, coordinate: LatLngLiteral, searchOptions: DisplayOptions): Promise<iNatApiResult> => {
    if (!specimenName || !searchOptions || !coordinate) return { observations: [], images: [], leadingUsers: { identifiers: [], observers: [] } }



    const fetchObj: iNatFetchObj = {
        specimenName: decodeURIComponent(specimenName),
        coordinate: coordinate,
        searchOptions: searchOptions,
    }
    //initial fetch logic 
    const endpoint = iNatUrl(fetchObj)

    const response: iNatApiResponse = await basicFetch<iNatApiResponse>(endpoint)

    if (!response) return { observations: [], images: [], leadingUsers: { identifiers: [], observers: [] } }

    //declaring return variables
    const observedSpecimenArray: iNatUserObservation[] = []
    const imageArray: Image[] = []


    for (const result of response.results) {
        if (!result.photos[0] || !result.geojson.coordinates)
            continue

        const image = result.photos[0]?.url.replace('square', 'large');
        const imageSmall = result.photos[0]?.url.replace('square', 'small');

        //creating the main bulk of the data to be returned in the observedSpecimenArray
        const specimenInfo: iNatUserObservation = {
            user: {
                userName: result.user.login,
                userId: result.user.id,
                userIcon: result.user.icon ?? '../../blankIcon.jpg'
            },

            //add more default values if the ?? fails
            id: result.id ?? '',
            taxon_id: result.taxon.id,
            observedDate: result.observed_on_details?.date ?? '',
            species_guess: result.species_guess ?? specimenName,
            taxon_name: result.taxon.preferred_common_name ?? specimenName,
            place_guess: result.place_guess ?? '',
            gradeType: result.quality_grade,
            coordinates: { lat: result.geojson.coordinates[0], lng: result.geojson.coordinates[1] },
            images: { original: image, thumbnail: result.photos[0].url, small: imageSmall }
        }

        pushIfValid(specimenInfo, searchOptions, imageArray, observedSpecimenArray)
    }

    //fetching the leaders
    const leadingUsers = await getLeadingUsers(fetchObj)

    return {
        observations: observedSpecimenArray,
        images: imageArray,
        leadingUsers: {
            identifiers: leadingUsers.identifiers,
            observers: leadingUsers.observers
        }
    }
}

/**
 * @description pushes the observation and its images 
 * if the search option conditions are correct
 *
 * @param observation the current observation to check
 * @param searchOptions the options the user has specified
 * @param imageArray the images of the observations to push to if valid
 * @param observedSpecimenArray the observations to push to if valid
 */
function pushIfValid(
    observation: iNatUserObservation,
    searchOptions: DisplayOptions,
    imageArray: Image[],
    observedSpecimenArray: iNatUserObservation[]) {

    const observedDate = new Date(observation.observedDate)
    const sinceDate = new Date(searchOptions.sinceDate)
    const beforeDate = new Date(searchOptions.beforeDate)


    //make sure that the amount being displayed has not gone over the specified amount
    if (!(imageArray.length < searchOptions.displayAmount))
        return

    //make sure the specimen has been observed in the correct date range
    if (searchOptions.sinceDate && observedDate < sinceDate)
        return


    if (searchOptions.beforeDate && observedDate > beforeDate)
        return

    //make sure the quality grade on the observation is what the user specified
    const validGradeTypes = searchOptions.gradeType.split(",");
    if (!validGradeTypes.includes(observation.gradeType)) {
        return
    }

    observedSpecimenArray.push(observation)
    imageArray.push(observation.images)
}


/**
 * @description helper function to get the top identifiers and observers of this specimen
 * @param fetchObj the provided specimen, location, and user options
 * @returns the top identifiers and observers
 */
const getLeadingUsers = async (fetchObj: iNatFetchObj):
    Promise<{ identifiers: iNatLeadingUser[], observers: iNatLeadingUser[] }> => {

    //create the endpoints for both leaders and identifiers
    const endpointObservers = iNatLeaderUrl(fetchObj, 'observers')
    const endpointIdentifiers = iNatLeaderUrl(fetchObj, 'identifiers')

    const responseObservers: iNatApiResponse = await basicFetch<iNatApiResponse>(endpointObservers)
    const responseIdentifiers: iNatApiResponse = await basicFetch<iNatApiResponse>(endpointIdentifiers)

    //if one of the responses is invalid return an empty array for each
    if (!responseObservers || !responseIdentifiers)
        return { identifiers: [], observers: [] }

    const leadingIdentifiers: iNatLeadingUser[] = [];
    const leadingObservers: iNatLeadingUser[] = [];

    //populate the top ten observers
    const obvResult = responseObservers.results;
    for (let i = 0; i < 10; i++) {
        const leader: iNatLeadingUser = {
            //creating the user
            user: {
                userName: obvResult[i]?.user?.login ?? '',
                userId: obvResult[i]?.user?.id ?? -1,
                userIcon: obvResult[i]?.user?.icon ?? '',
            },
            count: obvResult[i]?.observation_count ?? 0
        }
        leadingObservers.push(leader)
    }

    //populate the top ten identifiers
    const idResult = responseIdentifiers.results;
    for (let i = 0; i < 10; i++) {
        const leader: iNatLeadingUser = {
            //creating the user
            user: {
                userName: idResult[i]?.user?.login ?? '',
                userId: idResult[i]?.user?.id ?? -1,
                userIcon: idResult[i]?.user?.icon ?? '',
            },
            count: idResult[i]?.count ?? 0
        }
        leadingIdentifiers.push(leader)
    }

    return { identifiers: leadingIdentifiers, observers: leadingObservers }
}


