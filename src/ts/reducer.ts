import { Dispatch } from "react"
import { CollectionsWrapperProps } from "./collections"
import { userSubmittal } from "@prisma/client"

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