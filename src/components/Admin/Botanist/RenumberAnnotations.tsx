/**
 * @file src/components/Shared/Modals/ModalWrapper.tsx
 * 
 * @fileoverview allows annotators to reorder the annotation numbers
 */

// Typical imports
import { Button, Modal, ModalContent } from "@heroui/react"
import { Dispatch, SetStateAction, useContext, useState, useEffect } from "react"
import { AnnotationNumbers } from "@/components/Admin/Botanist/AnnotationSubcomponents/AnnotationNumber"
import { BotanyClientContext } from "@/components/Admin/Botanist/BotanyClient"
import { botanyClientContext } from "@/ts/botanist"
import { fullAnnotation } from "@/ts/types"

// Default imports
import AnnotationNumber from "@/components/Admin/Botanist/AnnotationSubcomponents/AnnotationNumber"

// Main JSX
export default function RenumberAnnotations(props: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, renumberAnnotations: Function }) {

    // Context
    const context = useContext(BotanyClientContext) as botanyClientContext
    const uid = context.botanyState.uid
    const annotations = (context.botanyState.annotations as fullAnnotation[]).filter(annotation => annotation.uid === uid)
    
    // Max number input, initial annotation numbers
    const max = annotations.length + 1
    const initialAnnotationNumbers = annotations.map(annotation => { return { id: annotation.annotation_id, no: annotation.annotation_no.toString() } })

    // States
    const [annotationNumbers, setAnnotationNumbers] = useState(initialAnnotationNumbers)
    const [saveDisabled, setSaveDisabled] = useState(false)

    // Button enabler
    useEffect(() => {
            const annotationNumbersChanged = JSON.stringify(initialAnnotationNumbers) !== JSON.stringify(annotationNumbers)
            const numbers = annotationNumbers.map(annotationNumbers => parseInt(annotationNumbers.no))
            const numbersInRange = numbers.every(number => number <= max && number > 1 && Number.isInteger(number))
            const unique = [...new Set(numbers)]
            setSaveDisabled(!(unique.length === annotationNumbers.length && annotationNumbersChanged && numbersInRange))
    }, [annotationNumbers])

    return <Modal isOpen={props.isOpen} size='xl' hideCloseButton scrollBehavior="inside" className="!max-h-[1000px] overflow-y-auto">
        <ModalContent>

            <div className="flex flex-col p-8 justify-center w-full">
                <div className="flex w-full justify-end mb-6 text-xl"><button onClick={() => props.setIsOpen(false)}>x</button></div>
                <div className="flex w-full justify-center">
                    <section className="grid grid-cols-[max-content_max-content] w-fit">
                        {
                            annotationNumbers && annotations?.map((annotation, index) => <>
                                <div className="flex border text-2xl items-center px-3 max-w-[300px] text-clip whitespace-nowrap overflow-hidden" key={index}>{annotation.title}</div>
                                <AnnotationNumber
                                    key={annotation.annotation_id}
                                    max={max.toString()}
                                    annotationNumbers={annotationNumbers}
                                    setAnnotationNumbers={setAnnotationNumbers}
                                    annotation={annotationNumbers.find(annotationNumber => annotation.annotation_id === annotationNumber.id) as AnnotationNumbers} />
                            </>)
                        }
                    </section>
                </div>
            </div>

            <div className="flex w-full justify-center p-8"><Button isDisabled={saveDisabled} onClick={() => props.renumberAnnotations(annotationNumbers)} className="w-4/5 text-white">Save Annotation Numbers</Button></div>
        </ModalContent>
    </Modal>
}