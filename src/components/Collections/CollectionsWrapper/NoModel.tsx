'use client'

import { CollectionsWrapperData } from "@/ts/reducer"
import { CollectionsContext } from "./CollectionsWrapper"
import { useContext, useEffect } from "react"

import OccurrenceSwiper from "../GbifSwiper"
import Inaturalist from "../iNaturalist"
import Foot from "@/components/Shared/Foot"

export default function CollectionsNoModel(props: { sizes: any, modelHeight: string }) {

    // Grab context
    const context = useContext(CollectionsContext) as CollectionsWrapperData

    // Context variables
    const mediaState = context.mediaState
    const collectionsProps = context.collectionsWrapperProps

    // Photos are the default media state here as there is obviously no model
    useEffect(() => context.mediaStateDispatch({type: 'photosChecked'}), [])

    return (
        <>
            <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: props.sizes.viewWidthInPx, margin: "0 auto !important" }}>
                {
                    mediaState.photosChecked &&
                    <div style={{ maxHeight: props.sizes.viewportHeightInPx }}>
                        <OccurrenceSwiper
                            info={collectionsProps.noModelData.images} swiperHeight={props.sizes.swiperHeight} imageHeight={props.sizes.imgHeight} />
                    </div>
                }
                {
                    mediaState.observationsChecked &&
                    <div style={{ height: "calc(100vh - 217px)", maxHeight: props.sizes.viewportHeightInPx }}>
                        <Inaturalist activeSpecies={collectionsProps.specimenName} />
                    </div>
                }
                <Foot />
            </div>
        </>
    )
}