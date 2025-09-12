/**
 *@file  src/functions/client/collections/sketchfabApi.ts

 @fileoverview logic file corresponding to SketchFabAPI.tsx

 @todo commentary
 */

'use client'

// Typical imports
import { setViewerWidth, annotationControl } from "@/components/Collections/SketchfabDom"
import { CollectionsWrapperProps, setStringOrNumberAction, sketchfabApiData, sketchfabApiReducerAction } from "@/ts/collections"
import { MutableRefObject, Dispatch } from "react"
import { isMobileOrTablet } from "@/functions/client/utils/isMobile"
import { photo_annotation } from "@prisma/client"
import { fullAnnotation } from "@/ts/types"
import { ReadonlyURLSearchParams } from "next/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

// Default imports
import Herbarium from "@/functions/client/utils/HerbariumClass"

/**
 * 
 * @param client 
 * @param successObj 
 * @param successObjDesktop 
 * @param sRef 
 * @param props 
 * @param sketchfabApiDispatch 
 */
export const initializeCollections = (client: any, successObj: any, successObjDesktop: any, sRef: MutableRefObject<Herbarium | undefined>, props: CollectionsWrapperProps, sketchfabApiDispatch: Dispatch<sketchfabApiReducerAction>) => {
    initializeModelViewer(client, props.model[0].uid, successObj, successObjDesktop)
    instantiateHerbarium(sRef, props, sketchfabApiDispatch)
}

/**
 * 
 * @param client 
 * @param uid 
 * @param successObj 
 * @param successObjDesktop 
 */
export const initializeModelViewer = (client: any, uid: string, successObj: any, successObjDesktop: any) => {
    if (isMobileOrTablet() || window.matchMedia('(max-width: 1023.5px)').matches || window.matchMedia('(orientation: portrait)').matches) client.init(uid, successObj)
    else client.init(uid, successObjDesktop)
}

/**
 * 
 * @param sRef 
 * @param props 
 * @param dispatch 
 */
export const instantiateHerbarium = async (sRef: MutableRefObject<Herbarium | undefined>, props: CollectionsWrapperProps, dispatch: Dispatch<sketchfabApiReducerAction>) => {
    sRef.current = await Herbarium.model(props.gMatch.data?.usageKey as number, props.model[0], props.noModelData.images, props.noModelData.title).catch(e => dispatch({ type: 'error', errorMessage: e.message })) as Herbarium
    dispatch({ type: 'setSpecimen', specimen: sRef.current, annotations: sRef.current.annotations.annotations })
}

/**
 * 
 * @param sketchfabApi 
 * @param sketchfabApiDispatch 
 * @param annotationSwitch 
 * @param annotationSwitchMobile 
 * @param annotationSwitchWrapper 
 * @param mobileAnnotationSwitchWrapper 
 */
export const initializeAnnotationsAndListeners = (sketchfabApi: sketchfabApiData, sketchfabApiDispatch: Dispatch<sketchfabApiReducerAction>, annotationSwitch: HTMLInputElement, annotationSwitchMobile: HTMLInputElement, annotationSwitchWrapper: EventListener, mobileAnnotationSwitchWrapper: EventListener, annotationSelectWrapper: Function) => {

    // This block only needs to run once everything has loaded
    if (sketchfabApi.s && sketchfabApi.annotations && sketchfabApi.api) {

        // For scale implementation
        // sketchfabApi.api.getSceneGraph((e: any, result: any) => console.log('Result: ', result))

        // Create annotations and go to first annotation if client appears to be on desktop (if this a database annotated model)
        if (sketchfabApi.s.model.annotationPosition) {
            createFirstAnnotation(sketchfabApi, sketchfabApiDispatch)
            createRemainingAnnotations(sketchfabApi, sketchfabApiDispatch)
        }

        // Add both annotation switch and annotation select event listeners
        addAnnotationSwitchListeners(annotationSwitch, annotationSwitchMobile, annotationSwitchWrapper, mobileAnnotationSwitchWrapper)
        sketchfabApi.api.addEventListener('annotationSelect', annotationSelectWrapper)
    }
}

/**
 * @requires model.annotationPostion
 * @param sketchfabApi 
 */
export const createFirstAnnotation = (sketchfabApi: sketchfabApiData, dispatch: Dispatch<sketchfabApiReducerAction>) => {

    // Parse position string
    const position = JSON.parse(sketchfabApi.s?.model.annotationPosition as string)

    // Create annotation from position
    sketchfabApi.api.createAnnotationFromScenePosition(position[0], position[1], position[2], 'Taxonomy and Description', '', (e: any, index: any) => {
        if (e) dispatch({ type: 'error', errorMessage: e.message + 'Annotation', index })
    })
}

/**
 * @requires model.annotationPostion
 * @param sketchfabApi 
 */
export const createRemainingAnnotations = (sketchfabApi: sketchfabApiData, dispatch: Dispatch<sketchfabApiReducerAction>) => {

    // Declarations
    const annotations = sketchfabApi.annotations as fullAnnotation[]
    const annotationNumParam = sketchfabApi.annotationNumParam ? parseInt(sketchfabApi.annotationNumParam) : undefined

    // Iterate through the length of the annotation array
    for (let i = 0; i < annotations.length; i++) {

        // Create an annotation if an annotation has a position
        if (annotations[i].position) {
            const position = JSON.parse(annotations[i].position as string)
            sketchfabApi.api.createAnnotationFromScenePosition(position[0], position[1], position[2], `${annotations[i].title}`, '', (e: any, index: any) => {
                if (e) dispatch({ type: 'error', errorMessage: e.message + 'Annotation', index })
            })
        }
    }

    // Go to the parameterized or first annotation
    const annotationToGoTo = annotationNumParam ? annotationNumParam - 1 : 0
    if (!isMobileOrTablet()) sketchfabApi.api.gotoAnnotation(annotationToGoTo, { preventCameraAnimation: true, preventCameraMove: false }, (e: any, index: any) => {
        if (e) dispatch({ type: 'error', errorMessage: e.message + 'Annotation', index })
    })
}

/**
 * 
 * @param annotationSwitch 
 * @param annotationSwitchMobile 
 * @param annotationSwitchWrapper 
 * @param mobileAnnotationSwitchWrapper 
 */
export const addAnnotationSwitchListeners = (annotationSwitch: HTMLInputElement, annotationSwitchMobile: HTMLInputElement, annotationSwitchWrapper: EventListener, mobileAnnotationSwitchWrapper: EventListener) => {
    annotationSwitch.addEventListener("change", annotationSwitchWrapper)
    annotationSwitchMobile.addEventListener("change", mobileAnnotationSwitchWrapper)
}

/**
 * 
 * @param event Event passed from listener
 * @param sketchfabApiData sketchfab data context
 * @param modelViewer a ref to the modelViewer component
 * @param annotationDiv a ref to the div with id: 'annotatonDiv'
 * @description sets the viewer width accordingly and removes/restores annotations upon press of the annotation switch
 */
export const annotationSwitchListener = (event: Event, sketchfabApiData: sketchfabApiData, modelViewer: MutableRefObject<HTMLIFrameElement | undefined>, annotationDiv: MutableRefObject<HTMLDivElement | undefined>) => {
    setViewerWidth(modelViewer.current, annotationDiv.current, (event.target as HTMLInputElement).checked)
    annotationControl(sketchfabApiData.api, sketchfabApiData.annotations, (event.target as HTMLInputElement).checked)
}

/**
 * 
 * @param event 
 * @param sketchfabApiData 
 * @param modelViewer 
 * @param annotationDiv 
 */
export const annotationSwitchMobileListener = (event: Event, sketchfabApiData: sketchfabApiData, modelViewer: MutableRefObject<HTMLIFrameElement | undefined>, annotationDiv: MutableRefObject<HTMLDivElement | undefined>) => {
    setViewerWidth(modelViewer.current, annotationDiv.current, (event.target as HTMLInputElement).checked)
    annotationControl(sketchfabApiData.api, sketchfabApiData.annotations, (event.target as HTMLInputElement).checked)
}

/**
 * 
 * @param index 
 * @param sketchfabApi 
 * @param sketchfabApiDispatch 
 * @param params 
 * @param path 
 * @param router 
 */
export const annotationSelectHandler = (index: number, sketchfabApi: any, sketchfabApiDispatch: Dispatch<sketchfabApiReducerAction>, params: ReadonlyURLSearchParams, path: string, router: AppRouterInstance, uid: string) => {

    const mediaQueryWidth = window.matchMedia('(max-width: 1023.5px)')
    const mediaQueryOrientation = window.matchMedia('(orientation: portrait)')

    if (index !== -1) {
        sketchfabApiDispatch({ type: 'setStringOrNumber', field: 'index', value: index })
        replaceAnnotationNumberInPath(index + 1, params, path, router)
    }

    // Mobile annotation state management
    if (index !== -1 && mediaQueryWidth.matches || index !== -1 && mediaQueryOrientation.matches) {
        sketchfabApiDispatch({ type: 'openAnnotationModal' })
        sketchfabApi.getAnnotation(index, function (err: any, information: any) { if (!err) sketchfabApiDispatch({ type: 'setMobileAnnotation', index: index, title: information.name }) })
    }
}

/**
 * 
 * @param annotationNumber 
 */
export const replaceAnnotationNumberInPath = (annotationNumber: number, params: ReadonlyURLSearchParams, path: string, router: AppRouterInstance) => {
    const writeParams = new URLSearchParams(params)
    writeParams.set('annotation', annotationNumber.toString())
    router.replace(`${path}?${writeParams.toString()}`)
}

/**
 * 
 * @param sketchfabApi 
 * @returns 
 */
export const isAnnotationParamValid = (param: string, numberOfAnnotations: number) => {
    const re = /[1-9]+/
    if (re.test(param) && parseInt(param) <= numberOfAnnotations + 1) return true
    return false
}

/**
 * 
 * @param sketchfabApi context data from SketchFabApi
 * @description will be deprecated after all photos are transitioned to data storage
 * @returns boolean indicating whether or not a photo has been retrievd from the NFS data storage container
 */
export const isDataStoragePhoto = (sketchfabApi: sketchfabApiData) => (sketchfabApi.annotations as fullAnnotation[])[sketchfabApi.index as number - 1].url?.startsWith('/data')

/**
 * 
 * @param url 
 * @param dispatch 
 */
export const setImageFromNfs = async (url: string, dispatch: Dispatch<sketchfabApiReducerAction>) => {

    // Declare src variable, set loading state true 
    var src; dispatch({ type: 'setPhotoLoading' })

    // Get appropriate path and await buffer
    const path = process.env.NEXT_PUBLIC_LOCAL === 'true' ? process.env.NEXT_PUBLIC_MAC ? `/Users/ab632/X/data${url.slice(5)}` : `X:${url.slice(5)}` : `public${url}`
    const response = await fetch(`/api/nfs?path=${path}`)

    // If buffer is found, convert to blob and create object url, else use default photo (not found)
    if (!response.ok) src = '/noImage.png'
    else { const blob = await response.blob(); src = URL.createObjectURL(blob) }

    // Dispatch new image src, set loading state false
    const action: setStringOrNumberAction = { type: 'photoLoaded', field: 'imgSrc', value: src }; dispatch(action)
}

/**
 * 
 * @param sketchfabApi 
 * @param sketchfabApiDispatch 
 */
export const photoSrcChangeHandler = (sketchfabApi: any, sketchfabApiDispatch: Dispatch<sketchfabApiReducerAction>) => {

    if (!!sketchfabApi.index && sketchfabApi.annotations && sketchfabApi.annotations[sketchfabApi.index - 1].annotation_type === 'photo') {

        if (isDataStoragePhoto(sketchfabApi)) {setImageFromNfs((sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation)?.url, sketchfabApiDispatch)}
        else {sketchfabApiDispatch({ type: 'setStringOrNumber', field: 'imgSrc', value: sketchfabApi.annotations[sketchfabApi.index - 1].url as string }); console.log('ELSE RAN')}
    }
}

/**
 * @deprecated (all legacy annotations have been updated)
 * @param annotations 
 * @param uid 
 */
export const updateLegacyAnnotations = (annotations: any[], uid: string) => {

    const data: {uid: string, annotations: any} = { uid: uid, annotations: [] }
    
    annotations.every(annotation => data.annotations.push({title: annotation.name, position: [annotation.position, annotation.eye, annotation.target]}))
    
    fetch('/api/reAnnotation', {
        method: 'PATCH', 
        body: JSON.stringify(JSON.stringify(data)) // Nested object needs to be double stringified
    }).then(res => res.json()).then(json => console.log(json.data))
}
