/**
 * @file src/components/Collections/SketchfabApi/ModelAnnotation.tsx
 * 
 * @fileoverview annotation component for annotations that feature 3D models as the media format
 */

'use client'

import { model_annotation } from "@prisma/client"
import ModelAnnotation from "../AnnotationModel"

export default function ModelAnnotationMedia(props: { sketchfabApi: any }) {

    const sketchfabApi = props.sketchfabApi
    const modelAnnotation = sketchfabApi.annotations[sketchfabApi.index - 1].annotation as model_annotation

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