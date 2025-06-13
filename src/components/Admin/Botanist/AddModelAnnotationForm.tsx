'use client'

// Default imports
import Annotation from "@/components/Admin/Botanist/AnnotationFields/Annotation"
import ModelAnnotationSelect from "@/components/Admin/Botanist/AnnotationFields/ModelAnnotationSelect"
import TextInput from "@/components/Shared/TextInput"
import dynamic from "next/dynamic"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"

// Typical imports
import { model } from "@prisma/client"
import { useContext, useEffect, useState } from "react"
import { Button } from "@heroui/react"
import { enterNewModelAnnotationIntoDb } from "@/functions/server/botanist"
import { BotanyClientContext } from "@/components/Admin/Botanist/BotanyClient"
import { botanyClientContext } from "@/ts/botanist"

// Dymamic imports
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'), { ssr: false })

// Main JSX
export default function AddModelAnnotationForm(props: { annotationModels: model[], model: { uid: string, species: string }, position: string | undefined }) {

    // Context
    const context = useContext(BotanyClientContext) as botanyClientContext

    // States
    const [title, setTitle] = useState('')
    const [uid, setUid] = useState('')
    const [annotation, setAnnotation] = useState('')
    const [saveDisabled, setSaveDisabled] = useState(true)

    // Annotation entry handler
    const enterAnnotationIntoDb = async () => dataTransferHandler(context.initializeDataTransferHandler, context.terminateDataTransferHandler, enterNewModelAnnotationIntoDb, [uid, props.model.uid, title, props.position as string, annotation], 'Adding model annotation')

    // Save enabler
    useEffect(() => setSaveDisabled(title && uid && annotation && props.position ? false : true), [title, uid, annotation, props.position])

    return <>
        {
            props.model.uid &&
            <section className="flex flex-col w-full border rounded-xl px-12 py-6">
                <p className="text-2xl text-center mb-6">New Model Annotation</p>
                <section className="flex w-full">
                    <div className="flex flex-col w-3/5 max-w-[750px] mr-12">
                        <TextInput value={title} setValue={setTitle} title='Annotation Title' required />
                        <ModelAnnotationSelect value={uid} setValue={setUid} modelAnnotations={props.annotationModels.filter(model => model.spec_name.toLowerCase() === props.model.species.toLowerCase())} />
                        <Annotation annotation={annotation} setAnnotation={setAnnotation} />
                    </div>
                    {uid && uid !== 'select' && <div className="w-4/5"><ModelViewer uid={uid} /></div>}
                </section>
                <section>
                    <div className="flex w-full justify-center mt-8"><Button isDisabled={saveDisabled} onClick={enterAnnotationIntoDb}>Add New Model Annotation</Button></div>
                </section>
            </section>
        }
    </>
}