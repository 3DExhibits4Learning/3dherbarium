import { Dispatch } from "react"
import { CollectionsWrapperProps } from "./collections"
import { model, userSubmittal } from "@prisma/client"

import ModelAnnotations from "@/utils/ModelAnnotationsClass"

export interface CollectionsMediaObject {
    modelChecked: boolean,
    observationsChecked: boolean,
    photosChecked: boolean
}

export interface CollectionsMediaAction {
    type: 'modelChecked' | 'observationsChecked' | 'photosChecked'
}

export interface CollectionsWrapperData{
    mediaState: CollectionsMediaObject,
    mediaStateDispatch: Dispatch<CollectionsMediaAction>,
    collectionsWrapperProps: CollectionsWrapperProps,
    userModel: userSubmittal | undefined,
    
}

export interface BotanyClientType{
    type: 'activeAnnotationSetTo1' |
        "numberedActiveAnnotation" | 
        "newModelOrAnnotation" |
        "newModelClicked" | 
        "newAnnotationClicked" | 
        "newAnnotationCancelled" | 
        "setActiveAnnotationIndex" | 
        "setPosition" |
        "setRepositionEnabled" | 
        "annotationSavedOrDeleted" | 
        'setUidUndefined'
}
export interface NewModelOrAnnotation extends BotanyClientType {
    modelAnnotations: ModelAnnotations
    annotationPosition: string
}
export interface NewModelClicked extends BotanyClientType {
    model: model
}
export interface SetPosition extends BotanyClientType{
    position: string | undefined
}
export interface SetActiveAnnotationIndex extends BotanyClientType{
    index:  number | "new" | undefined
}
export type BotanyClientAction = BotanyClientType | NewModelOrAnnotation | SetPosition | SetActiveAnnotationIndex