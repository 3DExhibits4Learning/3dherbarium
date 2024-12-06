import { setViewerWidth, annotationControl } from "@/components/Collections/SketchfabDom"
import { CollectionsWrapperProps, sketchfabApiData } from "@/ts/collections"
import { MutableRefObject } from "react"
import { isMobileOrTablet } from "@/utils/isMobile"
import Herbarium from "@/utils/HerbariumClass"

export const annotationSwitchListener = (event: Event, sketchfabApiData: sketchfabApiData, modelViewer: MutableRefObject<HTMLIFrameElement | undefined>, annotationDiv: MutableRefObject<HTMLDivElement | undefined>) => {
    setViewerWidth(modelViewer.current, annotationDiv.current, (event.target as HTMLInputElement).checked)
    annotationControl(sketchfabApiData.api, sketchfabApiData.annotations, (event.target as HTMLInputElement).checked)
}

export const annotationSwitchMobileListener = (event: Event, sketchfabApiData: sketchfabApiData, modelViewer: MutableRefObject<HTMLIFrameElement | undefined>, annotationDiv: MutableRefObject<HTMLDivElement | undefined>) => {
    setViewerWidth(modelViewer.current, annotationDiv.current, (event.target as HTMLInputElement).checked)
    annotationControl(sketchfabApiData.api, sketchfabApiData.annotations, (event.target as HTMLInputElement).checked)
}

export const setImageFromNfs = (url: string, dispatch: any) => {
    const path = process.env.NEXT_PUBLIC_LOCAL === 'true' ? process.env.NEXT_PUBLIC_MAC ? `/Users/ab632/X/data${url.slice(5)}` : `X:${url.slice(5)}` : `public${url}`
    dispatch({ type: 'setStringOrNumber', field: 'imgSrc', value: `/api/annotations/photos?path=${path}` })
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