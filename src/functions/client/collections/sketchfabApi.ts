/**
 *@file  src/functions/client/collections/sketchfabApi.ts

 @fileoverview logic file corresponding to SketchFabAPI.tsx

 @todo comment remaining uncommented functions
 */

'use client'

// Typical imports
import { setViewerWidth, annotationControl } from "@/components/Collections/SketchfabDom"
import { CollectionsWrapperProps, sketchfabApiData, sketchfabApiReducerAction } from "@/ts/collections"
import { MutableRefObject, Dispatch } from "react"
import { isMobileOrTablet } from "@/utils/isMobile"
import { photo_annotation } from "@prisma/client"
import { fullAnnotation } from "@/api/types"

// Default imports
import Herbarium from "@/utils/HerbariumClass"

/**
 * 
 * @param sketchfabApi context data from SketchFabApi
 * @description will be deprecated after all photos are transitioned to data storage
 * @returns boolean indicating whether or not a photo has been retrievd from the NFS data storage container
 */
export const isDataStoragePhoto = (sketchfabApi: sketchfabApiData) => ((sketchfabApi.annotations as fullAnnotation[])[sketchfabApi.index as number - 1].annotation as photo_annotation)?.url.startsWith('/data/Herbarium/Annotations')

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

export const annotationSwitchMobileListener = (event: Event, sketchfabApiData: sketchfabApiData, modelViewer: MutableRefObject<HTMLIFrameElement | undefined>, annotationDiv: MutableRefObject<HTMLDivElement | undefined>) => {
    setViewerWidth(modelViewer.current, annotationDiv.current, (event.target as HTMLInputElement).checked)
    annotationControl(sketchfabApiData.api, sketchfabApiData.annotations, (event.target as HTMLInputElement).checked)
}

export const setImageFromNfs = async (url: string, dispatch: any) => {

    // Declare src variable, set loading state true 
    var src; dispatch({ type: 'setPhotoLoading' })

    // Get appropriate path and await buffer
    const path = process.env.NEXT_PUBLIC_LOCAL === 'true' ? process.env.NEXT_PUBLIC_MAC ? `/Users/ab632/X/data${url.slice(5)}` : `X:${url.slice(5)}` : `public${url}`
    const response = await fetch(`/api/nfs?path=${path}`)

    // If buffer is found, convert to blob and create object url, else use default photo (not found)
    if (!response.ok) src = '/noImage.png'
    else { const blob = await response.blob(); src = URL.createObjectURL(blob) }

    // Dispatch new image src, set loading state false
    dispatch({ type: 'photoLoaded', field: 'imgSrc', value: src })
}

export const initializeModelViewer = (client: any, uid: string, successObj: any, successObjDesktop: any) => {

    // Choose initialization success object based on screen size
    if (isMobileOrTablet() || window.matchMedia('(max-width: 1023.5px)').matches || window.matchMedia('(orientation: portrait)').matches) {
        client.init(uid, successObj)
    }
    else {
        client.init(uid, successObjDesktop)
    }
}

export const instantiateHerbarium = async (sRef: MutableRefObject<Herbarium | undefined>, props: CollectionsWrapperProps, dispatch: any) => {
    sRef.current = await Herbarium.model(props.gMatch.data?.usageKey as number, props.model[0], props.noModelData.images, props.noModelData.title)
    dispatch({ type: 'setSpecimen', specimen: sRef.current, annotations: sRef.current.annotations.annotations })
}

export const createAndMaybeGoToFirstAnnotation = (sketchfabApi: sketchfabApiData) => {

    // Parse position string
    const position = JSON.parse(sketchfabApi.s?.model.annotationPosition as string)

    // Create annotation from position
    sketchfabApi.api.createAnnotationFromScenePosition(position[0], position[1], position[2], 'Taxonomy and Description', '', (err: any, index: any) => {
        if (err) throw Error("3D Model Viewer Error")

        // Go to first annotation based on screen size and user agent
        if (!(isMobileOrTablet() || window.matchMedia('(max-width: 1023.5px)').matches)) {
            sketchfabApi.api.gotoAnnotation(0, { preventCameraAnimation: true, preventCameraMove: false }, (err: any, index: any) => { if (err) throw Error("3D Model Viewer Error") })
        }
    })
}

export const createAnnotationsGreaterThan1 = (sketchfabApi: any) => {
    for (let i = 0; i < sketchfabApi.annotations.length; i++) {
        if (sketchfabApi.annotations[i].position) {
            const position = JSON.parse(sketchfabApi.annotations[i].position as string)
            sketchfabApi.api.createAnnotationFromScenePosition(position[0], position[1], position[2], `${sketchfabApi.annotations[i].title}`, '', (err: any, index: any) => { if (err) throw Error("3D Model Viewer Error") })
        }
    }
}

export const addAnnotationSelectEventListener = (sketchfabApi: any, sketchfabApiDispatch: Dispatch<sketchfabApiReducerAction>) => {
    // Set index when an annotation is selected
    sketchfabApi.api.addEventListener('annotationSelect', function (index: number) {

        const mediaQueryWidth = window.matchMedia('(max-width: 1023.5px)')
        const mediaQueryOrientation = window.matchMedia('(orientation: portrait)')

        // **Note** this event is still triggered even when an annotation is not selected; an index of -1 is returned in that case
        if (index !== -1) sketchfabApiDispatch({ type: 'setStringOrNumber', field: 'index', value: index })

        // Mobile annotation state management
        if (index !== -1 && mediaQueryWidth.matches || index != -1 && mediaQueryOrientation.matches) {
            document.getElementById("annotationButton")?.click()
            sketchfabApi.api.getAnnotation(index, function (err: any, information: any) {if (!err) sketchfabApiDispatch({ type: 'setMobileAnnotation', index: index, title: information.name })})
        }
    })
}

export const addAnnotationSwitchListeners = (annotationSwitch: HTMLInputElement, annotationSwitchMobile: HTMLInputElement, annotationSwitchWrapper: EventListener, mobileAnnotationSwitchWrapper: EventListener) => {
    annotationSwitch.addEventListener("change", annotationSwitchWrapper)
    annotationSwitchMobile.addEventListener("change", mobileAnnotationSwitchWrapper)
}

export const photoSrcChangeHandler = (sketchfabApi: any, sketchfabApiDispatch: Dispatch<sketchfabApiReducerAction>) => {

    if (!!sketchfabApi.index && sketchfabApi.annotations && sketchfabApi.annotations[sketchfabApi.index - 1].annotation_type == 'photo') {

        if (isDataStoragePhoto(sketchfabApi)) setImageFromNfs((sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation)?.url, sketchfabApiDispatch)
        else sketchfabApiDispatch({ type: 'setStringOrNumber', field: 'imgSrc', value: sketchfabApi.annotations[sketchfabApi.index - 1].url as string })
    }
}

export const initializeCollections = (client: any, successObj: any, successObjDesktop: any, sRef: MutableRefObject<Herbarium | undefined>, props: CollectionsWrapperProps, sketchfabApiDispatch: Dispatch<sketchfabApiReducerAction>) => {
    // Initialize and instantiate
    initializeModelViewer(client, props.model[0].uid, successObj, successObjDesktop)
    instantiateHerbarium(sRef, props, sketchfabApiDispatch)
}

export const initializeAnnotationsAndListeners = (sketchfabApi: any, sketchfabApiDispatch: Dispatch<sketchfabApiReducerAction>, annotationSwitch: HTMLInputElement, annotationSwitchMobile: HTMLInputElement, annotationSwitchWrapper: EventListener, mobileAnnotationSwitchWrapper: EventListener) => {
    if (sketchfabApi.s && sketchfabApi.annotations && sketchfabApi.api) {

        // Create annotations an go to first annotation if client appears to be on desktop
        if (sketchfabApi.s.model.annotationPosition) createAndMaybeGoToFirstAnnotation(sketchfabApi); createAnnotationsGreaterThan1(sketchfabApi)

        // Add both annotation switch and annotation select event listeners
        addAnnotationSwitchListeners(annotationSwitch, annotationSwitchMobile, annotationSwitchWrapper, mobileAnnotationSwitchWrapper)
        addAnnotationSelectEventListener(sketchfabApi, sketchfabApiDispatch)
    }
}