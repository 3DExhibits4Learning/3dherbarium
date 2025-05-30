/**
 * @file src/components/Admin/Botanist/BotanistModelViewer.tsx
 * 
 * @fileoverview model viewer enabling botanist annotations
 * 
 */

"use client"

// Typical imports
import { MutableRefObject, useRef, useState, useContext, useEffect } from 'react'
import { BotanyClientContext } from './BotanyClient'
import { botanyClientContext } from '@/ts/botanist'
import { addAnnotationModelViewerSuccessFn, initializeModelAnnotationAdditionViewer } from '@/functions/client/admin/botanistModelViewer'
import { fullAnnotation } from '@/ts/types'

// Main JSX
export default function AddModelAnnotationModelViewer(props: { minHeight?: string, uid: string, firstAnnotationPosition: string, annotations: fullAnnotation[] }) {

    // Context
    const context = useContext(BotanyClientContext) as botanyClientContext
    const botanyState = context.botanyState
    const dispatch = context.botanyDispatch

    // Refs
    const modelViewer = useRef<HTMLIFrameElement>()
    const tmpAnnotationIndex = useRef(props.annotations.length + 1)

    // State
    const [sketchfabApi, setSketchfabApi] = useState<any>()

    // iFrame minimum height
    const minHeight = props.minHeight ? props.minHeight : '150px'

    // Viewer initialization success object
    const successObj = {
        success: function onSuccess(api: any) { addAnnotationModelViewerSuccessFn(api, props.firstAnnotationPosition, props.annotations, setSketchfabApi) },
        error: function onError() { },
        ui_stop: 0,
        ui_infos: 0,
        ui_inspector: 0,
        ui_settings: 0,
        ui_watermark: 0,
        ui_annotations: 0,
        ui_color: "004C46",
        ui_fadeout: 0
    }

    // Initialize the viewer
    useEffect(() => initializeModelAnnotationAdditionViewer(modelViewer.current as HTMLIFrameElement, props.uid, successObj), [props.uid])

    useEffect(() => {
        if(sketchfabApi){
            //sketchfabApi.addEventListener('click', createAnnotationWrapper, { pick: 'fast' })
        }
    })

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
            style={{ width: "100%" }} />
    </div>
}