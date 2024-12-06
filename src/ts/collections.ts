import { model } from "@prisma/client"
import { GbifResponse, GbifImageResponse } from "@/api/types"
import Herbarium from "@/utils/HerbariumClass"
import { fullAnnotation } from "@/api/types"

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
    skeletonClassName: string
}

