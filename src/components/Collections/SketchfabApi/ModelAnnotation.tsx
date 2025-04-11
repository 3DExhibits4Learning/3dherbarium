/**
 * @file src/components/Collections/SketchfabApi/ModelAnnotation.tsx
 * 
 * @fileoverview annotation component for annotations that feature 3D models as the media format
 */

'use client'

// Typical imports
import { model, model_annotation, software, specimen } from "@prisma/client"
import { sketchfabApiData } from "@/ts/collections"
import { fullAnnotation } from "@/ts/types"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { useEffect, useState } from "react"
import { getAnnotationModelIncludingSpecimen } from "@/functions/server/collections"

// Default imports
import ModelAnnotation from "@/components/Collections/AnnotationModel"
import dynamic from "next/dynamic"

const MapWithPoint = dynamic(() => import('@/components/Map/MapWithPoint'))

export interface ModelIncludingSpecimenAndSoftware extends model { specimen: specimen, software: software[] }

// Main JSX
export default function ModelAnnotationMedia(props: { sketchfabApi: sketchfabApiData }) {

    // Declarations
    const sketchfabApi = props.sketchfabApi
    const annotations = sketchfabApi.annotations as fullAnnotation[]
    const annotation = annotations[sketchfabApi.index as number - 1]
    const modelAnnotation = annotation.annotation as model_annotation

    // Annotation model specimen state, fn and effect to set state
    const [modelWithSpecimen, setModelWithSpecimen] = useState<ModelIncludingSpecimenAndSoftware>()
    const setAnnotationModelSpecimenData = async () => setModelWithSpecimen(await getAnnotationModelIncludingSpecimen(modelAnnotation.uid) as ModelIncludingSpecimenAndSoftware)
    useEffect(() => { setAnnotationModelSpecimenData() }, [])

    return <>
        <div className="w-full h-[65%]" id="annotationDivMedia" style={{ display: "block" }}>
            <ModelAnnotation uid={modelAnnotation.uid} />
        </div>

        <div id="annotationDivText">
            <br></br>
            <p dangerouslySetInnerHTML={{ __html: modelAnnotation.annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
        </div>

        {
            modelWithSpecimen && modelWithSpecimen.specimen.locality && // Locality indicates that the specimen should have all other relevant data for the following conditional JSX
            <>
                <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full justify-center my-6'>
                    <p className="text-center font-medium text-xl my-1">Annotation Specimen Data </p>
                </div>
                <section className="flex w-full mb-8 min-h-[200px] h-[250px]">
                    <section className="flex flex-col justify-between w-1/2 h-full">
                        {modelWithSpecimen?.specimen.locality && <p dangerouslySetInnerHTML={{ __html: `<span style="font-weight:500;">Locality:</span> ` + toUpperFirstLetter(modelWithSpecimen?.specimen.locality) }} className='fade inline mb-1' />}
                        {modelWithSpecimen?.specimen.height && <p><span className="font-medium">*Height:</span> {modelWithSpecimen?.specimen.height} cm</p>}
                        <p className='fade'><span className="font-medium">3D Model by:</span> {modelAnnotation.modeler}</p>
                        <p className='fade'><span className="font-medium">Build Method:</span> {modelWithSpecimen.build_process}</p>
                        <p className='fade'><span className="font-medium">Build Software:</span> {...modelWithSpecimen.software.map((software, index) => index === modelWithSpecimen.software.length - 1 ? software.software : software.software + ', ')}</p>
                    </section>
                    {
                        modelWithSpecimen?.specimen.lat && modelWithSpecimen?.specimen.lng &&
                        <div className="!min-h-[250px] !h-[250px] w-1/2 flex justify-center">
                            <div className="h-full w-[300px]"><MapWithPoint position={{ lat: parseFloat(modelWithSpecimen?.specimen.lat), lng: parseFloat(modelWithSpecimen?.specimen.lng) }} /></div>
                        </div>
                    }
                </section>
            </>
        }

        {
            modelWithSpecimen && !modelWithSpecimen.specimen.locality && // Lack of locality indicates a legacy annotation model
            <>
                <p className='fade text-center mt-8 mb-1'><span className="font-medium">3D Model by:</span> {modelAnnotation.modeler}</p>
                <p className='fade text-center mb-1'><span className="font-medium">Build Method:</span> {modelWithSpecimen.build_process}</p>
                <p className='fade text-center mb-1'><span className="font-medium">Build Software:</span> {...modelWithSpecimen.software.map((software, index) => index === modelWithSpecimen.software.length - 1 ? software.software : software.software + ', ')}</p>
            </>
        }

        {!modelWithSpecimen && <p className='fade text-center mb-8'><span className="font-medium">3D Model by:</span> {modelAnnotation.modeler}</p>}
    </>
}