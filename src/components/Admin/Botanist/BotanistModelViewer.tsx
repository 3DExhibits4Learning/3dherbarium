/**
 * @file src/components/Admin/Botanist/BotanistModelViewer.tsx
 * 
 * @fileoverview model viewer enabling botanist annotations
 * 
 */

"use client"

// Typical imports
import { MutableRefObject, useEffect, useRef, forwardRef, ForwardedRef, useState, useContext } from 'react';
import { BotanyClientContext } from './BotanyClient';
import { botanyClientContext } from '@/ts/botanist';

// Logic import
import * as fn from '@/functions/client/admin/botanistModelViewer'

const BotanistModelViewer = forwardRef((props: { minHeight?: string, }, ref: ForwardedRef<boolean>) => {

    // Context
    const context = useContext(BotanyClientContext) as botanyClientContext
    const botanyState = context.botanyState
    const dispatch = context.botanyDispatch

    // Refs
    const newAnnotationEnabled = ref as MutableRefObject<boolean>
    const modelViewer = useRef<HTMLIFrameElement>()
    const temporaryAnnotationIndex = useRef<number>()

    // State
    const [sketchfabApi, setSketchfabApi] = useState<any>()

    // iFrame minimum height
    const minHeight = props.minHeight ? props.minHeight : '150px'

    const createAnnotation = (info: any, botanyState: BotanyClientState, sketchfabApi: any, temporaryAnnotationIndex: MutableRefObject<number | undefined>, newAnnotationEnabled: MutableRefObject<boolean>, dispatch: Dispatch<BotanyClientAction>) => {
    
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

    // Annotation/successObj function wrappers (callbacks)
    const createAnnotationWrapper = (info: any) => createAnnotation(info, botanyState, sketchfabApi, temporaryAnnotationIndex, newAnnotationEnabled, dispatch)
    const repositionAnnotationWrapper = (info: any) => fn.repositionAnnotation(info, botanyState, sketchfabApi, temporaryAnnotationIndex, dispatch)
    const annotationSelectWrapper = (index: any) => fn.annotationSelectHandler(index, dispatch, newAnnotationEnabled)
    const successObjectFnWrapper = (api: any) => fn.successObjFn(api, botanyState, setSketchfabApi)

    // Sketchfab API initialization success object
    const successObj = {
        success: successObjectFnWrapper,
        error: (e: any) => { throw Error(e.message) },
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
        if (sketchfabApi && botanyState.newAnnotationEnabled) {
            temporaryAnnotationIndex.current = undefined
            sketchfabApi.addEventListener('click', createAnnotationWrapper, { pick: 'fast' })
        }

        else if (sketchfabApi) sketchfabApi.removeEventListener('click', createAnnotationWrapper, { pick: 'fast' })
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
            ref={modelViewer as MutableRefObject<HTMLIFrameElement>}
            src=""
            frameBorder="0"
            title={"Model Viewer for " + ''}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true"
            allowFullScreen
            style={{ width: "100%" }}
        />
    </div>
})

// Display name, export
BotanistModelViewer.displayName = 'BotanistModelViewer'
export default BotanistModelViewer