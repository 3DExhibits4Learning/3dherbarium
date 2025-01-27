/**
 * @file /src/app/components/map/MapImageGallery.tsx
 * 
 * @fileoverview Displays the images of the currently selected location
 * on the map
 * 
 * @todo redo the css here, it is too messy and does not resize correctly
 */
"use client"
//custom imports
import { setCredentials } from "@/functions/client/iNat";
import { MapContext, MapContextData } from '@/components/Collections/iNaturalistNEW';

//library imports
import { useContext, useEffect } from "react";
import { ReactImageGalleryItem } from "react-image-gallery";
import ImageGallery from 'react-image-gallery'
import Image from "next/image";
import { observationTaxonUrl, userPageUrl } from "@/functions/client/collections/iNat";
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter";

/**
 * @returns a JSX component that holds the images of the 
 * currently viewed observations on the map
 */
export const MapImageGallery = () => { 

    //The global context being used by all child components
    const context = useContext(MapContext) as MapContextData
    const state = context.state
    const dispatch = context.dispatch

    //When the user updates their search parameters, set the credentials back to the start
    useEffect(() => { 
        if(state.observations.length > 0)
            setCredentials(0,state,dispatch)
         // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [state.displayOptions])

    return (
        <>
            {state.observations.length > 0 && (
                <>
                   
                    <p className="flex w-full h-[5%] justify-center items-center [@media(max-height:900px)]:text-lg text-xl lg:text-2xl xl:text-3xl">
                        {toUpperFirstLetter(decodeURIComponent(state.observationTitle as string))}
                    </p>

                   
                    <div
                        id="observationCredentials"
                        className="flex flex-col w-3/5 text-center items-center justify-center [@media(max-height:900px)]:text-sm text-md"
                    >
                        <p className="mt-2">
                            <img
                                className="inline-block h-[48px] w-[48px] mr-4"
                                src={state.observationIcon}
                                alt="Observer Icon"
                            />
                            {state.observer}
                        </p>
                        <p>{state.observationLocation}</p>
                        <p>{state.observationDate}</p>
                    </div>

                
                    <div className="w-3/5 h-[55%] md:w-2/5 lg:h-[65%] lg:w-[75%]">
                        <ImageGallery
                            autoPlay
                            items={state.images as ReactImageGalleryItem[]}
                            slideInterval={4000}
                            onSlide={(currentIndex) => setCredentials(currentIndex, state, dispatch)}
                            onPlay={(currentIndex) => setCredentials(currentIndex, state, dispatch)}
                        />
                    </div>
                </>
            )}
        </>
    );
};