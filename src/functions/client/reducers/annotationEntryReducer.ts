/**
 * @file src/functions/client/reducers/CollectionsMediaStateReducer.ts
 * 
 * @fileoverview simple reducer for the collections page media state (model, observations or images)
 */

'use client'

import { AnnotationEntryState } from "@/ts/botanist"
import { AnnotationEntryAction, SetAnnotationEntryFile, SetModelAnnotation, SetPhotoAnnotation, SetString, SetVideoAnnotation } from "@/ts/reducer"

/**
 * 
 * @param mediaState previous stat object (not used, but required parameter)
 * @param action dispatch action
 * @returns CollectionsMediaObject
 */
export default function annotationEntryReducer(annotationEntryState: AnnotationEntryState, action: AnnotationEntryAction): AnnotationEntryState {

    switch (action.type) {

        case 'setStringValue':

            const setStringAction = action as SetString

            return {
                ...annotationEntryState,
                [setStringAction.field]: setStringAction.value
            }

        case 'activeAnnotationIsVideo':

            const setVideoAction = action as SetVideoAnnotation
            const annotation = setVideoAction.annotation

            return {
                ...annotationEntryState,
                videoChecked: true,
                photoChecked: false,
                modelChecked: false,
                urlChecked: true,
                mediaType: 'url',
                url: annotation.url,
                length: annotation.length as string,
                imageSource: annotation.url,
                annotationTitle: setVideoAction.annotationTitle
            }

        case 'activeAnnotationIsModel':

            const setModelAction = action as SetModelAnnotation
            const modelAnnotation = setModelAction.annotation

            return {
                ...annotationEntryState,
                videoChecked: false,
                photoChecked: false,
                modelChecked: true,
                mediaType: 'model',
                modelAnnotationUid: modelAnnotation.uid,
                annotationTitle: setModelAction.annotationTitle
            }

        case 'activeAnnotationIsHostedPhoto':

            const setPhotoAction = action as SetPhotoAnnotation
            const photoAnnotation = setPhotoAction.annotation

            return {
                ...annotationEntryState,
                videoChecked: false,
                photoChecked: true,
                modelChecked: false,
                author: photoAnnotation.author,
                license: photoAnnotation.license,
                photoTitle: photoAnnotation.title as string,
                website: photoAnnotation.website as string,
                annotation: photoAnnotation.annotation,
                annotationTitle: setPhotoAction.annotationTitle,
                mediaType: 'upload',
                urlChecked: false,
                uploadChecked: true,
            }

        case 'activeAnnotationIsWebPhoto':

            const setWebPhotoAction = action as SetPhotoAnnotation
            const webPhotoAnnotation = setWebPhotoAction.annotation

            return {
                ...annotationEntryState,
                videoChecked: false,
                photoChecked: true,
                modelChecked: false,
                author: webPhotoAnnotation.author,
                license: webPhotoAnnotation.license,
                photoTitle: webPhotoAnnotation.title as string,
                website: webPhotoAnnotation.website as string,
                annotation: webPhotoAnnotation.annotation,
                annotationTitle: setWebPhotoAction.annotationTitle,
                mediaType: 'url',
                urlChecked: true,
                uploadChecked: false,
                imageSource: webPhotoAnnotation.url
            }

        case 'enableSaveAndCreate':

            return {
                ...annotationEntryState,
                createDisabled: false,
                saveDisabled: false
            }

        case 'disableSaveAndCreate':

            return {
                ...annotationEntryState,
                createDisabled: true,
                saveDisabled: true
            }

        case 'setFile':

            const setFileAction = action as SetAnnotationEntryFile

            return {
                ...annotationEntryState,
                file: setFileAction.file
            }


        default: throw new Error('Unkown dispatch type')
    }
}