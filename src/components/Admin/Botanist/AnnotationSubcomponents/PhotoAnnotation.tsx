'use client'

import { useContext } from "react"
import { AnnotationEntryContext } from "../AnnotationEntry"
import { annotationEntryContext, botanyClientContext } from "@/ts/botanist"

import TextInput from "@/components/Shared/TextInput"
import Annotation from "../AnnotationFields/Annotation"
import FileInput from "../AnnotationFields/FileInput"
import License from "../AnnotationFields/License"

export default function PhotoAnnotation(props: {}) {

    const context = useContext(AnnotationEntryContext) as annotationEntryContext
    const annotationState = context.annotationState

    return <>
        {
            annotationState.annotationType === 'photo' && annotationState.mediaType && ['url', 'upload'].includes(annotationState.mediaType) &&
            <section className="mt-4 w-full h-fit">
                <div className="flex ">
                    <div className="flex flex-col w-1/2">
                        <div className="ml-12">
                            <TextInput value={annotationState.annotationTitle as string} field='annotationTitle' title='Annotation Title' required />
                        </div>
                        {annotationState.mediaType === 'url' &&<div className="ml-12"><TextInput value={annotationState.url as string} field='url' title='URL' required /></div>}
                        {annotationState.mediaType === 'upload' && <div className="ml-12 mb-4"><FileInput /></div>}
                        <div className="ml-12">
                            <TextInput value={annotationState.author as string} field='author' title='Author' required />
                            <License license={annotationState.license} />
                            <TextInput value={annotationState.photoTitle as string} field='photoTitle' title='Photo Title' />
                            <TextInput value={annotationState.website as string} field='website' title='Website' />
                        </div>
                    </div>
                    {
                        annotationState.imageVisible &&
                        <img className='rounded-sm inline-block w-1/2 max-w-[600px] h-full' src={annotationState.imageSource as string} alt={'Annotation Image'}></img>
                    }
                </div>
                <div className="ml-12"><Annotation annotation={annotationState.annotation} /></div>
            </section>
        }
    </>
}