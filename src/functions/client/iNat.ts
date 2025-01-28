/**
 * @file /src/app/functions/mapFunctions.tsx
 * 
 * @fileoverview Contains all the functions for all Map components to use
 * 
 * @todo 
 */

import { defaultCoordinates, iNatApiResult, iNatFetchObj, iNatUserObservation, MapDataState, Message} from "@/functions/client/collections/iNat"
import { Dispatch } from "react";
import { MapDataAction } from "@/functions/client/reducers/iNat";
import { routeHandlerTypicalResponse } from "@/functions/server/response";

/**
 * @description Retrieves the user's current geographical coordinates using the browser's Geolocation API.
 * This function uses `navigator.geolocation.getCurrentPosition` to asynchronously obtain 
 * the user's longitude and latitude.
 * 
 * @returns The users current location, or on an error the default coordinates
 */
const getCoords = async (): Promise<{ longitude: number; latitude: number; }> => {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, (error) => {
            reject(new Error(`Geolocation error: ${error.message}`));
        });
    })
    
    return {
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude,
    }
};

/**
 * @description Updates the user's location based on their preference.
 * This function either fetches the user's current location using the Geolocation API 
 * (if the user has opted to use their current location) or sets the location to a provided set of coordinates.
 * 
 * @param state the global state of the map
 * @param dispatch used to update the state
 */
export const fetchCoordinates = async (
    state : MapDataState, 
    dispatch : Dispatch<MapDataAction>
    
    ) => {
        try {
            //if the user checked the use location checkbox lets find their location
            if (state.displayOptions.useCurrentLocation) {
                const coords = await getCoords()
        
                if (!state.coordinates || state.coordinates.lat !== coords.latitude || state.coordinates.lng !== coords.longitude) {
                   dispatch({ 
                    type: "SET_COORDINATES",
                    payload: {
                        lat: coords.latitude, 
                        lng: coords.longitude }})
                }
                uncheckLocationCheckbox(state,dispatch)

            } else {
                //The user clicked somewhere on the map, set the coordinates there
                dispatch({ 
                    type: "SET_COORDINATES",
                    payload: state.coordinates || defaultCoordinates,
                })
            }
        } catch (error) {
            //An error occurs usually because the user declined the use my location,
            //just set the coordinates back to default
            dispatch({
                type: "SET_COORDINATES",
                payload: defaultCoordinates,
            })

            uncheckLocationCheckbox(state,dispatch)

            console.error("Error fetching coordinates", error)
    }
}

/**
 * @description if the use my location checkbox is checked uncheck it 
 * 
 * @param state the global state of the map
 * @param dispatch used to update the state
 */
function uncheckLocationCheckbox(
    state : MapDataState, 
    dispatch : Dispatch<MapDataAction>
) {

    if (state.displayOptions.useCurrentLocation) {
        dispatch({
            type: "SET_DISPLAY_OPTIONS",
            payload: {
                ...state.displayOptions,
                useCurrentLocation: false}
            })
    }
}

/**
 * @description fetches observations and user data from the iNaturalist API and updates the corresponding state.
 * The function constructs a request object and sends it as a POST request to the API endpoint.
 * It updates the corresponding states with the data returned from the API or logs an error if the request fails.
 * 
 * @param state the global state of the map
 * @param dispatch used to update the state
 */
export const iNatFetch = async (
    state : MapDataState, 
    dispatch : Dispatch<MapDataAction>

) => {
    //Creates the data to be fetched by the API. 
    const iNatFetchObj : iNatFetchObj = {
        specimenName: state.activeSpecies ?? '',
        coordinate: state.coordinates ?? defaultCoordinates,
        searchOptions : state.displayOptions
    }

    //Disable the map from further clicking since data is about to be fetched
    dispatch({
        type: "SET_LOADING",
        payload: true
    })

    const res = await fetch('/api/inaturalist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  
        },
        body: JSON.stringify(iNatFetchObj) 
    })

    //if the response is ok put the result into the global state
    if (res.ok) {
        const json : iNatApiResult = await res.json()
        dispatch({
            type: "SET_API_FETCH",
            payload: {
                observations : json.observations,
                images : json.images,
                topIdentifiers : json.leadingUsers.identifiers,
                topObservers : json.leadingUsers.observers,
                loading : false
            }
        })

        dispatch({
            type: "SET_FIRST_LOAD",
            payload: false
        })

        console.log(state.topIdentifiers)
    } else {
        console.error("Error fetching iNaturalist data:", res.text)
    }
}

export const sendMessageToObserver = async (userToMessage : string, heading: string, content: string) => {
try{
    const res = await fetch(`/api/inaturalist/messages?username=${userToMessage}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',  
        }
    })
    
    if (res.ok) {
       const data = await res.json()
       const userToMessageId = data.userId;
        

        const messageResponse = await fetch(`/api/inaturalist/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  
            },
            body: JSON.stringify({
                    id: userToMessageId,
                    subject: heading,
                    body: content
            })
        })

            if (messageResponse.ok) {
                const responseJson = await messageResponse.json()
                console.log("Message sent successfully:", responseJson)
            } else 
                console.error("Error sending message:", await messageResponse.text())
        } else 
            console.error("Error fetching user ID:", await res.text())
    }  catch (e) {
        console.error("An error occurred:", e)
    }
}

/**
 * @description sets the credentials for the image gallery's info box 
 * about the currently displaying image. This will be called 
 * on every image change.
 * 
 * @param index the index at what observation we want to set the credentials 
 * @param state the global state of the map
 * @param dispatch used to update the state
 * 
 */
export const setCredentials = (
    index: number,
    state : MapDataState, 
    dispatch : Dispatch<MapDataAction>

) => {
    const observation = state.observations[index]

    dispatch({
        type:"SET_CREDENTIALS",
        payload: {
            observer : observation.user.userName,
            observationTitle : observation.species_guess,
            observationDate : observation.observedDate,
            observationLocation : observation.place_guess,
            observationIcon : observation.user.userIcon,
            observationTaxon : decodeURIComponent(observation.taxon_name),
            observationTaxonId : observation.taxon_id
        }
    })
}
