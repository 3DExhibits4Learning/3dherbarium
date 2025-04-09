/**
 * @file src/components/Search/MobileAnnotationModel.tsx
 * 
 * @fileoverview client modal for annotation models on mobile devices
 */

// Typical imports
import { Modal, ModalBody, ModalContent } from "@nextui-org/react"
import { model, specimen, model_annotation } from "@prisma/client"
import { useEffect, useState } from "react"
import { getAnnotationModelData } from "@/functions/server/search"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"

// Default imports
import dynamic from "next/dynamic"

// Dynamic imports
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'))
const MapWithPoint = dynamic(() => import("@/components/Map/MapWithPoint"))

// Main JSX
export default function MobileAnnotationModelModal(props: { isOpen: boolean, model: model }) {

    // Annotation model data state, loader and effect
    const [annotationModelData, setAnnotationModelData] = useState<{ annotation: model_annotation, specimen: specimen }>()
    const loadAnnotationModelData = async () => setAnnotationModelData(await getAnnotationModelData(props.model))
    useEffect(() => { loadAnnotationModelData() }, [])

    return <Modal isOpen={props.isOpen} size="full" placement="center" scrollBehavior={"inside"} hideCloseButton>
        <ModalContent>
            <ModalBody>
                <i><p className="text-center font-medium text-xl">{toUpperFirstLetter(props.model.spec_name)}</p></i>
                <ModelViewer uid={props.model.uid} minHeight="500px" />
                {
                    annotationModelData && <>
                        <div>
                            <p dangerouslySetInnerHTML={{ __html: annotationModelData.annotation.annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
                        </div>

                        <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full'>
                            <p className="text-center font-medium text-xl my-1"> Specimen Data </p>
                        </div>

                        {
                            annotationModelData.specimen.lat && annotationModelData.specimen.lng &&
                            <div className="!min-h-[200px] w-full mb-1">
                                <MapWithPoint position={{ lat: parseFloat(annotationModelData.specimen.lat), lng: parseFloat(annotationModelData.specimen.lng) }} />
                            </div>
                        }

                        {
                            annotationModelData.specimen.locality &&
                            <p dangerouslySetInnerHTML={{ __html: `<span style="font-weight:500;">Locality:</span> ` + toUpperFirstLetter(annotationModelData.specimen.locality) }} className='fade inline' />
                        }

                        {annotationModelData.specimen.height && <p><span className="font-medium">*Specimen height:</span> {annotationModelData.specimen.height} cm</p>}

                        <p className='fade w-[95%]'><span className="font-medium">3D Model by:</span> {annotationModelData.annotation.modeler}</p>
                        <p className='fade w-[95%]'><span className="font-medium">Annotation by:</span> {annotationModelData.annotation.annotator}</p>
                    </>
                }
            </ModalBody>
        </ModalContent>
    </Modal>
}