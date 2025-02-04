'use client'

import { CollectionsWrapperData } from "@/ts/reducer"
import { CollectionsContext } from "./CollectionsWrapper"
import { useContext } from "react"
import { userSubmittal } from "@prisma/client"

import OccurrenceSwiper from "../GbifSwiper"
import Inaturalist from "../iNaturalist"
import Foot from "@/components/Shared/Foot"
import CommunitySFAPI from "../CommunitySFAPI"

export default function CollectionsCommunityModel(props: { sizes: any, modelHeight: string, userModel: userSubmittal }) {

    const context = useContext(CollectionsContext) as CollectionsWrapperData
    const mediaState = context.mediaState
    const collectionsProps = context.collectionsWrapperProps

    return (
        <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: props.sizes.viewWidthInPx, margin: "0 auto !important" }}>
            {
                mediaState.modelChecked &&
                <div style={{ height: props.modelHeight, maxHeight: props.sizes.viewportHeightInPx }}>
                    <CommunitySFAPI model={props.userModel} gMatch={collectionsProps.gMatch} images={collectionsProps.noModelData.images} imageTitle={collectionsProps.noModelData.title} />
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
                <div style={{ height: "calc(100vh - 176px)", maxHeight: props.sizes.viewportHeightInPx, minHeight: '750px' }}>
                    <Inaturalist activeSpecies={collectionsProps.specimenName} />
                </div>

            }
            <Foot />
        </div>
    )
}