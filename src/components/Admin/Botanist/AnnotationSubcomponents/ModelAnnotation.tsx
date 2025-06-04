'use client'

// Typical imports
import { useContext } from "react"
import { AnnotationEntryContext } from "../AnnotationEntry"
import { annotationEntryContext } from "@/ts/botanist"
import { model } from "@prisma/client"

// Default imports
import TextInput from "@/components/Shared/TextInput"
import ModelAnnotationSelect from "../AnnotationFields/ModelAnnotationSelect"
import Annotation from "../AnnotationFields/Annotation"
import dynamic from "next/dynamic"

// Dymamic imports
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'), { ssr: false })

// Main JSX
export default function ModelAnnotation(props: { annotationModels: model[] }) {

    // Context
    const context = useContext(AnnotationEntryContext) as annotationEntryContext
    const annotationState = context.annotationState

    return <>
        {
            annotationState.annotationType === 'model' &&
            <section className="flex my-12 w-full">
                <div className="flex ml-12 mt-12 flex-col w-3/5 max-w-[750px] mr-12">
                    <TextInput value={annotationState.annotationTitle as string} field='annotationTitle' title='Annotation Title' required />
                    <ModelAnnotationSelect value={annotationState.modelAnnotationUid} modelAnnotations={props.annotationModels} />
                    <Annotation annotation={annotationState.annotation} />
                </div>
                {annotationState.modelAnnotationUid && annotationState.modelAnnotationUid !== 'select' && <div className="w-1/3"><ModelViewer uid={annotationState.modelAnnotationUid} /></div>}
            </section>
        }
    </>
}