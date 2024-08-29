'use client'

import Sketchfab from '@sketchfab/viewer-api';
import { useEffect } from 'react';

const ModelAnnotation = (props: {uid: string}) => {
    const modelLoad = () => {
        var iframe = document.getElementById('api-frame');
        var uid = props.uid
        var client = new Sketchfab(iframe);

        client.init(uid, {
            success: function onSuccess(api: any) {
                api.start();
                api.addEventListener('viewerready', function () {
                });
            },
            error: function onError() {
            },
            ui_stop: 0,
            ui_infos: 0,
            ui_inspector: 0,
            ui_settings: 0,
            ui_watermark: 0,
            ui_annotations: 0,
            ui_color: "004C46"
        },);
    }
    useEffect(() => {
        modelLoad();
    }, []);
    
    return (
        //@ts-ignore
        <iframe height='100%' width='100%' id='api-frame' allow='autoplay; fullscreen; xr-spatial-tracking' xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share allowfullscreen mozallowfullscreen='true' webkitallowfullscreen='true'></iframe>
    )
}
export default ModelAnnotation;