/**
 * @file src/components/Admin/Botanist/AnnotationSubcomponents/VideoAnnotation.tsx
 * 
 * @fileoverview video annotation component for annotation entry of botany client
 */

'use client'

// Typical imports
import { useContext } from "react"
import { AnnotationEntryContext } from "../AnnotationEntry"
import { annotationEntryContext} from "@/ts/botanist"

// Default imports
import TextInput from "@/components/Shared/TextInput"
import Annotation from "@/components/Admin/Botanist/AnnotationFields/Annotation"

// Main JSX
export default function VideoAnnotation() {

    // Botany and annotation state contexts
    const context = useContext(AnnotationEntryContext) as annotationEntryContext
    const annotationState = context.annotationState

    return <>
        {
            annotationState.annotationType === 'video' &&
            <section className="flex my-12">
                <div className="flex ml-12 mt-12 flex-col w-1/2 max-w-[750px]">
                    <TextInput value={annotationState.annotationTitle as string} field='annotationTitle' title='Annotation Title' required />
                    <TextInput value={annotationState.url as string} field='url' title='URL' required />
                    <TextInput value={annotationState.length as string} field='length' title='Length' required />
                    <Annotation annotation={annotationState.annotation} notRequired/>
                </div>
                <div className="flex h-[50vh] w-[45%]">
                    {
                        (annotationState.imageSource?.includes('https://www.youtube.com/embed/') || annotationState.imageSource?.includes('player.pbs.org')) &&
                        <iframe src={annotationState.imageSource} className="h-full w-full ml-[1%] rounded-xl" />
                    }
                </div>
            </section>
        }
    </>
}