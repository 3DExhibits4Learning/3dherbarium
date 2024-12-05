import { Dispatch } from "react"
import { CollectionsWrapperProps } from "./collections"

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
    collectionsWrapperProps: CollectionsWrapperProps
}