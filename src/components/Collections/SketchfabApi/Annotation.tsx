
/**
 * @file src/components/Collections/SketchfabApi/Annotation.tsx
 * 
 * @fileoverview collections annotation component parent
 */

'use client'

// Typical imports
import { fullAnnotation, GbifResponse } from "@/ts/types"
import { forwardRef, MutableRefObject } from "react"
import { sketchfabApiData } from "@/ts/collections"

// Default imports
import TaxonomyAndDescription from "./TaxAndDescription"
import PhotoAnnotation from "./PhotoAnnotation"
import VideoAnnotation from "./VideoAnnotation"
import ModelAnnotationMedia from "./ModelAnnotation"

// Main JSX
export const Annotation = forwardRef((props: { gMatch: GbifResponse, sketchfabApi: sketchfabApiData }, ref) => {

    // Declarations
    const sketchfabApi = props.sketchfabApi as sketchfabApiData
    const gMatch = props.gMatch
    const annotationDiv = ref as MutableRefObject<HTMLDivElement>
    const annotations = sketchfabApi.annotations as fullAnnotation[]
    const annotation = annotations[sketchfabApi.index as number - 1]

    return <div id="annotationDiv" ref={annotationDiv} style={{ width: "40%", backgroundColor: "black", transition: "width 1.5s", color: "#F5F3E7", zIndex: "1", overflowY: "auto", overflowX: "hidden" }}>
        {sketchfabApi.index === 0 && <TaxonomyAndDescription gMatch={gMatch} sketchfabApi={sketchfabApi} />}
        {!!sketchfabApi.index && annotation.annotation_type === 'photo' && sketchfabApi.skeletonClassName && <PhotoAnnotation sketchfabApi={sketchfabApi} />}
        {!!sketchfabApi.index && annotation.annotation_type === 'video' && <VideoAnnotation sketchfabApi={sketchfabApi} />}
        {!!sketchfabApi.index && annotation.annotation_type === 'model' && <ModelAnnotationMedia sketchfabApi={sketchfabApi} />}
    </div>
})

Annotation.displayName = 'Annotation'
export default Annotation