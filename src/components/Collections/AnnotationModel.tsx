/**
 * @file src/components/Collections/AnnotationModel.tsx
 * 
 * @fileoverview 3D model viewer for annotations
 * 
 * @todo pass down error state/context for viewer
 * @todo add maximum and minum zoom to model annotation schema
 */

'use client'

// Imports
import { useEffect } from 'react'
import Sketchfab from '@sketchfab/viewer-api'

// Main JSX
export default function ModelAnnotation(props: { uid: string }) {

    // Success object
    const successObj = {
        success: (api: any) => { api.start(); api.addEventListener('viewerready', () => { console.log('Viewer Ready') }) },
        error: function onError() { },
        ui_stop: 0,
        ui_infos: 0,
        ui_inspector: 0,
        ui_settings: 0,
        ui_watermark: 0,
        ui_annotations: 0,
        ui_color: "004C46",
        orbit_constraint_zoom_in: 1,
        orbit_constraint_zoom_out: 15,
    }

    // Effect syncs viewer api
    useEffect(() => {

        // Declarations
        var iframe = document.getElementById('api-frame')
        var uid = props.uid
        var client = new Sketchfab(iframe)
        
        // Sketchfab client initialization method
        client.init(uid, successObj)
    }, [])

    // @ts-ignore
    return <iframe height='100%' width='100%' id='api-frame' allow='autoplay; fullscreen; xr-spatial-tracking' xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share allowfullscreen mozallowfullscreen='true' webkitallowfullscreen='true'></iframe>
}