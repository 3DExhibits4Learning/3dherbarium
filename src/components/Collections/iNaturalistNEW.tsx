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
import { LeaderBoard }  from "@/components/Collections/iNat/LeaderBoard"
import { MapImageGallery } from "@/components/Collections/iNat/MapImageGallery"
import { MapDataState, MapDataInitialState } from "@/functions/client/collections/iNat"
import { fetchCoordinates, iNatFetch} from"@/functions/client/iNat"
import MapDataReducer, { MapDataAction } from "@/functions/client/reducers/iNat"

//dynamic imports
import dynamic from 'next/dynamic'
const DynamicMap = dynamic(() => import('@/components/Collections/iNat/Map'), {ssr: false })

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
export default function Inaturalist(props: { activeSpecies: string, sizes: any }) {
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
            fetchCoordinates(state, dispatch);
            iNatFetch(state, dispatch);
        }
    }, [state.activeSpecies,state.displayOptions, state.coordinates]);
    
   
    return <div className="h-[calc(100vh-217px)] max-lg:h-[calc(100vh-178px)] min-h-[600px] min-w-[300px]">
    <MapContext.Provider value={{state, dispatch}}>
        <MapNavbar/>
        {
        state.observations.length === 0 && state.loading && state.firstLoad && 
            <div className="flex justify-center items-center w-full h-full flex-col">
                <Spinner size="lg" color="default" />
                <p className="mt-4 text-2xl 2xl:text-10xl">Loading Observations</p>
            </div>
        }
        <article className="flex w-full h-full overflow-y-auto">
        {
            !state.firstLoad && (
                <>
                {state.loading && !state.firstLoad && (
                    <div className="flex justify-center items-center w-full h-full flex-col">
                    <Spinner size="lg" color="default" />
                    <p className="mt-4 text-2xl">Updating Observations</p>
                    </div>
                )}

                {state.coordinates && !state.loading && (
                    <section
                    className={`h-[85%] lg:h-[95%] min-h-[500px] lg:flex justify-center items-center lg:w-1/3 mx-5 mt-4 ${
                        state.activeSection === "locations" ? "flex w-full" : "hidden"
                    }`}
                    >
                    <DynamicMap />
                    </section>
                )}
                </>
        )
        }
        {
             state.observations.length === 0 && !state.loading &&
                    <div className={`flex flex-col items-center justify-center w-full h-full text-center ml-2 ${state.activeSection === "locations" ? "hidden lg:flex" : "flex"}`}>
                        <p className="text-lg md:text-lg lg:text-xl xl:text-2xl">
                            No observations found for the selected location.
                        </p>
                        <p className="text-md md:text-md">
                            Try adjusting your search parameters or selecting a different location.
                        </p>
                    </div>                    
            }
            {
                state.observations.length > 0 && state.images && !state.loading && (
                    <>
                      <section className={`lg:flex min-h-[600px] lg:w-1/3 items-center justify-start w-full flex-col ${state.activeSection === "images" ? "flex" : "hidden"}`}>
                            <MapImageGallery />
                      </section>
    
                      <section className={`lg:flex lg:w-1/3 min-h-[600px] overflow-y-auto mx-5 flex-col justify-center items-center ${state.activeSection === 'leaderboard' ? 'flex w-full lg:h-full h-[90%] pb-12 lg:pb-0' : 'hidden'} text-md`}>
                        <LeaderBoard identifiers={state.topIdentifiers} observers={state.topObservers} />
                      </section>
                    </>
                )
            }
        </article>
        </MapContext.Provider>
        </div>
}
