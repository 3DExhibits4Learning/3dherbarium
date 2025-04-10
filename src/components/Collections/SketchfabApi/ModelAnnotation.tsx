/**
 * @file src/components/Collections/SketchfabApi/ModelAnnotation.tsx
 * 
 * @fileoverview annotation component for annotations that feature 3D models as the media format
 */

'use client'

// Typical imports
import { model_annotation, specimen } from "@prisma/client"
import { sketchfabApiData } from "@/ts/collections"
import { fullAnnotation } from "@/ts/types"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { useEffect, useState } from "react"
import { getAnnotationModelSpecimen } from "@/functions/server/collections"

// Default imports
import ModelAnnotation from "@/components/Collections/AnnotationModel"
import dynamic from "next/dynamic"

const MapWithPoint = dynamic(() => import('@/components/Map/MapWithPoint'))

// Main JSX
export default function ModelAnnotationMedia(props: { sketchfabApi: sketchfabApiData }) {

    // Declarations
    const sketchfabApi = props.sketchfabApi
    const annotations = sketchfabApi.annotations as fullAnnotation[]
    const annotation = annotations[sketchfabApi.index as number - 1]
    const modelAnnotation = annotation.annotation as model_annotation

    // Annotation model specimen state, fn and effect to set state
    const [specimen, setSpecimen] = useState<specimen>()
    const setAnnotationModelSpecimenData = async () => setSpecimen(await getAnnotationModelSpecimen(modelAnnotation.uid).then(modelIncludingSpecimen => modelIncludingSpecimen?.specimen))
    useEffect(() => { setAnnotationModelSpecimenData() }, [])

    return <>
        <div className="w-full h-[65%]" id="annotationDivMedia" style={{ display: "block" }}>
            <ModelAnnotation uid={modelAnnotation.uid} />
        </div>

        <div id="annotationDivText">
            <br></br>
            <p dangerouslySetInnerHTML={{ __html: modelAnnotation.annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
        </div>

        <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full justify-center my-6'>
            <p className="text-center font-medium text-xl my-1">Specimen Data </p>
        </div>

        {
            specimen &&
            <section className="flex w-full mb-8">
                <section className="flex flex-col w-1/2">
                    {specimen.locality && <p dangerouslySetInnerHTML={{ __html: `<span style="font-weight:500;">Locality:</span> ` + toUpperFirstLetter(specimen.locality) }} className='fade inline mb-1' />}
                    {specimen.height && <p className="mb-1"><span className="font-medium">*Height:</span> {specimen.height} cm</p>}
                    <p className='fade'><span className="font-medium">3D Model by:</span> {modelAnnotation.modeler}</p>
                </section>
                {
                    specimen.lat && specimen.lng &&
                    <div className="!min-h-[200px] !h-[200px] w-1/2 mb-1 flex justify-center">
                        <div className="h-full w-[300px]">
                            <MapWithPoint position={{ lat: parseFloat(specimen.lat), lng: parseFloat(specimen.lng) }} />
                        </div>
                    </div>
                }
            </section>
        }

        {!specimen && <p className='fade text-center mb-8'><span className="font-medium">3D Model by:</span> {modelAnnotation.modeler}</p>}
    </>
}