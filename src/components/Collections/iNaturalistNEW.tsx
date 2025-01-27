/**
 * @file src/app/components/map/MapClientWrapper.tsx
 * 
 * @fileoverview Holds the header, map, image gallery, and footer
 * 
 * @todo 
 */

"use client"
//library imports
import "react-image-gallery/styles/css/image-gallery.css"
import { createContext, useEffect, useReducer} from "react"
import {Spinner} from "@nextui-org/spinner";

//custom imports
import { MapNavbar } from "@/components/Collections/iNat/navitems/MapNavbar"
import { Footer } from "@/components/Collections/iNat/navitems/Footer"
import { LeaderBoard }  from "@/components/Collections/iNat/LeaderBoard"
import { MapImageGallery } from "@/components/Collections/iNat/MapImageGallery"
import { MapDataState, MapDataInitialState } from "@/functions/client/collections/iNat"
import { fetchCoordinates, iNatFetch} from"@/functions/client/iNat"
import MapDataReducer, { MapDataAction } from "@/functions/client/reducers/iNat"

//dynamic imports
import dynamic from 'next/dynamic'
const DynamicMap = dynamic(() => import('@/components/Collections/iNat/Map'), {
    ssr: false 
})

export interface MapContextData {
    state: MapDataState,
    dispatch: React.Dispatch<MapDataAction>
}

export const MapContext = createContext<MapContextData | ''>('');

/**
 * Wraps all the children that make up this component together
 * 
 * @returns a JSX element representing the MapClientWrapper component.
 */
export default function Inaturalist(props: { activeSpecies: string }) {
    const [state, dispatch] = useReducer(MapDataReducer, MapDataInitialState);
    
    /*
        Updates the data when the user updates their 
        search parameters or clicks somewhere else on the map. 
    */
    useEffect(() => { 


        if(state.activeSpecies == "") {
            dispatch({
                type: "SET_ACTIVE_SPECIES",
                payload: props.activeSpecies
        })
    }
         // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [state.displayOptions, state.coordinates])

    useEffect(() => {
        if (state.activeSpecies) {
            console.log("Fetching data for species:", state.activeSpecies);
            fetchCoordinates(state, dispatch);
            iNatFetch(state, dispatch);
        }
    }, [state.activeSpecies,state.displayOptions, state.coordinates]);
    
   
    return (
        <MapContext.Provider value={{state, dispatch}}>
        <MapNavbar/>

        {state.observations.length === 0 && state.loading ? (
            <div className="flex justify-center items-center w-full h-full flex-col border-2 border-pacific-blue rounded-lg">
                <Spinner size="lg" color="default" />
                <p className="mt-4 text-2xl 2xl:text-4xl">Loading</p>
            </div>

        ) : (
        <div className="flex w-full h-full overflow-y-auto">
            <section className={`h-[85%] lg:h-[95%] min-h-[600px] lg:flex justify-center items-center lg:w-1/3 ml-2 mt-4 ${state.activeSection === "locations" ? "mr-2 flex w-full" : "hidden"}`}>
                {state.loading ? (
                    <div className="flex justify-center items-center w-full h-full flex-col border-2 border-pacific-blue rounded-lg">
                        <Spinner size="lg" color="default" />
                        <p className="mt-4 text-2xl">Updating Map...</p>
                    </div>
                    ) : (
                <DynamicMap
                />
                    )}
            </section>
            
            <section className={`lg:flex min-h-[600px] lg:w-1/3 items-center justify-start w-full flex-col ${state.activeSection === "images" ? "flex" : "hidden"}`}>
               <MapImageGallery />
            </section>
    
            <section className={`lg:flex lg:w-1/3 min-h-[600px] flex-col justify-center items-center ${state.activeSection === 'leaderboard' ? 'flex w-full lg:h-full h-[90%]' : 'hidden'} text-md `}>
                <LeaderBoard identifiers={state.topIdentifiers} observers={state.topObservers} />
            </section>
        </div>
        )}
        </MapContext.Provider>
    )
}
