'use client'

import { Button } from "@heroui/react"
import { useContext } from "react"
import { AnnotationEntryContext } from "../AnnotationEntry"
import { annotationEntryContext} from "@/ts/botanist"

export default function SaveOrDeleteButtons(props:{isNew: boolean, index: number | 'new' | undefined, createAnnotation: Function, updateAnnotation: Function, deleteAnnotation: Function}) {

    const context = useContext(AnnotationEntryContext) as annotationEntryContext
    const annotationState = context.annotationState

    return <section className="flex justify-end mb-8">
        {
            props.isNew &&<Button onClick={() => props.createAnnotation()} className="text-white text-lg mr-8" isDisabled={annotationState.createDisabled}>Create Annotation</Button>
        }
        {
            !props.isNew && props.index !== 1 &&
            <div>
                <Button onClick={() => props.updateAnnotation()} className="text-white text-lg mr-2" isDisabled={annotationState.saveDisabled}>Save Changes</Button>
                <Button onClick={() => props.deleteAnnotation()} color="danger" variant="light" className="mr-2">Delete Annotation</Button>
            </div>
        }
    </section>
}