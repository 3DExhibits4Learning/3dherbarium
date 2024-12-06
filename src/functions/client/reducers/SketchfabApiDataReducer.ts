'use client'

import { sketchfabApiData } from "@/ts/collections";
import { action, fullAnnotation } from "@/api/types";
import Herbarium from "@/utils/HerbariumClass";

export interface setStringOrNumberAction extends action {
    field: string,
    value: string | number
}

export interface setNumberAction extends action {
    field: string,
    value: number
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

export default function sketchFabApiReducer(apiState: sketchfabApiData, action: any): sketchfabApiData {

    switch (action.type) {

        case 'setStringOrNumber':

            const setStringAction = action as setStringOrNumberAction
            if (!(setStringAction.field || setStringAction.value)) throw Error("Action missing data")

            return {
                ...apiState,
                [action.field]: action.value
            }

        case 'setSpecimen':

            const setSpecimenAction = action as setSpecimenAction
            if (!(setSpecimenAction.specimen || setSpecimenAction.annotations)) throw Error("Action missing data")

            return {
                ...apiState,
                s: setSpecimenAction.specimen,
                annotations: setSpecimenAction.annotations
            }

        case 'setMobileAnnotation':

            const setMobileAction = action as setMobileAnnotationAction
            if (!(setMobileAction.index || setMobileAction.title)) throw Error("Action missing data")

            return {
                ...apiState,
                index: setMobileAction.index,
                annotationTitle: setMobileAction.title
            }

        case 'setApi':

            const setApiAction = action as setApiAction
            if (!(setApiAction.api)) throw Error("Action missing data")

            return {
                ...apiState,
                api: setApiAction.api
            }

        default:
            throw Error("Unknown action type")
    }
}