/**
 * @file src/components/Admin/Botanist/BotanistModelViewer.tsx
 * 
 * @fileoverview model viewer enabling botanist annotations
 * 
 */

"use client"

// Typical imports
import { RefObject, useEffect, useRef, forwardRef, ForwardedRef, useState, useContext } from 'react'
import { BotanyClientContext } from './BotanyClient'
import { botanyClientContext } from '@/ts/botanist'

// Logic import
import * as fn from '@/functions/client/admin/botanistModelViewer'

const BotanistModelViewer = forwardRef((props: { minHeight?: string, }, ref: ForwardedRef<boolean>) => {

    // Context
    const context = useContext(BotanyClientContext) as botanyClientContext
    const botanyState = context.botanyState
    const dispatch = context.botanyDispatch

    // Refs
    const newAnnotationEnabled = ref as RefObject<boolean>
    const modelViewer = useRef<HTMLIFrameElement>(undefined)
    const temporaryAnnotationIndex = useRef<number>(undefined)

    // State
    const [sketchfabApi, setSketchfabApi] = useState<any>()

    // iFrame minimum height
    const minHeight = props.minHeight ? props.minHeight : '150px'

    // Annotation/successObj function wrappers (callbacks)
    const createAnnotationWrapper = (info: any) => fn.createAnnotation(info, botanyState, sketchfabApi, temporaryAnnotationIndex, newAnnotationEnabled, dispatch)
    const repositionAnnotationWrapper = (info: any) => fn.repositionAnnotation(info, botanyState, sketchfabApi, temporaryAnnotationIndex, dispatch)
    const annotationSelectWrapper = (index: any) => fn.annotationSelectHandler(index, dispatch, newAnnotationEnabled)
    const successObjectFnWrapper = (api: any) => fn.successObjFn(api, botanyState, setSketchfabApi)

    // Sketchfab API initialization success object
    const successObj = {
        success: successObjectFnWrapper,
        error: (e: any) => { console.log('Sketchfab Viewer Error: ', e) },
        ui_stop: 0,
        ui_infos: 0,
        ui_inspector: 0,
        ui_settings: 0,
        ui_watermark: 0,
        ui_annotations: 0,
        ui_color: "004C46",
        ui_fadeout: 0
    }

    // Initialize viewer
    useEffect(() => fn.initializeViewer(modelViewer, botanyState, successObj), [botanyState.uid, botanyState.annotations]) // eslint-disable-line react-hooks/exhaustive-deps

    // Remove temporary annotation when its cancelled
    useEffect(() => fn.removeTemporaryAnnotation(sketchfabApi, temporaryAnnotationIndex, dispatch), [botanyState.cancelledAnnotation]) // eslint-disable-line react-hooks/exhaustive-deps

    // Add the createAnnotation listener when the associated state is enabled (or vice versa); cleanup function ensures listener is removed before effect runs again
    useEffect(() => {
        fn.enableCreateAnnotationListener(sketchfabApi, temporaryAnnotationIndex, botanyState, createAnnotationWrapper)
        return () => { if (sketchfabApi) sketchfabApi.removeEventListener('click', createAnnotationWrapper, { pick: 'fast' }) }
    }, [botanyState.newAnnotationEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

    // Allow repositioning of the active annotation when reposition is enabled (or remove it if appropriate); cleanup function ensures listener is removed before effect runs again
    useEffect(() => {
        fn.enableReposition(botanyState, sketchfabApi, repositionAnnotationWrapper)
        return () => { if (sketchfabApi) sketchfabApi.removeEventListener('click', repositionAnnotationWrapper, { pick: 'fast' }) }
    }, [botanyState.activeAnnotationIndex, botanyState.repositionEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

    // Reposition an annotation to its original location when the annotation reposition checkbox is unchecked
    useEffect(() => fn.repositionUncheckedHandler(botanyState, sketchfabApi, temporaryAnnotationIndex), [botanyState.repositionEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

    // Initialize the annotation select event handler and handle corresponding state changes within the handler; cleanup function ensures listener is removed before effect runs again
    useEffect(() => {
        fn.annotationSelectEventHandler(sketchfabApi, botanyState, annotationSelectWrapper)
        return () => { if (sketchfabApi) sketchfabApi.removeEventListener('annotationSelect', annotationSelectWrapper) }
    }, [sketchfabApi, botanyState.activeAnnotationIndex, botanyState.repositionEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

    // Simple iframe with ref
    return <div className={`flex bg-black m-auto min-h-[${minHeight}]`} style={{ height: "100%", width: "100%" }}>
        <iframe
            ref={modelViewer as RefObject<HTMLIFrameElement>}
            frameBorder="0"
            title={"Model Viewer for " + ''}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true"
            allowFullScreen
            style={{ width: "100%" }}/>
    </div>
})

// Display name, export
BotanistModelViewer.displayName = 'BotanistModelViewer'
export default BotanistModelViewer