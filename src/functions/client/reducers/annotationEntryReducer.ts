/**
 * @file src/functions/client/reducers/annotationEntryReducer.ts
 * 
 * @fileoverview annotation entry reducer
 */

'use client'

import { AnnotationEntryState } from "@/ts/botanist"
import { AnnotationEntryAction, SetAnnotationEntryFile, SetImageSourceAndImageVisible, SetModelAnnotation, SetPhotoAnnotation, SetString, SetVideoAnnotation } from "@/ts/reducer"

/**
 * 
 * @param annotationEntryState previous annotation entry state
 * @param action dispatch object
 * @returns next annotation entry state
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
                annotationTitle: setVideoAction.annotationTitle,
                annotationType: 'video',
                annotation: annotation.annotation ?? ''
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
                annotationTitle: setModelAction.annotationTitle,
                annotationType: 'model',
                annotation: modelAnnotation.annotation
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
                url: photoAnnotation.url,
                annotationType: 'photo'
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
                imageSource: webPhotoAnnotation.url,
                url: webPhotoAnnotation.url,
                annotationType: 'photo'
            }

        case 'activeAnnotationIsNew':

            return {
                ...annotationEntryState,
                videoChecked: false,
                photoChecked: false,
                modelChecked: false,
                author: '',
                license: '',
                photoTitle: '',
                website: '',
                annotation: '',
                annotationTitle: '',
                mediaType: undefined,
                urlChecked: false,
                uploadChecked: false,
                imageSource: undefined,
                url: '',
                annotationType: undefined
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

        case 'setImageVisible':

            return {
                ...annotationEntryState,
                imageVisible: true
            }

        case 'setImageInvisible':

            return {
                ...annotationEntryState,
                imageVisible: false
            }

        case 'setImageSourceAndImageVisible':

            const setSourceAndVisibleAction = action as SetImageSourceAndImageVisible

            return {
                ...annotationEntryState,
                imageVisible: true,
                imageSource: setSourceAndVisibleAction.src
            }

        case 'photoRadioButtonSelected':

            return {
                ...annotationEntryState,
                annotationType: 'photo',
                photoChecked: true,
                videoChecked: false,
                modelChecked: false
            }

        case 'videoRadioButtonSelected':

            return {
                ...annotationEntryState,
                annotationType: 'video',
                photoChecked: false,
                videoChecked: true,
                modelChecked: false,
                urlChecked: true,
                uploadChecked: false,
                mediaType: 'url',
            }

        case 'modelRadioButtonSelected':

            return {
                ...annotationEntryState,
                annotationType: 'model',
                photoChecked: false,
                videoChecked: false,
                modelChecked: true,
                urlChecked: false,
                uploadChecked: false,
                mediaType: 'model',
            }

        case 'urlRadioButtonSelected':

            return {
                ...annotationEntryState,
                mediaType: 'url',
                urlChecked: true,
                uploadChecked: false
            }

        case 'uploadRadioButtonSelected':

            return {
                ...annotationEntryState,
                mediaType: 'upload',
                urlChecked: false,
                uploadChecked: true
            }

        default: throw new Error('Unkown dispatch type')
    }
}