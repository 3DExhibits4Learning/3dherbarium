import { model } from "@prisma/client"
import { GbifResponse, GbifImageResponse } from "@/api/types"
import { fullAnnotation } from "@/api/types"
import { action } from "@/api/types"

import Herbarium from "@/utils/HerbariumClass"

export interface CollectionsWrapperProps {
    model: model[],
    gMatch: { hasInfo: boolean, data?: GbifResponse },
    specimenName: string,
    noModelData: { title: string, images: GbifImageResponse[] }
}

export interface sketchfabApiData {
    s: Herbarium | undefined,
    annotations: fullAnnotation[] | undefined
    api: any,
    index: number | null,
    mobileIndex: number | null,
    imgSrc: string | undefined,
    annotationTitle: string,
    skeletonClassName: string,
    loadingPhoto: boolean
}

export interface setStringOrNumberAction extends action {
    field: string,
    value: string | number
}

export interface setSpecimenAction extends action {
    specimen: Herbarium
    annotations: fullAnnotation[]
}

export interface setApiAction extends action {
    api: any
}

export interface setMobileAnnotationAction extends action {
    index: number,
    title: string
}

export type sketchfabApiReducerAction = setMobileAnnotationAction | setSpecimenAction | setApiAction | setStringOrNumberAction

