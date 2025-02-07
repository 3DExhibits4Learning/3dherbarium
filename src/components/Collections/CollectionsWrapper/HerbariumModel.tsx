/**
 * @file src/components/Collections/CollectionsWrapper/HerbariumModel.tsx
 * 
 * @fileoverview
 */

'use client'

// Typical imports
import { CollectionsWrapperData } from "@/ts/reducer"
import { CollectionsContext } from "./CollectionsWrapper"
import { useContext } from "react"
import { annotations } from "@prisma/client"

// Default imports
import dynamic from "next/dynamic"
import OccurrenceSwiper from "../GbifSwiper"
import Inaturalist from "../iNaturalist"
import Foot from "@/components/Shared/Foot"

// Dynamic imports
const SketchfabApi = dynamic(() => import('@/components/Collections/SketchfabApi/SketchFabAPI'), { ssr: false })

// Main JSX
export default function CollectionsHerbariumModel(props: { sizes: any, modelHeight: string, numberOfAnnotations: number, annotations: annotations[] }) {

    // Context
    const context = useContext(CollectionsContext) as CollectionsWrapperData
    const mediaState = context.mediaState
    const collectionsProps = context.collectionsWrapperProps

    return <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: props.sizes.viewWidthInPx, margin: "0 auto !important" }}>
        {
            mediaState.modelChecked &&
            <div style={{ height: props.modelHeight, maxHeight: props.sizes.viewportHeightInPx }}>
                <SketchfabApi numberOfAnnotations={props.numberOfAnnotations} annotations={props.annotations} />
            </div>
        }
        {
            mediaState.photosChecked &&
            <div style={{ maxHeight: props.sizes.viewportHeightInPx }}>
                <OccurrenceSwiper
                    info={collectionsProps.noModelData.images} swiperHeight={props.sizes.swiperHeight} imageHeight={props.sizes.imgHeight} />
            </div>
        }
        {
            mediaState.observationsChecked &&
            <div style={{ height: "calc(100vh - 217px)", maxHeight: props.sizes.viewportHeightInPx, minHeight: '800px' }}>
                <Inaturalist activeSpecies={collectionsProps.specimenName} />
            </div>
        }
        <Foot />
    </div>
}