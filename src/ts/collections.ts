import { model } from "@prisma/client"
import { GbifResponse, GbifImageResponse } from "@/api/types"

export interface CollectionsWrapperProps {
    model: model[],
    gMatch: { hasInfo: boolean, data?: GbifResponse },
    specimenName: string,
    noModelData: { title: string, images: GbifImageResponse[] }
}
