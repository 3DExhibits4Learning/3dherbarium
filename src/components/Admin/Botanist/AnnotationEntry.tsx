/**
 * @file src/components/Admin/Botanist/AnnotationEntry.tsx
 * 
 * @fileoverview annotation entry client for botany assistant
 */

'use client'

// Typical imports
import { useEffect, useContext, useReducer, createContext } from "react"
import { model_annotation, photo_annotation, video_annotation, model } from "@prisma/client"
import { BotanyClientContext } from "./BotanyClient"
import { annotationEntryContext, botanyClientContext, initialAnnotationEntryState } from "@/ts/botanist"
import { activeAnnotationChangeHandler, createAnnotation, createOrSaveHandler, deleteAnnotation, photoVisibilityHandler, updateAnnotation } from "@/functions/client/admin/botanist"

// Default imports
import annotationEntryReducer from "@/functions/client/reducers/annotationEntryReducer"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"
import FirstAnnotation from "./AnnotationSubcomponents/FirstAnnotation"
import RepositionAndRadio from "./AnnotationSubcomponents/RepositionAndRadio"
import PhotoAnnotation from "./AnnotationSubcomponents/PhotoAnnotation"
import VideoAnnotation from "./AnnotationSubcomponents/VideoAnnotation"
import ModelAnnotation from "./AnnotationSubcomponents/ModelAnnotation"
import CreateAndSaveButtons from '@/components/Admin/Botanist/AnnotationSubcomponents/CreateAndSaveButtons'

// Exported context
export const AnnotationEntryContext = createContext<annotationEntryContext | ''>('')

// Main JSX
export default function AnnotationEntry(props: { index: number, annotationModels: model[] }) {

    // Context
    const context = useContext(BotanyClientContext) as botanyClientContext
    const botanyState = context.botanyState
    const initializeDataTransfer = context.initializeDataTransferHandler
    const terminateDataTransfer = context.terminateDataTransferHandler

    // New annotation? New Postiion?
    const isNew = botanyState.activeAnnotationIndex === 'new' ? true : false
    const isNewPosition = botanyState.position3D !== undefined ? true : false

    // Annotation entry state object
    const annotationEntryState = initialAnnotationEntryState(botanyState.activeAnnotation as photo_annotation | model_annotation | video_annotation, botanyState.activeAnnotationType as string)

    // Reducer 
    const [annotationState, annotationDispatch] = useReducer(annotationEntryReducer, annotationEntryState)

    // Annotation CUD handlers
    const createAnnotationHandler = () => dataTransferHandler(initializeDataTransfer, terminateDataTransfer, createAnnotation, [props.index, botanyState, annotationState], 'Creating annotation')
    const updateAnnotationHandler = () => dataTransferHandler(initializeDataTransfer, terminateDataTransfer, updateAnnotation, [props.index, botanyState, annotationState], 'Updating annotation')
    const deleteAnnotationHandler = () => dataTransferHandler(initializeDataTransfer, terminateDataTransfer, deleteAnnotation, [botanyState], 'Deleting annotation')

    // Populates all relevant form fields with the corresponding data when there is an active annotation that has already been databased
    useEffect(() => activeAnnotationChangeHandler(annotationDispatch, botanyState, isNew), [botanyState.activeAnnotation]) // eslint-disable-line react-hooks/exhaustive-deps

    // Reset all fields for a new annotation
    useEffect(() => { if (botanyState.activeAnnotationIndex === 'new') annotationDispatch({ type: 'activeAnnotationIsNew' }) }, [botanyState.activeAnnotationIndex])

    // Enables the 'save changes' button for databased annoations if all required fields are populated and at least one differs from the data from the database
    // For new annotations, it enables the 'create annotation' button if all required fields are populated
    const createOrSaveDependencies = [annotationState.annotationTitle, botanyState.position3D, annotationState.url, annotationState.author, annotationState.license, annotationState.annotation, annotationState.file, length, annotationState.photoTitle, annotationState.website, annotationState.modelAnnotationUid]
    useEffect(() => createOrSaveHandler(isNew, botanyState, annotationState, isNewPosition, annotationDispatch, props.index), createOrSaveDependencies) // eslint-disable-line react-hooks/exhaustive-deps

    // Updates annotation image visibility and source
    const photoVisibiltyDependencies = [isNew, botanyState.activeAnnotationType, annotationState.mediaType, annotationState.url, botanyState.activeAnnotation, props.index, annotationState.file, annotationState.imageSource]
    useEffect(() => photoVisibilityHandler(props.index, botanyState, annotationState, annotationDispatch, isNew), photoVisibiltyDependencies)

    if (props.index === 1) return <AnnotationEntryContext.Provider value={{ annotationState, annotationDispatch }}>
        <FirstAnnotation index={props.index} updateAnnotationHandler={updateAnnotationHandler} createAnnotationHandler={createAnnotationHandler} isNew={isNew} />
    </AnnotationEntryContext.Provider>

    return <AnnotationEntryContext.Provider value={{ annotationState, annotationDispatch }}>
        <section className="w-[98%] h-fit flex flex-col border border-[#004C46] dark:border-white mt-4 ml-[1%] rounded-xl">
            <RepositionAndRadio isNew={isNew} index={props.index} />
            <section className="w-full h-fit">
                <PhotoAnnotation />
                <VideoAnnotation />
                <ModelAnnotation annotationModels={props.annotationModels} />
            </section>
            <CreateAndSaveButtons index={props.index} isNew={isNew} updateAnnotation={updateAnnotationHandler} createAnnotation={createAnnotationHandler} deleteAnnotation={deleteAnnotationHandler} />
        </section>
    </AnnotationEntryContext.Provider>
}


