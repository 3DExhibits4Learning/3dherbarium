/**
 * @file src/functions/client/collections/iNat.ts
 * 
 * @fileoverview logic file for collections observations
 */

import { LatLngLiteral } from "leaflet"

//When the map first loads it will load here, If there is an error it will also load back to here
export const defaultCoordinates: LatLngLiteral = { lat: 40.8665, lng: -124.0828 }

export const userPageUrl : string = "https://www.inaturalist.org/people/"

export const observationUrl : string = "https://www.inaturalist.org/observations/"

export const observationTaxonUrl : string = "https://www.inaturalist.org/taxa/"

/**
 * The values the user can change 
 * to format their search queries
 */
export interface DisplayOptions {
    radius : number
    displayAmount : number
    beforeDate: string
    sinceDate: string
    gradeType : string
    useCurrentLocation : boolean
}

//state for the api calls

export interface iNatApiResponse {
    total_results: number
    page: number
    per_page: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results: any[]
}

//The final result that the MapClientWrapper will use
export interface iNatApiResult {
    observations : iNatUserObservation[] | []
    images : {original : string, thumbnail : string, small : string}[] | []
    leadingUsers : {identifiers : iNatLeadingUser[], observers : iNatLeadingUser[]}
}

//A single observation of the specified specimen by a user
export interface iNatUserObservation {
    id : string
    user : iNatUser
    observedDate : string
    species_guess : string
    taxon_name : string
    taxon_id : string
    place_guess : string
    coordinates : LatLngLiteral
    gradeType: string 
    images : {original : string, thumbnail : string, small : string}
}

//Represents leading user of either identifier or observation
export interface iNatLeadingUser {
    user : iNatUser
    count : number
}

//Represents a user on the inaturalist site 
export interface iNatUser {
    userName : string
    userId : number
    userIcon: string
}

//The initial search query that will be sent to the inat api
export interface iNatFetchObj {
    specimenName: string
    coordinate : LatLngLiteral  
    searchOptions: DisplayOptions
}

export interface Message {
    message: {
        to_user_id: string,
        subject: string,
        body: string
    }
}

//State for the reducers and context

export interface MapDataState {
    activeSpecies : string
    coordinates : LatLngLiteral,
    zoom: number,
    displayOptions : DisplayOptions
    activeSection : string,
    loading : boolean,
    firstLoad : boolean,
    images : Image[],
    observations : iNatUserObservation[],
    topObservers : iNatLeadingUser[],
    topIdentifiers : iNatLeadingUser[],
    observer : string,
    observationTitle : string,
    observationLocation : string,
    observationDate : string,
    observationIcon :  string,
    observationTaxon: string,
    observationTaxonId : string
}

export interface Image {
    original: string, 
    thumbnail: string, 
    small : string
}

export const MapDataInitialState: MapDataState = {
   activeSpecies: "",

    displayOptions: {
        radius : 75,
        displayAmount : 20,
        beforeDate : "",
        sinceDate : "",
        gradeType : "needs_id,research,casual",
        useCurrentLocation : false },

    coordinates: defaultCoordinates,
    zoom: 8,
    firstLoad: true,
    activeSection: "images",
    loading: false,
    images: [],
    observations: [],
    topObservers: [],
    topIdentifiers: [],
    observer: "",
    observationTitle: "",
    observationLocation: "",
    observationDate: "",
    observationIcon: "../../blankIcon.jpg",
    observationTaxon: "",
    observationTaxonId: ""
};