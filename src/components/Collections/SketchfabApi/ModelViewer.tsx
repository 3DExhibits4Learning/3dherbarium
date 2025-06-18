'use client'

import { forwardRef, Ref, MutableRefObject } from "react"

export const ModelViewer = forwardRef((props:{uid: string}, ref:Ref<HTMLIFrameElement | undefined>) => {

    const modelViewerRef = ref as MutableRefObject<HTMLIFrameElement>

    return <iframe src={props.uid} frameBorder="0" id="model-viewer" title={"Model Viewer for " + ''}
            allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking="true"
            execution-while-out-of-viewport="true" execution-while-not-rendered="true" web-share="true"
            allowFullScreen
            style={{ width: "60%", transition: "width 1.5s", zIndex: "2" }}
            ref={modelViewerRef}
        />
})

ModelViewer.displayName = 'ModelViewer'
export default ModelViewer