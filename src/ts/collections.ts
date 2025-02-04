import { model } from "@prisma/client"
import { GbifResponse, GbifImageResponse } from "@/api/types"
import { fullAnnotation } from "@/api/types"
import { Dispatch } from "react"

import Herbarium from "@/utils/HerbariumClass"

export interface CollectionsWrapperProps {
    model: model[],
    gMatch: { hasInfo: boolean, data?: GbifResponse },
    specimenName: string,
    noModelData: { title: string, images: GbifImageResponse[] }
    numberOfAnnotations: number | undefined
}

export interface sketchfabApiData {
    s: Herbarium | undefined
    annotations: fullAnnotation[] | undefined
    api: any
    index: number | null,
    mobileIndex: number | null
    imgSrc: string | undefined
    annotationTitle: string
    skeletonClassName: string
    loadingPhoto: boolean
    annotationModalOpen: boolean,
    error: boolean,
    errorMessage: string | undefined,
    annotationNumParam: string | undefined,
}

export const initialState: sketchfabApiData = {
  s: undefined, // s = specimen
  annotations: undefined,
  api: undefined,
  index: null,
  mobileIndex: null,
  imgSrc: undefined,
  annotationTitle: "",
  skeletonClassName: 'bg-black h-full hidden',
  loadingPhoto: false,
  annotationModalOpen: false,
  error: false,
  errorMessage: undefined,
  annotationNumParam: undefined,
}

export interface sketchfabApiContext {
    sketchfabApi: sketchfabApiData,
    sketchfabApiDispatch: Dispatch<any>
}

export interface action{
    type: 'setStringOrNumber' |
    'setSpecimen' |
    'setMobileAnnotation' |
    'setApi' |
    'setPhotoLoading' | 
    'photoLoaded' |
    'openAnnotationModal' |
    'closeAnnotationModal' |
    'error' 
} 
export interface setError extends action{
    errorMessage: string
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
export type sketchfabApiReducerAction = action | setMobileAnnotationAction | setSpecimenAction | setApiAction | setStringOrNumberAction | setError

