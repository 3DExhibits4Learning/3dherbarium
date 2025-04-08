/**
 * @file src/components/Collections/SketchfabApi/ModelAnnotation.tsx
 * 
 * @fileoverview annotation component for annotations that feature 3D models as the media format
 */

'use client'

// Typical imports
import { model_annotation } from "@prisma/client"
import { sketchfabApiData } from "@/ts/collections"
import { fullAnnotation } from "@/ts/types"

// Default imports
import ModelAnnotation from "@/components/Collections/AnnotationModel"

// Main JSX
export default function ModelAnnotationMedia(props: { sketchfabApi: sketchfabApiData }) {

    const sketchfabApi = props.sketchfabApi
    const annotations = sketchfabApi.annotations as fullAnnotation[]
    const annotation = annotations[sketchfabApi.index as number - 1]
    const modelAnnotation = annotation.annotation as model_annotation

    return <>
        <div className="w-full h-[65%]" id="annotationDivMedia" style={{ display: "block" }}>
            <ModelAnnotation uid={modelAnnotation.uid} />
        </div>
        <div id="annotationDivText">
            <br></br>
            <p dangerouslySetInnerHTML={{ __html: modelAnnotation.annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
        </div>
        <div id="annotationDivCitation">
            <br></br>
            <p className='fade text-center w-[95%]'>Model by {modelAnnotation.modeler}</p>
        </div>
    </>
}