/**
 * @file src/components/Shared/AnnotationModalModelViewer.tsx
 * 
 * @fileoverview this file only exists because nextui/heroui components behave weird af; the main difference between this and the regular one is that this has a fixed size
 * 
 */

"use client"

import Sketchfab from '@sketchfab/viewer-api'
import { MutableRefObject, useEffect, useRef } from 'react'

export default function ModelViewer(props: { uid: string}) {

    const modelViewer = useRef<HTMLIFrameElement>(undefined)

    const successObj = {
        success: (api: any) => api.start(),
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

    useEffect(() => {
        const iframe = modelViewer.current as HTMLIFrameElement
        iframe.src = props.uid
        const client = new Sketchfab(iframe)
        client.init(props.uid, successObj)
    }, [props.uid]) // eslint-disable-line react-hooks/exhaustive-deps

    return <div className={`flex bg-black m-auto !min-h-[50vh]`} style={{ height: "100%", width: "100%" }}>
        <iframe
            ref={modelViewer as MutableRefObject<HTMLIFrameElement>}
            frameBorder="0"
            title={"Model Viewer for " + ''}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            xr-spatial-tracking="true"
            execution-while-out-of-viewport="true"
            execution-while-not-rendered="true"
            web-share="true"
            allowFullScreen
            style={{ width: "100%", height: "100%" }}/>
    </div>
}