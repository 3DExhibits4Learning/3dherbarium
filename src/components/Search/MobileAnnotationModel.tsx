/**
 * @file src/components/Search/MobileAnnotationModel.tsx
 * 
 * @fileoverview client modal for annotation models on mobile devices
 */

// Typical imports
import { Modal, ModalBody, ModalContent } from "@nextui-org/react"
import { model, model_annotation } from "@prisma/client"
import { SetStateAction, useEffect, useState, Dispatch } from "react"
import { getAnnotationModel } from "@/functions/server/search"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { Button } from "@nextui-org/react"
import { ModelIncludingSpecimenAndSoftware } from "@/components/Collections/SketchfabApi/ModelAnnotation"

// Default imports
import dynamic from "next/dynamic"
import { getAnnotationModelIncludingSpecimen } from "@/functions/server/collections"

// Dynamic imports
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'), {ssr: false})
const MapWithPoint = dynamic(() => import("@/components/Map/MapWithPoint"))

// Main JSX
export default function MobileAnnotationModelModal(props: { isOpen: boolean, model: model, setIsOpen: Dispatch<SetStateAction<boolean>> }) {

    // Annotation model data state, loader and effect
    const [annotationModelData, setAnnotationModelData] = useState<{ model: ModelIncludingSpecimenAndSoftware, annotation: model_annotation }>()
    const loadAnnotationModelData = async () => setAnnotationModelData({
        model: await getAnnotationModelIncludingSpecimen(props.model.uid) as ModelIncludingSpecimenAndSoftware,
        annotation: await getAnnotationModel(props.model.uid) as model_annotation
    })
    useEffect(() => { loadAnnotationModelData() }, [])

    return <Modal isOpen={props.isOpen} size="full" placement="center" scrollBehavior={"inside"} hideCloseButton>
        <ModalContent>
            <ModalBody>
                <i><p className="text-center font-medium text-xl">{toUpperFirstLetter(props.model.spec_name)}</p></i>
                
                    <ModelViewer uid={props.model.uid} minHeight="50vh" />
                
                {
                    annotationModelData && <>
                        <div>
                            <p dangerouslySetInnerHTML={{ __html: annotationModelData.annotation.annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
                        </div>

                        <div className='text-[1.25rem] border-b border-t border-[#004C46] w-full'>
                            <p className="text-center font-medium text-xl my-1"> Specimen Data </p>
                        </div>

                        {
                            annotationModelData.model.specimen.lat && annotationModelData.model.specimen.lng &&
                            <div className="!min-h-[200px] w-full mb-1"><MapWithPoint position={{ lat: parseFloat(annotationModelData.model.specimen.lat), lng: parseFloat(annotationModelData.model.specimen.lng) }} /></div>
                        }

                        {
                            annotationModelData.model.specimen.locality &&
                            <p dangerouslySetInnerHTML={{ __html: `<span style="font-weight:500;">Locality:</span> ` + toUpperFirstLetter(annotationModelData.model.specimen.locality) }} className='fade inline' />
                        }

                        {annotationModelData.model.specimen.height && <p><span className="font-medium">*Specimen height:</span> {annotationModelData.model.specimen.height} cm</p>}

                        <p className='fade w-[95%]'><span className="font-medium">3D Model by:</span> {annotationModelData.annotation.modeler}</p>
                        <p className='fade w-[95%]'><span className="font-medium">Annotation by:</span> {annotationModelData.annotation.annotator}</p>
                        <p className='fade'><span className="font-medium">Build Method:</span> {annotationModelData.model.build_process}</p>
                        <p className='fade'><span className="font-medium">Build Software:</span> {...annotationModelData.model.software.map((software, index) => index === annotationModelData.model.software.length - 1 ? software.software : software.software + ', ')}</p>

                        <div className="flex justify-center my-4"><Button onClick={() => props.setIsOpen(false)}>Back to Collections</Button></div>
                    </>
                }
            
            </ModalBody>
        </ModalContent>
    </Modal>
}