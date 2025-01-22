'use client'

import { useContext } from "react"
import { AnnotationEntryContext } from "../AnnotationEntry"
import { BotanyClientContext } from "../BotanyClient"
import { annotationEntryContext, botanyClientContext } from "@/ts/botanist"
import { model } from "@prisma/client"

import TextInput from "@/components/Shared/TextInput"
import ModelAnnotationSelect from "../AnnotationFields/ModelAnnotationSelect"
import Annotation from "../AnnotationFields/Annotation"
import dynamic from "next/dynamic"

// Dymamic imports
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'), { ssr: false })

export default function ModelAnnotation(props: { annotationModels: model[] }) {

    const context = useContext(AnnotationEntryContext) as annotationEntryContext
    const botanyContext = useContext(BotanyClientContext) as botanyClientContext
    const annotationState = context.annotationState
    const botanyState = botanyContext.botanyState

    return <>
        {
            botanyState.activeAnnotationType == 'model' &&
            <section className="flex my-12 w-full">
                <div className="flex ml-12 mt-12 flex-col w-3/5 max-w-[750px] mr-12">
                    <TextInput value={annotationState.annotationTitle as string} field='annotationTitle' title='Annotation Title' required />
                    {/* <TextInput value={modelAnnotationUid as string} setValue={setModelAnnotationUid as Dispatch<SetStateAction<string>>} title='UID' required /> */}
                    <ModelAnnotationSelect value={annotationState.modelAnnotationUid} modelAnnotations={props.annotationModels} />
                    <Annotation annotation={annotationState.annotation} />
                </div>
                {
                    annotationState.modelAnnotationUid && annotationState.modelAnnotationUid !== 'select' &&
                    <div className="w-1/3">
                        <ModelViewer uid={annotationState.modelAnnotationUid} />
                    </div>
                }
            </section>
        }
    </>
}