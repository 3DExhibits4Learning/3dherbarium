import { fullAnnotation } from "@/api/types"
import { photo_annotation, video_annotation, model_annotation } from "@prisma/client"
import { BotanyClientAction } from "./reducer"
import { Dispatch } from "react"

export interface botanyClientContext {
    botanyState: BotanyClientState
    botanyDispatch: Dispatch<BotanyClientAction>
}

export interface BotanyClientState {
    uid: string | undefined
    annotations: fullAnnotation[] |undefined
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