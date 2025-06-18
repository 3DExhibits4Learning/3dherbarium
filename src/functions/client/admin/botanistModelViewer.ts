import { BotanyClientState } from "@/ts/botanist"
import { BotanyClientAction } from "@/ts/reducer"
import { MutableRefObject, Dispatch, SetStateAction } from "react"
import { SetPosition, SetActiveAnnotationIndex } from "@/ts/reducer"
import { fullAnnotation } from "@/ts/types"

import Sketchfab from '@sketchfab/viewer-api'

/**
 * 
 * @param botanyState 
 * @param sketchfabApi 
 */
export const removeHigherAnnotations = (botanyState: BotanyClientState, sketchfabApi: any) => {
    if (typeof window === 'undefined') return
    
    else if (botanyState.annotations && botanyState.annotations.length + 1 !== botanyState.activeAnnotationIndex) {

        for (let i = botanyState.annotations.length; i >= (botanyState.activeAnnotationIndex as number); i--)

            sketchfabApi.removeAnnotation(i, (e: any) => { throw Error(e.message) })
    }
}

/**
 * 
 * @param botanyState 
 * @param sketchfabApi 
 * @param temporaryAnnotationIndex 
 */
export const replaceHigherAnnotations = (botanyState: BotanyClientState, sketchfabApi: any, temporaryAnnotationIndex: MutableRefObject<number | undefined>) => {

    if (botanyState.annotations && botanyState.annotations.length + 1 !== botanyState.activeAnnotationIndex) {

        for (let i = botanyState.activeAnnotationIndex as number - 1; i < botanyState.annotations.length; i++) {

            const position = JSON.parse(botanyState.annotations[i].position as string)

            sketchfabApi.createAnnotationFromScenePosition(position[0], position[1], position[2], `${botanyState.annotations[i].title}`, '', (e: any, index: any) => {
                if (e) throw Error(e.message)
                temporaryAnnotationIndex.current = index
            })
        }
    }
}

/**
 * 
 * @param info 
 * @param botanyState 
 * @param sketchfabApi 
 * @param temporaryAnnotationIndex 
 * @param newAnnotationEnabled 
 * @param dispatch 
 */
export const createAnnotation = (info: any, botanyState: BotanyClientState, sketchfabApi: any, temporaryAnnotationIndex: MutableRefObject<number | undefined>, newAnnotationEnabled: MutableRefObject<boolean>, dispatch: Dispatch<BotanyClientAction>) => {

    // Ensure that a new annotation is enabled
    if (newAnnotationEnabled.current) {

        // Remove previous annotation if there is a new click
        if (temporaryAnnotationIndex.current !== undefined) sketchfabApi.removeAnnotation(temporaryAnnotationIndex.current, (e: any) => { if (e) throw Error(e.message) })

        // Get camera position
        sketchfabApi.getCameraLookAt((e: any, camera: any) => {
            if (e) throw Error(e.message)

            // Create annotation
            sketchfabApi.createAnnotationFromScenePosition(info.position3D, camera.position, camera.target, '', '', (e: any, index: any) => {
                if (e) throw Error(e.message)
                temporaryAnnotationIndex.current = index
            })

            // If the click was on the 3d model (and not the background) set position/activeAnnotation data
            if (info.instanceID) {
                console.log("Info: ", info)
                const positionArray = Array.from(info.position3D)
                const positionDispatch: SetPosition = { type: "setPosition", position: JSON.stringify([positionArray, camera.position, camera.target]) }
                dispatch(positionDispatch)

                // Ensure that active annotation index is set to 'new'
                if (botanyState.activeAnnotationIndex !== 'new') { const indexDispatch: SetActiveAnnotationIndex = { type: 'setActiveAnnotationIndex', index: 'new' }; dispatch(indexDispatch) }

            }
            // If not, set position to undefined
            else { const positionDispatch: SetPosition = { type: "setPosition", position: undefined }; dispatch(positionDispatch) }
        })
    }
}

/**
 * 
 * @param info 
 * @param botanyState 
 * @param sketchfabApi 
 * @param temporaryAnnotationIndex 
 * @param dispatch 
 */
export const repositionAnnotation = (info: any, botanyState: BotanyClientState, sketchfabApi: any, temporaryAnnotationIndex: MutableRefObject<number | undefined>, dispatch: Dispatch<BotanyClientAction>) => {

    // Check if reposition is enabled
    if (botanyState.repositionEnabled) {

        // Remove higher annotations so that the current can be repositioned with all indexes remaining in tact
        removeHigherAnnotations(botanyState, sketchfabApi)

        // Remove previous annotation if there is a new click
        sketchfabApi.removeAnnotation(botanyState.activeAnnotationIndex as number - 1, (e: any) => { if (e) throw Error(e.message) })

        // Get camera position
        sketchfabApi.getCameraLookAt((e: any, camera: any) => {
            if (e) throw Error(e.message)

            // Set title if it exists (it should for all annotations other than 1)
            const potentialTitle = (botanyState.annotations as fullAnnotation[])[botanyState.activeAnnotationIndex as number - 2]?.title
            const title = potentialTitle ? potentialTitle : 'Taxonomy and Description'

            // Create annotation
            sketchfabApi.createAnnotationFromScenePosition(info.position3D, camera.position, camera.target, title, '', (e: any, index: any) => {
                if (e) throw Error(e.message)

                // Set temporary index, replace higher annotations
                temporaryAnnotationIndex.current = index
                replaceHigherAnnotations(botanyState, sketchfabApi, temporaryAnnotationIndex)
            })

            // If the click was on the 3d model (and not the background) set position/activeAnnotation data
            if (info.position3D) {
                const positionArray = Array.from(info.position3D)
                const positionDispatch: SetPosition = { type: "setPosition", position: JSON.stringify([positionArray, camera.position, camera.target]) }
                dispatch(positionDispatch)
            }

            // Else set position undefined
            else { const positionDispatch: SetPosition = { type: "setPosition", position: undefined }; dispatch(positionDispatch) }
        })
    }
}

/**
 * 
 * @param index 
 * @param dispatch 
 * @param newAnnotationEnabled 
 * @returns 
 */
export const annotationSelectHandler = (index: any, dispatch: Dispatch<BotanyClientAction>, newAnnotationEnabled: MutableRefObject<boolean>) => {
    if (newAnnotationEnabled.current) return
    else if (index !== -1) { const indexDispatch: SetActiveAnnotationIndex = { type: "setActiveAnnotationIndex", index: index + 1 }; dispatch(indexDispatch) }
}

/**
 * 
 * @param api 
 * @param botanyState 
 * @param setSketchfabApi 
 */
export const successObjFn = (api: any, botanyState: BotanyClientState, setSketchfabApi: Dispatch<SetStateAction<any>>) => {

    // Viewer initialization
    setSketchfabApi(api)
    api.current = api
    api.start()
    api.addEventListener('viewerready', () => {

        // Create the first annotation if it exists
        if (botanyState.firstAnnotationPosition) {
            api.createAnnotationFromScenePosition(botanyState.firstAnnotationPosition[0], botanyState.firstAnnotationPosition[1], botanyState.firstAnnotationPosition[2], 'Taxonomy and Description', '', (e: any, index: any) => {
                if (e) throw Error(e.message)
                console.log('Created annotation ' + index)
            })
        }

        // Create any futher annotations that exist
        if (botanyState.annotations) {

            // Iterate annotations
            for (let i in botanyState.annotations) {

                // Check for position
                if (botanyState.annotations[i].position) {

                    // Parse position string for array
                    const position = JSON.parse(botanyState.annotations[i].position)

                    // Create annotation
                    api.createAnnotationFromScenePosition(position[0], position[1], position[2], `${botanyState.annotations[i].title}`, '', (e: any, index: any) => {
                        if (e) throw Error(e.message)
                        console.log('Created annotation ' + index)
                    })
                }
            }
        }
    })
}

/**
 * 
 * @param modelViewer 
 * @param botanyState 
 * @param successObj 
 */
export const initializeViewer = (modelViewer: MutableRefObject<HTMLIFrameElement | undefined>, botanyState: BotanyClientState, successObj: any) => {
    const iframe = modelViewer.current as HTMLIFrameElement
    iframe.src = botanyState.uid as string
    const client = new Sketchfab(iframe)
    client.init(botanyState.uid, successObj)
}

/**
 * 
 * @param sketchfabApi 
 * @param temporaryAnnotationIndex 
 * @param dispatch 
 */
export const removeTemporaryAnnotation = (sketchfabApi: any, temporaryAnnotationIndex: MutableRefObject<number | undefined>, dispatch: Dispatch<BotanyClientAction>) => {

    if (sketchfabApi && temporaryAnnotationIndex.current !== undefined) {
        sketchfabApi.removeAnnotation(temporaryAnnotationIndex.current, (e: any) => { if (e) throw Error(e.message) })
        const positionDispatch: SetPosition = { type: "setPosition", position: undefined }; dispatch(positionDispatch)
    }
}

/**
 * 
 * @param sketchfabApi 
 * @param temporaryAnnotationIndex 
 * @param botanyState 
 * @param createAnnotationWrapper 
 */
export const enableCreateAnnotationListener = (sketchfabApi: any, temporaryAnnotationIndex: MutableRefObject<number | undefined>, botanyState: BotanyClientState, createAnnotationWrapper: Function) => {

    if (sketchfabApi && botanyState.newAnnotationEnabled) {
        temporaryAnnotationIndex.current = undefined
        sketchfabApi.addEventListener('click', createAnnotationWrapper, { pick: 'fast' })
    }

    else if (sketchfabApi) sketchfabApi.removeEventListener('click', createAnnotationWrapper, { pick: 'fast' })
}

export const enableReposition = (botanyState: BotanyClientState, sketchfabApi: any, repositionAnnotationWrapper: Function) => {
    if (sketchfabApi && botanyState.activeAnnotationIndex !== undefined && botanyState.activeAnnotationIndex !== 'new' && botanyState.repositionEnabled) {
        sketchfabApi.addEventListener('click', repositionAnnotationWrapper, { pick: 'fast' })
    }

    else if (sketchfabApi) sketchfabApi.removeEventListener('click', repositionAnnotationWrapper, { pick: 'fast' })
}

/**
 * 
 * @param botanyState 
 * @param sketchfabApi 
 * @param temporaryAnnotationIndex 
 */
export const repositionUncheckedHandler = (botanyState: BotanyClientState, sketchfabApi: any, temporaryAnnotationIndex: MutableRefObject<number | undefined>) => {

    if (botanyState.activeAnnotationIndex === 1) {
        temporaryAnnotationIndex.current = undefined
        removeHigherAnnotations(botanyState, sketchfabApi)
        sketchfabApi.removeAnnotation(botanyState.activeAnnotationIndex as number - 1, (err: any) => { })
        const position = botanyState.firstAnnotationPosition as string
        sketchfabApi.createAnnotationFromScenePosition(position[0], position[1], position[2], 'Placeholder', '', (err: any, index: any) => { replaceHigherAnnotations(botanyState, sketchfabApi, temporaryAnnotationIndex) })
    }

    else if (sketchfabApi && botanyState.position3D !== (botanyState.annotations as fullAnnotation[])[botanyState.activeAnnotationIndex as number - 2]?.position && !botanyState.repositionEnabled) {
        temporaryAnnotationIndex.current = undefined
        removeHigherAnnotations(botanyState, sketchfabApi)
        sketchfabApi.removeAnnotation(botanyState.activeAnnotationIndex as number - 1, (err: any) => { })
        const position = JSON.parse((botanyState.annotations as fullAnnotation[])[botanyState.activeAnnotationIndex as number - 2].position as string)
        sketchfabApi.createAnnotationFromScenePosition(position[0], position[1], position[2], 'Placeholder', '', (err: any, index: any) => { replaceHigherAnnotations(botanyState, sketchfabApi, temporaryAnnotationIndex) })
    }
}

/**
 * 
 * @param sketchfabApi 
 * @param botanyState 
 * @param annotationSelectWrapper 
 */
export const annotationSelectEventHandler = (sketchfabApi: any, botanyState: BotanyClientState, annotationSelectWrapper: Function) => {
    // Set the activeAnnotationIndex when an annotation is selected
    // Note that this event is triggered by any click, even those not on an annotation. Such events return and index of -1
    if (sketchfabApi && !botanyState.repositionEnabled) sketchfabApi.addEventListener('annotationSelect', annotationSelectWrapper)
    else if (sketchfabApi) sketchfabApi.removeEventListener('annotationSelect', annotationSelectWrapper)
}

/**
 * 
 * @param api 
 * @param firstAnnotationPosition 
 * @param annotations 
 * @param setSketchfabApi 
 */
export const addAnnotationModelViewerSuccessFn = (api: any, firstAnnotationPosition: string, annotations: fullAnnotation[], setSketchfabApi: Dispatch<SetStateAction<any>>) => {

    // Viewer initialization
    setSketchfabApi(api)
    api.start()
    api.addEventListener('viewerready', () => {
        // Parse first annotation position
        const firstAnnotationPositionArr = JSON.parse(firstAnnotationPosition)

        // Create the first annotation if it exists
        api.createAnnotationFromScenePosition(firstAnnotationPositionArr[0], firstAnnotationPositionArr[1], firstAnnotationPositionArr[2], 'Taxonomy and Description', '', (e: any, index: any) => {
            if (e) throw Error(e.message)
            console.log('Created annotation ' + index)
        })

        // Create any futher annotations that exist
        for (let i in annotations) {
            // Check for position
            if (annotations[i].position) {
                // Parse position string for array
                const position = JSON.parse(annotations[i].position)

                // Create annotation
                api.createAnnotationFromScenePosition(position[0], position[1], position[2], `${annotations[i].title}`, '', (e: any, index: any) => {
                    if (e) throw Error(e.message)
                    console.log('Created annotation ' + index)
                })
            }
        }

    })
}

/**
 * 
 * @param iframe 
 * @param uid 
 * @param successObj 
 */
export const initializeModelAnnotationAdditionViewer = (iframe: HTMLIFrameElement, uid: string, successObj: any) => {
    iframe.src = uid
    const client = new Sketchfab(iframe)
    client.init(uid, successObj)
}

/**
 * 
 * @param info 
 * @param sketchfabApi 
 * @param temporaryAnnotationIndex 
 * @param setPosition 
 */
export const addNewModelAnnotationMarker = (info: any, sketchfabApi: any, temporaryAnnotationIndex: MutableRefObject<number | undefined>, setPosition: Dispatch<SetStateAction<string>>) => {
    // Remove previous annotation if there is a new click
    if (temporaryAnnotationIndex.current !== undefined) sketchfabApi.removeAnnotation(temporaryAnnotationIndex.current, (e: any) => { if (e) throw Error(e.message) })

    // Get camera position
    sketchfabApi.getCameraLookAt((e: any, camera: any) => {

        // Create annotation
        sketchfabApi.createAnnotationFromScenePosition(info.position3D, camera.position, camera.target, '', '', (e: any, index: any) => {
            temporaryAnnotationIndex.current = index
        })

        // If the click was on the 3d model (and not the background) set position/activeAnnotation data
        if (info.instanceID) {
            console.log("Info: ", info)
            const positionArray = Array.from(info.position3D)
            setPosition(JSON.stringify([positionArray, camera.position, camera.target]))
        }
    })
}


