import { Dispatch } from "react"
import { CollectionsWrapperProps } from "./collections"
import { model, model_annotation, photo_annotation, userSubmittal, video_annotation } from "@prisma/client"

import ModelAnnotations from "@/functions/client/utils/ModelAnnotationsClass"
import { fullUserSubmittal } from "@/ts/types"

export interface CollectionsMediaAction {
    type: 'modelChecked' | 'observationsChecked' | 'photosChecked'
}

export interface CollectionsMediaObject {
    modelChecked: boolean,
    observationsChecked: boolean,
    photosChecked: boolean,
    scale: boolean
}

export interface CollectionsWrapperData {
    mediaState: CollectionsMediaObject,
    mediaStateDispatch: Dispatch<CollectionsMediaAction>,
    collectionsWrapperProps: CollectionsWrapperProps,
    userModel: userSubmittal | undefined,

}

export interface BotanyClientType {
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
    'setUidUndefined' |
    'undefineUidAndActiveAnnotation'
}
export interface NewModelOrAnnotation extends BotanyClientType {
    modelAnnotations: ModelAnnotations
    annotationPosition: string
}
export interface NewModelClicked extends BotanyClientType {
    model: model
}
export interface SetPosition extends BotanyClientType {
    position: string | undefined
}
export interface SetActiveAnnotationIndex extends BotanyClientType {
    index: number | "new" | undefined
}
export type BotanyClientAction = BotanyClientType | NewModelOrAnnotation | SetPosition | SetActiveAnnotationIndex

export interface AnnotationEntryType {
    type: 'setStringValue' |
    "activeAnnotationChanged" |
    "activeAnnotationIsHostedPhoto" |
    "activeAnnotationIsWebPhoto" |
    "activeAnnotationIsVideo" |
    "activeAnnotationIsModel" |
    "enableSaveAndCreate" |
    "disableSaveAndCreate" |
    "setImageSourceAndImageVisible" |
    'setImageVisible' |
    'setActiveAnnotationType' | 
    'setFile' |
    'setImageInvisible' | 
    'photoRadioButtonSelected' | 
    'modelRadioButtonSelected' |
    'videoRadioButtonSelected' |
    'urlRadioButtonSelected' | 
    'uploadRadioButtonSelected' | 
    'activeAnnotationIsNew'
}
export interface SetString extends AnnotationEntryType {
    field: string
    value: string
}
export interface SetActiveAnnotationType extends AnnotationEntryType {
    annotationType: 'photo' | 'model' | 'video'
}
export interface SetPhotoAnnotation extends AnnotationEntryType {
    annotation: photo_annotation
    annotationTitle: string
}
export interface SetVideoAnnotation extends AnnotationEntryType {
    annotation: video_annotation
    annotationTitle: string
}
export interface SetModelAnnotation extends AnnotationEntryType {
    annotation: model_annotation
    annotationTitle: string
}
export interface SetAnnotationEntryFile extends AnnotationEntryType {
    file: File
}
export interface SetImageSourceAndImageVisible extends AnnotationEntryType {
    src: string
}
export type AnnotationEntryAction = AnnotationEntryType | SetString | SetActiveAnnotationType | SetPhotoAnnotation | SetVideoAnnotation | SetModelAnnotation | SetAnnotationEntryFile | SetImageSourceAndImageVisible 


