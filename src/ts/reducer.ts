import { Dispatch } from "react"

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
    mediaStateDispatch: Dispatch<CollectionsMediaAction>
}