/**
 * @file src/components/Search/MobileAnnotationModel.tsx
 * 
 * @fileoverview client modal for annotation models on mobile devices
 */

// Typical imports
import { Modal, ModalBody } from "@nextui-org/react"
import { model, specimen, model_annotation } from "@prisma/client"
import { useEffect, useState } from "react"
import { getAnnotationModelData } from "@/functions/server/search"

// Default imports
import dynamic from "next/dynamic"
import Geolocation from "@/components/Collections/SketchfabApi/Geolocation"

// Dynamic imports
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'))

export default function MobileAnnotationModelModal(props: { isOpen: boolean, model: model }) {

    // Annotation model data state, loader and effect
    const [annotationModelData, setAnnotationModelData] = useState<{ annotation: model_annotation, specimen: specimen }>()
    const loadAnnotationModelData = async () => setAnnotationModelData(await getAnnotationModelData(props.model))
    useEffect(() => { loadAnnotationModelData() }, [])

    return <Modal isOpen={props.isOpen}>
        <ModalBody>
            <ModelViewer uid={props.model.uid} />
            {
                annotationModelData && <>
                    <div id="annotationDivText">
                        <br></br>
                        <p dangerouslySetInnerHTML={{ __html: annotationModelData.annotation.annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
                    </div>
                    {
                        annotationModelData.specimen.lat && annotationModelData.specimen.lng &&
                        <Geolocation position={{ lat: parseFloat(annotationModelData.specimen.lat), lng: parseFloat(annotationModelData.specimen.lng) }} locality={annotationModelData.specimen.locality} />
                    }
                    {annotationModelData.specimen.height && <p>Specimen height: {annotationModelData.specimen.height}</p>}
                    <div id="annotationDivCitation">
                        <br></br>
                        <p className='fade text-center w-[95%]'>Model by {annotationModelData.annotation.modeler}</p>
                        <p className='fade text-center w-[95%]'>Annotated by {annotationModelData.annotation.annotator}</p>
                    </div>
                </>
            }
        </ModalBody>
    </Modal>
}