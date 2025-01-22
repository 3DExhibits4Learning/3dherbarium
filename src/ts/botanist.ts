import { fullAnnotation } from "@/api/types"
import { photo_annotation, video_annotation, model_annotation } from "@prisma/client"
import { AnnotationEntryAction, BotanyClientAction } from "./reducer"
import { Dispatch } from "react"

export interface botanyClientContext {
    botanyState: BotanyClientState
    botanyDispatch: Dispatch<BotanyClientAction>
    initializeDataTransferHandler: Function
    terminateDataTransferHandler: Function
}

export interface BotanyClientState {
    uid: string | undefined
    annotations: fullAnnotation[] | undefined
    numberOfAnnotations: number | undefined
    activeAnnotationIndex: number | 'new' | undefined
    activeAnnotation: photo_annotation | video_annotation | model_annotation | undefined
    activeAnnotationType: 'photo' | 'video' | 'model' | undefined
    position3D: string | undefined
    firstAnnotationPosition: string | undefined
    newAnnotationEnabled: boolean
    specimenName: string | undefined
    cancelledAnnotation: boolean | undefined
    activeAnnotationPosition: string | undefined
    activeAnnotationTitle: string | undefined
    repositionEnabled: boolean
    annotationSavedOrDeleted: boolean
}

export const initialBotanyClientState = {
    uid: undefined,
    annotations: undefined,
    numberOfAnnotations: undefined,
    activeAnnotationIndex: undefined,
    activeAnnotation: undefined,
    activeAnnotationType: undefined,
    position3D: undefined,
    firstAnnotationPosition: undefined,
    newAnnotationEnabled: false,
    specimenName: undefined,
    cancelledAnnotation: undefined,
    activeAnnotationPosition: undefined,
    activeAnnotationTitle: undefined,
    repositionEnabled: false,
    annotationSavedOrDeleted: false,
}

export interface AnnotationEntryState {
    photoChecked: boolean | undefined
    videoChecked: boolean | undefined
    urlChecked: boolean | undefined
    uploadChecked: boolean | undefined
    modelChecked: boolean | undefined
    mediaType: string | undefined
    imageVisible: boolean | undefined
    createDisabled: boolean
    saveDisabled: boolean
    imageSource: string | undefined
    modelAnnotationUid: string
    annotationTitle: string | undefined
    url: string,
    file: File | undefined,
    author: string,
    license: string,
    photoTitle: string,
    website: string,
    annotation: string,
    length: string,
    annotationType: string | undefined
}

export interface annotationEntryContext {
    annotationState: AnnotationEntryState,
    annotationDispatch: Dispatch<AnnotationEntryAction>
}

export const initialAnnotationEntryState = {
    photoChecked: undefined,
    videoChecked: undefined,
    urlChecked: undefined,
    uploadChecked: undefined,
    modelChecked: undefined,
    mediaType: undefined,
    imageVisible: undefined,
    createDisabled: true,
    saveDisabled: true,
    imageSource: undefined,
    modelAnnotationUid: 'select',
    annotationTitle: undefined,
    file: undefined,
}
