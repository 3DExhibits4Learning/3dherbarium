'use client'

import AnnotationReposition from "../AnnotationFields/AnnotationReposition"
import { Button } from "@heroui/react"
import { useContext } from "react"
import { AnnotationEntryContext } from "../AnnotationEntry"
import { annotationEntryContext } from "@/ts/botanist"

export default function FirstAnnotation(props: { index: number | 'new' | undefined, updateAnnotationHandler: Function, createAnnotationHandler: Function, isNew: boolean }) {

    const context = useContext(AnnotationEntryContext) as annotationEntryContext
    const annotationState = context.annotationState

    return <div className="w-[98%] h-fit flex flex-col border border-[#004C46] dark:border-white mt-4 ml-[1%] rounded-xl">
        <p className="text-2xl mb-4 mt-2 ml-12">Annotation {props.index} <span className="ml-8">(This annotation is always taxonomy and description)</span></p>
        <section className="flex justify-between mt-4 mb-8">
            {
                !props.isNew &&
                <>
                    <AnnotationReposition />
                    <div>
                        <Button onClick={() => props.updateAnnotationHandler()} className="text-white text-lg mr-12" isDisabled={annotationState.saveDisabled}>Save Changes</Button>
                    </div>
                </>
            }
            {
                props.isNew &&
                <div className="flex justify-end w-full">
                    <Button onClick={() => props.updateAnnotationHandler()} className="text-white text-lg mr-12" isDisabled={annotationState.createDisabled}>Create Annotation</Button>
                </div>
            }
        </section>
    </div>
}