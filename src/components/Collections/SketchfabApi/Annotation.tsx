'use client'

import { GbifResponse } from "@/api/types"

import TaxonomyAndDescription from "./TaxAndDescription"
import PhotoAnnotation from "./PhotoAnnotation"
import VideoAnnotation from "./VideoAnnotation"
import ModelAnnotationMedia from "./ModelAnnotation"
import { forwardRef, MutableRefObject } from "react"

export const Annotation = forwardRef((props:{gMatch: GbifResponse, sketchfabApi: any}, ref) => {

    const sketchfabApi = props.sketchfabApi
    const gMatch = props.gMatch
    const annotationDiv = ref as MutableRefObject<HTMLDivElement>

    return (
        <div id="annotationDiv" ref={annotationDiv} style={{ width: "40%", backgroundColor: "black", transition: "width 1.5s", color: "#F5F3E7", zIndex: "1", overflowY: "auto", overflowX: "hidden" }}>
            {
                sketchfabApi.index == 0 &&
                <TaxonomyAndDescription gMatch={gMatch} sketchfabApi={sketchfabApi} />
            }
            {
                !!sketchfabApi.index && sketchfabApi.annotations[sketchfabApi.index - 1].annotation_type === 'photo' && sketchfabApi.skeletonClassName &&
                <PhotoAnnotation sketchfabApi={sketchfabApi} />
            }
            {
                !!sketchfabApi.index && sketchfabApi.annotations[sketchfabApi.index - 1].annotation_type === 'video' &&
                <VideoAnnotation sketchfabApi={sketchfabApi} />
            }
            {
                !!sketchfabApi.index && sketchfabApi.annotations[sketchfabApi.index - 1].annotation_type === 'model' &&
                <ModelAnnotationMedia sketchfabApi={sketchfabApi} />
            }
        </div>
    )
})

Annotation.displayName = 'Annotation'
export default Annotation