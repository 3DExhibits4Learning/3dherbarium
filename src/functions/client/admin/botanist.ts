/**
 * @file src/functions/client/admin/botanist.ts
 * 
 * @fileoverview botany admin logic
 */

// Typical imports
import { AnnotationEntryState, BotanyClientState } from "@/ts/botanist"
import { AnnotationEntryAction, BotanyClientAction } from "@/ts/reducer"
import { Dispatch, MutableRefObject } from "react"
import { NewModelOrAnnotation } from "@/ts/reducer"
import { photo_annotation } from "@prisma/client"
import { SetVideoAnnotation, SetModelAnnotation, SetPhotoAnnotation, SetString, SetImageSourceAndImageVisible } from "@/ts/reducer"
import { model_annotation, video_annotation } from "@prisma/client"
import { arrStrCompare } from "../shared"
import { v4 as uuidv4 } from 'uuid'

// Default imports
import ModelAnnotations from "@/functions/client/utils/ModelAnnotationsClass"

/**
 * 
 * @param context 
 * @returns 
 */
export const getIndex = (context: BotanyClientState) => {

    let index

    if (!context.numberOfAnnotations && !context.firstAnnotationPosition || context.activeAnnotationIndex === 1) index = 1
    else if (!context.numberOfAnnotations) index = 2
    else if (context.numberOfAnnotations && context.activeAnnotationIndex != 'new') index = context.activeAnnotationIndex
    else if (context.activeAnnotationIndex === 'new') index = context.numberOfAnnotations + 2
    else throw Error('Index is undefined')

    return index
}

/**
 * 
 * @param botanyState 
 * @param botanyDispatch 
 */
export const activeAnnotationIndexDispatch = (botanyState: BotanyClientState, botanyDispatch: Dispatch<BotanyClientAction>) => {
    if (botanyState.activeAnnotationIndex === 1) botanyDispatch({ type: 'activeAnnotationSetTo1' })
    else if (typeof (botanyState.activeAnnotationIndex) === 'number' && botanyState.annotations) botanyDispatch({ type: "numberedActiveAnnotation" })
}

/**
 * 
 * @param uid 
 * @param newAnnotationEnabled 
 * @param botanyDispatch 
 */
export const getAnnotationsObj = async (uid: string, newAnnotationEnabled: MutableRefObject<boolean>, botanyDispatch: Dispatch<BotanyClientAction>) => {

    // retrieve model annotations
    const modelAnnotations = await ModelAnnotations.retrieve(uid as string)

    // Fetch first annotation position, disable new annotation ref
    const annotationPosition = await fetch(`/api/annotations?uid=${uid}`, { cache: 'no-store' }).then(res => res.json()).then(json => { if (json.response) return JSON.parse(json.response); return '' })
    newAnnotationEnabled.current = false

    // Type safe dispatch object and fn call
    const uidOrAnnotationDispatchObj: NewModelOrAnnotation = { type: 'newModelOrAnnotation', modelAnnotations: modelAnnotations, annotationPosition: annotationPosition }
    botanyDispatch(uidOrAnnotationDispatchObj)
}

/**
 * 
 * @param annotation 
 * @param dispatch 
 */
export const setImgSrc = async (annotation: photo_annotation, dispatch: Dispatch<AnnotationEntryAction>) => {
    const url = annotation.url
    const path = process.env.NEXT_PUBLIC_LOCAL ? `X:${url.slice(5)}` : `public${url}`
    const setImageSourceObj: SetString = { type: 'setStringValue', field: 'imageSource', value: `/api/nfs?path=${path}` }
    dispatch(setImageSourceObj)
}


/**
 * 
 * @param annotationDispatch 
 * @param botanyState 
 * @param isNew 
 */
export const activeAnnotationChangeHandler = (annotationDispatch: Dispatch<AnnotationEntryAction>, botanyState: BotanyClientState, isNew: boolean) => {

    if (botanyState.activeAnnotationType && botanyState.activeAnnotation) {

        annotationDispatch({ type: 'setStringValue', field: 'annotationTitle', value: botanyState.activeAnnotationTitle as string })

        switch (botanyState.activeAnnotationType) {

            case 'video':
                const videoAnnotationDispatchObj: SetVideoAnnotation = { type: 'activeAnnotationIsVideo', annotation: botanyState.activeAnnotation as video_annotation, annotationTitle: botanyState.activeAnnotationTitle as string }
                annotationDispatch(videoAnnotationDispatchObj)
                break

            case 'model':
                const modelAnnotationDispatchObj: SetModelAnnotation = { type: 'activeAnnotationIsModel', annotation: botanyState.activeAnnotation as model_annotation, annotationTitle: botanyState.activeAnnotationTitle as string }
                annotationDispatch(modelAnnotationDispatchObj)
                break

            default:

                if (!isNew && (botanyState.activeAnnotation as photo_annotation).url.startsWith('/data/Herbarium')) {
                    const hostedPhotoDispatchObj: SetPhotoAnnotation = { type: 'activeAnnotationIsHostedPhoto', annotation: botanyState.activeAnnotation as photo_annotation, annotationTitle: botanyState.activeAnnotationTitle as string }
                    annotationDispatch(hostedPhotoDispatchObj)
                    setImgSrc(botanyState.activeAnnotation as photo_annotation, annotationDispatch)
                }

                else {
                    const webPhotoDispatchObj: SetPhotoAnnotation = { type: 'activeAnnotationIsHostedPhoto', annotation: botanyState.activeAnnotation as photo_annotation, annotationTitle: botanyState.activeAnnotationTitle as string }
                    annotationDispatch(webPhotoDispatchObj)
                }

                break
        }
    }
}

/**
 * 
 * @param isNew 
 * @param botanyState 
 * @param annotationState 
 * @param isNewPosition 
 * @param annotationDispatch 
 */
export const webPhotoSaveButtonEnabler = (isNew: boolean, botanyState: BotanyClientState, annotationState: AnnotationEntryState, isNewPosition: boolean, annotationDispatch: Dispatch<AnnotationEntryAction>) => {

    switch (isNew) {

        // For databased annotations
        case false:

            const caseAnnotation = botanyState.activeAnnotation as photo_annotation
            const originalValues = [botanyState.activeAnnotationTitle, caseAnnotation.url, caseAnnotation.author, caseAnnotation.license, caseAnnotation.annotation]
            const currentValues = [annotationState.annotationTitle, annotationState.url, annotationState.author, annotationState.license, annotationState.annotation]
            const originalOptionalValues = [caseAnnotation.title, caseAnnotation.website]
            const optionalValues = [annotationState.photoTitle, annotationState.website]

            if (currentValues.every(value => value) && !arrStrCompare(originalValues, currentValues) || isNewPosition || !arrStrCompare(originalOptionalValues, optionalValues)) annotationDispatch({ type: 'enableSaveAndCreate' })
            else annotationDispatch({ type: 'disableSaveAndCreate' })

            break

        // New annotations are the default
        default:

            const valueArray = [annotationState.annotationTitle, annotationState.url, annotationState.author, annotationState.license, annotationState.annotation, botanyState.position3D]

            if (valueArray.every(value => value)) annotationDispatch({ type: 'enableSaveAndCreate' })
            else annotationDispatch({ type: 'disableSaveAndCreate' })

            break
    }
}

/**
 * 
 * @param isNew 
 * @param botanyState 
 * @param annotationState 
 * @param isNewPosition 
 * @param annotationDispatch 
 */
export const hostedPhotoSaveButtonEnabler = (isNew: boolean, botanyState: BotanyClientState, annotationState: AnnotationEntryState, isNewPosition: boolean, annotationDispatch: Dispatch<AnnotationEntryAction>) => {

    switch (isNew) {

        // For databased annotations
        case false:

            const caseAnnotation = botanyState.activeAnnotation as photo_annotation
            const originalValues = [botanyState.activeAnnotationTitle, caseAnnotation.author, caseAnnotation.license, caseAnnotation.annotation]
            const currentValues = [annotationState.annotationTitle, annotationState.author, annotationState.license, annotationState.annotation]
            const originalOptionalValues = [caseAnnotation.title, caseAnnotation.website]
            const optionalValues = [annotationState.photoTitle, annotationState.website]

            if (currentValues.every(value => value) && !arrStrCompare(originalValues, currentValues) || annotationState.file || isNewPosition || !arrStrCompare(originalOptionalValues, optionalValues)) annotationDispatch({ type: 'enableSaveAndCreate' })
            else annotationDispatch({ type: 'disableSaveAndCreate' })

            break

        // New annotations are the default
        default:

            const valueArray = [annotationState.annotationTitle, annotationState.file, annotationState.author, annotationState.license, annotationState.annotation, botanyState.position3D]

            if (valueArray.every(value => value)) annotationDispatch({ type: 'enableSaveAndCreate' })
            else annotationDispatch({ type: 'disableSaveAndCreate' })

            break
    }
}

/**
 * 
 * @param isNew 
 * @param botanyState 
 * @param annotationState 
 * @param isNewPosition 
 * @param annotationDispatch 
 */
export const videoSaveButtonEnabler = (isNew: boolean, botanyState: BotanyClientState, annotationState: AnnotationEntryState, isNewPosition: boolean, annotationDispatch: Dispatch<AnnotationEntryAction>) => {

    switch (isNew) {

        case false:

            const caseAnnotation = botanyState.activeAnnotation as video_annotation
            const originalValues = [botanyState.activeAnnotationTitle, caseAnnotation.url, caseAnnotation.length, caseAnnotation.annotation]
            const currentValues = [annotationState.annotationTitle, annotationState.url, length, annotationState.annotation]

            if (currentValues.every(value => value) && !arrStrCompare(originalValues, currentValues) || isNewPosition) annotationDispatch({ type: 'enableSaveAndCreate' })
            else annotationDispatch({ type: 'disableSaveAndCreate' })

            break

        default:

            const valueArray = [annotationState.annotationTitle, annotationState.url, length, botanyState.position3D]
            if (valueArray.every(value => value)) annotationDispatch({ type: 'enableSaveAndCreate' })
            else annotationDispatch({ type: 'disableSaveAndCreate' })

            break
    }
}

/**
 * 
 * @param isNew 
 * @param botanyState 
 * @param annotationState 
 * @param isNewPosition 
 * @param annotationDispatch 
 */
export const modelSaveButtonEnabler = (isNew: boolean, botanyState: BotanyClientState, annotationState: AnnotationEntryState, isNewPosition: boolean, annotationDispatch: Dispatch<AnnotationEntryAction>) => {

    switch (isNew) {

        case false:

            const caseAnnotation = botanyState.activeAnnotation as model_annotation
            const originalValues = [botanyState.activeAnnotationTitle, caseAnnotation.uid, caseAnnotation.annotation]
            const currentValues = [annotationState.annotationTitle, annotationState.modelAnnotationUid, annotationState.annotation]

            if (currentValues.every(value => value) && !arrStrCompare(originalValues, currentValues) || isNewPosition) annotationDispatch({ type: 'enableSaveAndCreate' })
            else annotationDispatch({ type: 'disableSaveAndCreate' })

            break

        default:

            const valueArray = [annotationState.annotationTitle, annotationState.modelAnnotationUid, annotationState.annotation, botanyState.position3D]
            if (valueArray.every(value => value)) annotationDispatch({ type: 'enableSaveAndCreate' })
            else annotationDispatch({ type: 'disableSaveAndCreate' })

            break
    }
}

/**
 * 
 * @param isNew 
 * @param botanyState 
 * @param annotationState 
 * @param isNewPosition 
 * @param annotationDispatch 
 * @param index 
 */
export const createOrSaveHandler = (isNew: boolean, botanyState: BotanyClientState, annotationState: AnnotationEntryState, isNewPosition: boolean, annotationDispatch: Dispatch<AnnotationEntryAction>, index: number | 'new' | undefined) => {
    // Simple save/create handler for first annotation
    if (index === 1) if (botanyState.position3D) annotationDispatch({ type: 'enableSaveAndCreate' }); else annotationDispatch({ type: 'disableSaveAndCreate' })
    // Web based photo annotation save/create button enable handler
    else if (annotationState.annotationType === 'photo' && annotationState.mediaType === 'url') webPhotoSaveButtonEnabler(isNew, botanyState, annotationState, isNewPosition, annotationDispatch)
    // Hosted photo based annotation save/create button enable handler
    else if (annotationState.annotationType === 'photo' && annotationState.mediaType === 'upload') hostedPhotoSaveButtonEnabler(isNew, botanyState, annotationState, isNewPosition, annotationDispatch)
    // Video annotation save/create button enable handler
    else if (annotationState.annotationType === 'video') videoSaveButtonEnabler(isNew, botanyState, annotationState, isNewPosition, annotationDispatch)
    // Model based save/create button enable handler
    else if (annotationState.annotationType === 'model') modelSaveButtonEnabler(isNew, botanyState, annotationState, isNewPosition, annotationDispatch)
}

/**
 * 
 * @param index 
 * @param botanyState 
 * @param annotationState 
 * @returns 
 */
export const createAnnotation = async (index: number, botanyState: BotanyClientState, annotationState: AnnotationEntryState) => {

    const data = new FormData()

    // Simple handler for the first annotation (always taxonomy and description); sid for jira task
    if (index === 1) {

        // Form data for first annotation
        data.set('uid', botanyState.uid as string)
        data.set('position', botanyState.position3D as string)
        data.set('index', index.toString())
        data.set('sid', botanyState.sid as string)

        // Fetch route handler
        return await fetch('/api/annotations', { method: 'POST', body: data }).then(res => res.json()).then(json => json.data)
    }

    // The remaining code is for all annotations other than the first
    // Annotations table data; sid for jira task
    data.set('uid', botanyState.uid as string)
    data.set('annotation_no', index.toString())
    data.set('annotation_type', annotationState.annotationType as 'photo' | 'model' | 'video')
    data.set('position', botanyState.position3D as string)
    data.set('title', annotationState.annotationTitle as string)
    data.set('sid', botanyState.sid as string)

    // Set relevant data based on botanyState.activeAnnotationType
    switch (annotationState.annotationType) {

        case 'video':
            // Video_annotation table data
            data.set('length', annotationState.length)

            break

        case 'model':
            // Model_annotation table data
            data.set('modelAnnotationUid', annotationState.modelAnnotationUid as string)

            break

        default:
            // Photo_annotation table data
            data.set('author', annotationState.author)
            data.set('license', annotationState.license)
            data.set('annotator', 'Jazzlyn Strebel')
            if (annotationState.photoTitle) data.set('photoTitle', annotationState.photoTitle)
            if (annotationState.website) data.set('website', annotationState.website)
    }

    // Shared data (url was formerly the foreign key)
    const annotationId = uuidv4()
    data.set('annotation_id', annotationId)
    data.set('annotation', annotationState.annotation ?? '')

    if (!annotationState.file) data.set('url', annotationState.url)

    else {
        data.set('dir', `public/data/Herbarium/Annotations/${botanyState.uid}/${annotationId}`)
        data.set('path', `public/data/Herbarium/Annotations/${botanyState.uid}/${annotationId}/${annotationState.file.name}`)
        data.set('url', `/data/Herbarium/Annotations/${botanyState.uid}/${annotationId}/${annotationState.file.name}`)
    }

    // Route handler data
    data.set('mediaType', annotationState.mediaType as string)
    if (annotationState.file) data.set('file', annotationState.file as File)

    // Return fetch data
    return await fetch('/api/annotations', { method: 'POST', body: data }).then(res => res.json()).then(json => json.data)
}

/**
 * 
 * @param index 
 * @param botanyState 
 * @param annotationState 
 */
export const updateAnnotation = async (index: number, botanyState: BotanyClientState, annotationState: AnnotationEntryState) => {
    const data = new FormData()

    // Simple handler for the first annotation (always taxonomy and description); sid for jira task
    if (index == 1) {
        data.set('uid', botanyState.uid as string)
        data.set('position', botanyState.position3D as string)
        data.set('index', index.toString())
        data.set('sid', botanyState.sid as string)

        // Fetch route handler - set modal result
        return await fetch('/api/annotations', { method: 'PATCH', body: data }).then(res => res.json()).then(json => json.data)
    }

    // The remaining code is for all annotations other than the first
    // First we check for a change in annotation media
    if (botanyState.activeAnnotationType !== annotationState.annotationType) {
        data.set('mediaTransition', 'true')
        data.set('previousMedia', botanyState.activeAnnotationType as string)
    }

    // Annotations table data (for update); sid for jira task
    data.set('uid', botanyState.uid as string)
    data.set('annotation_type', annotationState.annotationType as 'photo' | 'model' | 'video')
    data.set('position', botanyState.position3D as string ?? botanyState.activeAnnotationPosition)
    data.set('title', annotationState.annotationTitle as string)
    data.set('sid', botanyState.sid as string)

    // Set relevant data based on botanyState.activeAnnotationType
    switch (botanyState.activeAnnotationType) {

        case 'video':
            // Video_annotation table data
            data.set('length', annotationState.length)

            break

        case 'model':
            // Model_annotation table data
            data.set('modelAnnotationUid', annotationState.modelAnnotationUid as string)
            console.log('MODEL CASE RAN')

            break

        default:

            // Photo_annotation table data
            data.set('author', annotationState.author)
            data.set('license', annotationState.license)
            data.set('annotator', 'Jazzlyn Strebel')
            if (annotationState.photoTitle) data.set('photoTitle', annotationState.photoTitle)
            if (annotationState.website) data.set('website', annotationState.website)
    }

    // Shared data (url was formerly the foreign key)
    // Note that the url is the url necessary from the collections page; also note the old path must be inlcuded for deletion; also note that a new id is not generated for update
    data.set('annotation_id', (botanyState.activeAnnotation as photo_annotation | video_annotation).annotation_id)
    data.set('annotation', annotationState.annotation ?? '')

    // Set url as field value when there is no file or media type is 'url'
    if (!annotationState.file || annotationState.mediaType === 'url') data.set('url', annotationState.url)

    else {

        // File data setting
        data.set('specimenName', botanyState.specimenName as string)
        data.set('dir', `public/data/Herbarium/Annotations/${botanyState.uid}/${(botanyState.activeAnnotation as photo_annotation | video_annotation).annotation_id}`)
        data.set('path', `public/data/Herbarium/Annotations/${botanyState.uid}/${(botanyState.activeAnnotation as photo_annotation | video_annotation).annotation_id}/${annotationState.file.name}`)
        data.set('url', `/data/Herbarium/Annotations/${botanyState.uid}/${(botanyState.activeAnnotation as photo_annotation | video_annotation).annotation_id}/${annotationState.file.name}`)

        // Temporary until database binaries are all eliminated/updated
        if ((botanyState.activeAnnotation as photo_annotation | video_annotation).url.startsWith('/data')) data.set('oldUrl', (botanyState.activeAnnotation as photo_annotation | video_annotation).url)
    }

    // Route handler data
    data.set('mediaType', annotationState.mediaType as string)
    if (annotationState.file) data.set('file', annotationState.file as File)

    // Fetch route handler - set modal result
    return await fetch('/api/annotations', { method: 'PATCH', body: data }).then(res => res.json()).then(json => json.data)
}

/**
 * 
 * @param botanyState 
 */
export const deleteAnnotation = async (botanyState: BotanyClientState) => {

    // Fetch obj
    const requestObj = {
        annotation_id: botanyState.activeAnnotation?.annotation_id,
        modelUid: botanyState.uid,
        path: (botanyState.activeAnnotation as photo_annotation).url?.startsWith('/data/Herbarium') ? `public/data/Herbarium/Annotations/${botanyState.uid}/${botanyState.activeAnnotation?.annotation_id}` : ''
    }

    // Fetch delete, set modal states
    return await fetch('/api/annotations', { method: 'DELETE', body: JSON.stringify(requestObj) }).then(res => res.json()).then(json => json.data)
}

export const photoVisibilityHandler = (index: number | 'new' | undefined, botanyState: BotanyClientState, annotationState: AnnotationEntryState, annotationDispatch: Dispatch<AnnotationEntryAction>, isNew: boolean) => {
    // This code shouldn't run for the first annotation
    if (index !== 1 && botanyState.activeAnnotationType !== 'model') {

        // Show the new image if a new url is entered
        if (annotationState.url && annotationState.url !== annotationState.imageSource && annotationState.mediaType === 'url') {
            const setImageSourceObj: SetString = { type: 'setStringValue', field: 'imageSource', value: annotationState.url }
            annotationDispatch(setImageSourceObj)
        }

        // Determine image visibility
        if (botanyState.activeAnnotationType === 'photo' && annotationState.mediaType === 'url' && annotationState.url) annotationDispatch({ type: 'setImageVisible' })

        // If annotation isn't new, is an upload, and there is no new file OR not new, web based and there
        else if (!isNew && annotationState.mediaType === 'upload' && (botanyState.activeAnnotation as photo_annotation).url && !annotationState.file || !isNew && annotationState.mediaType === 'url' && (botanyState.activeAnnotation as photo_annotation).url && !annotationState.url) {
            setImgSrc(botanyState.activeAnnotation as photo_annotation, annotationDispatch)
            annotationDispatch({ type: 'setImageVisible' })
        }

        else if (!isNew && annotationState.mediaType === 'upload' && (botanyState.activeAnnotation as photo_annotation).photo && !annotationState.file || !isNew && annotationState.mediaType === 'url' && (botanyState.activeAnnotation as photo_annotation).photo && !annotationState.url) {
            const base64String = Buffer.from((botanyState.activeAnnotation as photo_annotation).photo as Buffer).toString('base64');
            const dataUrl = `data:image/jpeg;base64,${base64String}`
            const setImageAndSourceObj: SetImageSourceAndImageVisible = { type: 'setImageSourceAndImageVisible', src: dataUrl }
            annotationDispatch(setImageAndSourceObj)
        }
        else annotationDispatch({ type: 'setImageInvisible' })

        if (annotationState.url.includes('https://www.youtube.com/embed/')) annotationDispatch({ type: 'setImageInvisible' })
    }
}