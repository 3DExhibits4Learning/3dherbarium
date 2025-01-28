'use client'

import { setError, sketchfabApiData } from "@/ts/collections";
import { sketchfabApiReducerAction, setStringOrNumberAction, setSpecimenAction, setMobileAnnotationAction, setApiAction } from "@/ts/collections";

export default function sketchFabApiReducer(apiState: sketchfabApiData, action: sketchfabApiReducerAction): sketchfabApiData {

    switch (action.type) {

        case 'setStringOrNumber':

            const setStringAction = action as setStringOrNumberAction
            if (!(setStringAction.field || setStringAction.value)) throw Error("Action missing data")

            return {
                ...apiState,
                [setStringAction.field]: setStringAction.value
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
                mobileIndex: setMobileAction.index,
                annotationTitle: setMobileAction.title,
                annotationModalOpen: true,
            }

        case 'setApi':

            const setApiAction = action as setApiAction
            if (!(setApiAction.api)) throw Error("Action missing data")

            return {
                ...apiState,
                api: setApiAction.api
            }

        case 'setPhotoLoading':

            return {
                ...apiState,
                loadingPhoto: true,
                imgSrc: undefined
            }

        case 'photoLoaded':

            const photoLoadedAction = action as setStringOrNumberAction
            if (!(photoLoadedAction.value)) throw Error("Action missing data")

            return {
                ...apiState,
                imgSrc: photoLoadedAction.value as string,
                loadingPhoto: false
            }

        case 'openAnnotationModal':

            return {
                ...apiState,
                annotationModalOpen: true
            }

        case 'closeAnnotationModal':

            return {
                ...apiState,
                annotationModalOpen: false
            }

        case 'error':

        const errorAction = action as setError

        return{
            ...apiState,
            error: true,
            errorMessage: errorAction.errorMessage
        }

        default:
            throw Error("Unknown action type")
    }
}