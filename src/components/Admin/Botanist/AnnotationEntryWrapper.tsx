'use client'

import { useContext } from "react"
import { BotanyClientContext } from "./BotanyClient"
import { botanyClientContext } from "@/ts/botanist"
import { getIndex } from "@/functions/client/admin/botanist"
import { model } from "@prisma/client"

import AnnotationEntry from "./AnnotationEntry"

export default function AnnotationEntryWrapper(props: { annotationModels: model[] }) {

    const context = useContext(BotanyClientContext) as botanyClientContext
    const botanyState = context.botanyState

    return <div className="flex flex-col w-4/5">
        <section className="flex w-full h-full flex-col">
            {
                !botanyState.uid && !botanyState.activeAnnotation &&
                <div className="flex items-center justify-center text-xl h-full w-full">
                    <p className="mr-[10%] text-lg lg:text-3xl">Select a 3D model to get started!</p>
                </div>
            }
            {
                botanyState.uid && !botanyState.activeAnnotation && botanyState.activeAnnotationIndex !== 1 && !botanyState.newAnnotationEnabled &&
                <div className="flex items-center justify-center text-xl h-full w-full">
                    <p className="mr-[10%] text-lg lg:text-3xl">Select an annotation to edit, or click New Annotation</p>
                </div>
            }
            {
                botanyState.activeAnnotationIndex && // This indicates the first annotation
                <AnnotationEntry index={getIndex(botanyState) as number} annotationModels={props.annotationModels}/>
            }
        </section>
    </div>
}