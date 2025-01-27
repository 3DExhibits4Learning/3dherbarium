/**
 * @file src/functions/client/reducers/iNat.ts
 * 
 * @fileoverview collections inat reducer
 */

/**
 * @file /src/app/reducers/MapDataReducer.ts
 * 
 * @fileoverview holds all the state that the children of the `MapClientWrapper` need
 * to use and update 
 * 
 * @todo 
 */

import { LatLngLiteral } from "leaflet"
import { DisplayOptions, MapDataState} from "@/functions/client/collections/iNat"

export type MapDataAction =
    | { type: "SET_COORDINATES"; payload: LatLngLiteral }
    | { type: "SET_ACTIVE_SECTION"; payload: string }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_API_FETCH"; payload: Partial<Pick<MapDataState, "observations" | "images" | "topIdentifiers" | "topObservers" | "loading">> }
    | { type: "SET_CREDENTIALS"; payload: Partial<Pick<MapDataState, "observer" | "observationTitle" | "observationLocation" | "observationDate" | "observationIcon" | "observationTaxon" | "observationTaxonId">> }
    | { type: "SET_DISPLAY_OPTIONS"; payload: DisplayOptions }
    | { type: "SET_ACTIVE_SPECIES"; payload: string }
    | { type: "SET_ZOOM"; payload: number}

    // Add other action types as needed

/**
 * @param state the global state of the map
 * @param action what in the state to update
 * @returns the newly updated state
 */
export default function INaturalistStateReducer(
    state: MapDataState , 
    action: MapDataAction
) : MapDataState {

        switch(action.type) {
            case "SET_ACTIVE_SPECIES":
                return {...state, activeSpecies : action.payload}
            case "SET_COORDINATES":
                return {...state, coordinates : action.payload}
            case "SET_ACTIVE_SECTION":
                return {...state, activeSection : action.payload}
            case "SET_LOADING":
                return {...state, loading : action.payload}
            case "SET_DISPLAY_OPTIONS":
                return {...state, displayOptions : action.payload}
            case "SET_ZOOM":
                return {...state, zoom : action.payload}
            case "SET_API_FETCH":
                return {...state, ...action.payload }
            case "SET_CREDENTIALS":
                return {...state, ...action.payload }
            default: 
                return state
        }
}