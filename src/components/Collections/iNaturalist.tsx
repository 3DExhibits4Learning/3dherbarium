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
import { MapNavbar } from "@/components/INaturalist/navitems/MapNavbar"
import { Footer } from "@/components/INaturalist/navitems/Footer"
import { LeaderBoard }  from "@/components/INaturalist/LeaderBoard"
import { fetchCoordinates, iNatFetch} from"@/functions/client/inaturalist/inaturalist"
import MapDataReducer, { MapDataAction } from "@/functions/client/reducers/INaturalistStateReducer"
import { MapImageGallery } from "@/components/INaturalist/MapImageGallery"
import { MapDataState, MapDataInitialState } from "@/ts/inaturalist"

//dynamic imports
import dynamic from 'next/dynamic'
const DynamicMap = dynamic(() => import('@/components/INaturalist/Map'), {
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
        <div className="flex w-full h-full overflow-y-auto">
            <section className={`h-[95%] min-h-[600px] lg:flex justify-center items-center lg:w-1/3 ml-2 mt-4 ${state.activeSection === "locations" ? "mr-2 flex w-full" : "hidden"}`}>
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
            
            <section className={`lg:flex min-h-[600px] lg:w-1/3 items-center justify-center w-full flex-col ${state.activeSection === "images" ? "flex" : "hidden"}`}>
               <MapImageGallery />
            </section>
    
            <section className={`lg:flex lg:w-1/3 min-h-[600px] flex-col justify-center items-center  ${state.activeSection === 'leaderboard' ? 'flex w-full' : 'hidden'} text-md`}>
                <LeaderBoard identifiers={state.topIdentifiers} observers={state.topObservers} />
            </section>
        </div>
        </MapContext.Provider>
    )

}
