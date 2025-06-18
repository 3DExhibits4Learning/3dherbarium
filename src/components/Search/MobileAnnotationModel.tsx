/**
 * @file src/components/Search/MobileAnnotationModel.tsx
 * 
 * @fileoverview client modal for annotation models on mobile devices
 */

// Typical imports
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react"
import { model, model_annotation } from "@prisma/client"
import { SetStateAction, useEffect, useState, Dispatch } from "react"
import { getAnnotationModel } from "@/functions/server/search"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { Button } from "@heroui/react"
import { ModelIncludingSpecimenAndSoftware } from "@/components/Collections/SketchfabApi/ModelAnnotation"
import { getAnnotationModelIncludingSpecimen } from "@/functions/server/collections"

// Default imports
import dynamic from "next/dynamic"

// Dynamic imports
const ModelViewer = dynamic(() => import('@/components/Shared/AnnotationModalModelViewer'), { ssr: false })
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

    return <Modal isOpen={props.isOpen} size="full" placement="center" scrollBehavior={"inside"} hideCloseButton className="!h-[100vh] !min-h-[100vh]">
        <ModalContent>
            <ModalHeader className="flex justify-end m-0 p-0">
                <div className="flex justify-end text-lg mt-2 mr-6">
                    <button onClick={() => props.setIsOpen(false)}>x</button>
                </div>
            </ModalHeader>
            <ModalBody>

                <i><p className="text-center font-medium text-2xl">{toUpperFirstLetter(props.model.spec_name)}</p></i>
                <ModelViewer uid={props.model.uid} />

                {
                    annotationModelData && annotationModelData.model.specimen.locality && // Locality indicates that the specimen should have all other relevant data for the following contional JSX
                    <>
                        <div><p dangerouslySetInnerHTML={{ __html: annotationModelData.annotation.annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' /></div>

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

                        <p className='fade w-[95%]'><span className="font-medium">Annotation by:</span> {annotationModelData.annotation.annotator}</p>
                        <p className='fade w-[95%]'><span className="font-medium">3D Model by:</span> {annotationModelData.annotation.modeler}</p>
                        <p className='fade'><span className="font-medium">Build Method:</span> {annotationModelData.model.build_process}</p>
                        <p className='fade'><span className="font-medium">Build Software:</span> {...annotationModelData.model.software.map((software, index) => index === annotationModelData.model.software.length - 1 ? software.software : software.software + ', ')}</p>

                        <div className="flex justify-center my-8"><Button onClick={() => props.setIsOpen(false)}>Back to Collections</Button></div>
                    </>
                }

                {
                    annotationModelData && !annotationModelData?.model.specimen.locality && // Lack of locality indicates a legacy annotation model
                    <>
                        <p dangerouslySetInnerHTML={{ __html: annotationModelData.annotation.annotation }} className='m-auto pr-[3%] pl-[2%] fade border-b pb-8' />
                        <p className='fade w-[95%] mt-8'><span className="font-medium">Annotation by:</span> {annotationModelData.annotation.annotator}</p>
                        <p className='fade'><span className="font-medium">3D Model by:</span> {annotationModelData.annotation.modeler}</p>
                        <p className='fade'><span className="font-medium">Build Method:</span> {annotationModelData.model.build_process}</p>
                        <p className='fade'><span className="font-medium">Build Software:</span> {...annotationModelData.model.software.map((software, index) => index === annotationModelData.model.software.length - 1 ? software.software : software.software + ', ')}</p>

                        <div className="flex justify-center my-8"><Button onClick={() => props.setIsOpen(false)}>Back to Collections</Button></div>
                    </>
                }

            </ModalBody>
        </ModalContent>
    </Modal>
}