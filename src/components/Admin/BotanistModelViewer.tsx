"use client";

import Sketchfab from '@sketchfab/viewer-api';
import { MutableRefObject, useEffect, useRef, Dispatch, SetStateAction, forwardRef, ForwardedRef, useState } from 'react';
import { fullAnnotation } from '@/api/types';

const BotanistModelViewer = forwardRef((props: {
    uid: string,
    minHeight?: string,
    annotations?: fullAnnotation[],
    setActiveAnnotationIndex: Dispatch<SetStateAction<number | 'new' | undefined>>,
    position3D: string | undefined,
    setPosition3D: Dispatch<SetStateAction<string | undefined>>,
    firstAnnotationPosition: string | null | undefined,
    cancelledAnnotation: boolean,
    newAnnotationEnabledState: boolean,
    activeAnnotationIndex: 'new' | number | undefined
    repositionEnabled: boolean
    annotationSavedOrDeleted: boolean
}, ref: ForwardedRef<boolean>) => {

    // Variable declarations
    const newAnnotationEnabled = ref as MutableRefObject<boolean>
    const modelViewer = useRef<HTMLIFrameElement>()
    const temporaryAnnotationIndex = useRef<number>()

    const [sketchfabApi, setSketchfabApi] = useState<any>()

    const minHeight = props.minHeight ? props.minHeight : '150px'

    // This function removes all annotations higher than the active annotation
    const removeHigherAnnotations = () => {
        if (props.annotations && props.annotations.length + 1 !== props.activeAnnotationIndex) {
            for (let i = props.annotations.length; i >= (props.activeAnnotationIndex as number); i--) {
                sketchfabApi.removeAnnotation(i, (err: any) => {})
            }
        }
    }

    // This function replaces all annotations higher than active annotation
    const replaceHigherAnnotations = () => {
        if (props.annotations && props.annotations.length + 1 !== props.activeAnnotationIndex) {
            for (let i = props.activeAnnotationIndex as number - 1; i < props.annotations.length; i++) {
                const position = JSON.parse(props.annotations[i].position as string)
                sketchfabApi.createAnnotationFromScenePosition(position[0], position[1], position[2], `${props.annotations[i].title}`, '', (err: any, index: any) => { temporaryAnnotationIndex.current = index })
            }
        }
    }

    // Annotation creation handler
    const createAnnotation = (info: any) => {
        
        if (newAnnotationEnabled.current) {

            // Remove previous annotation if there is a new click
            if (temporaryAnnotationIndex.current != undefined) {
                sketchfabApi.removeAnnotation(temporaryAnnotationIndex.current, (err: any) => { })
            }

            // Get camera position and create annotation
            sketchfabApi.getCameraLookAt((err: any, camera: any) => {
                sketchfabApi.createAnnotationFromScenePosition(info.position3D, camera.position, camera.target, '', '', (err: any, index: any) => { temporaryAnnotationIndex.current = index })

                // If the click was on the 3d model (and not the background) set position/activeAnnotation data, or else set position undefined
                if (info.position3D) {
                    const positionArray = Array.from(info.position3D)
                    props.setPosition3D(JSON.stringify([positionArray, camera.position, camera.target]))
                    console.log(JSON.stringify([positionArray, camera.position, camera.target]))

                    if (props.activeAnnotationIndex !== 'new') props.setActiveAnnotationIndex('new')

                }
                else props.setPosition3D(undefined)
            })
        }
    }

    // Annotation reposition handler
    const repositionAnnotation = (info: any) => {
        
        if (props.repositionEnabled) {

            // Remove higher annotations so that the current can be repositioned with all indexes remaining in tact
            removeHigherAnnotations()

            // Remove previous annotation if there is a new click
            sketchfabApi.removeAnnotation(props.activeAnnotationIndex as number - 1, (err: any) => {})

            // Get camera position and create annotation
            sketchfabApi.getCameraLookAt((err: any, camera: any) => {

                const title = (props.annotations as fullAnnotation[])[props.activeAnnotationIndex as number - 2]?.title ? `${(props.annotations as fullAnnotation[])[props.activeAnnotationIndex as number - 2].title}` : 'Taxonomy and Description'

                sketchfabApi.createAnnotationFromScenePosition(info.position3D, camera.position, camera.target, `${title}`, '', (err: any, index: any) => {
                    temporaryAnnotationIndex.current = index
                    replaceHigherAnnotations()
                })

                // If the click was on the 3d model (and not the background) set position/activeAnnotation data, or else set position undefined
                if (info.position3D) {
                    const positionArray = Array.from(info.position3D)
                    props.setPosition3D(JSON.stringify([positionArray, camera.position, camera.target]))
                }
                else props.setPosition3D(undefined)
            })
        }
    }

    // Annotation select handler
    const annotationSelectHandler = (index: any) => {
        if (newAnnotationEnabled.current) return
        else if (index != -1) props.setActiveAnnotationIndex(index + 1)
    }

    // Sketchfab API initialization success object
    const successObj = {
        success: function onSuccess(api: any) {
            setSketchfabApi(api)
            api.current = api
            api.start()
            api.addEventListener('viewerready', function () {

                // Create the first annotation if it exists
                if (props.firstAnnotationPosition) {
                    api.createAnnotationFromScenePosition(props.firstAnnotationPosition[0], props.firstAnnotationPosition[1], props.firstAnnotationPosition[2], 'Taxonomy and Description', '', (err: any, index: any) => { })
                }

                // Create any futher annotations that exist
                if (props.annotations) {
                    for (let i in props.annotations) {
                        if (props.annotations[i].position) {
                            const position = JSON.parse(props.annotations[i].position)
                            api.createAnnotationFromScenePosition(position[0], position[1], position[2], `${props.annotations[i].title}`, '', (err: any, index: any) => { })
                        }
                    }
                }
            })
        },

        // Sketchfab viewer initialization settings
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

    // This effect initializes the viewer
    useEffect(() => {
        const iframe = modelViewer.current as HTMLIFrameElement
        iframe.src = props.uid
        const client = new Sketchfab(iframe)
        client.init(props.uid, successObj)
    }, [props.uid, props.annotations]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect removes the temporary annotation when its cancelled
    useEffect(() => {
        if (sketchfabApi && temporaryAnnotationIndex.current != undefined) {
            sketchfabApi.removeAnnotation(temporaryAnnotationIndex.current, (err: any) => { })
            props.setPosition3D(undefined)
        }
    }, [props.cancelledAnnotation]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect adds the createAnnotation listener onClick when the associated state is enabled (or vice versa)
    useEffect(() => {
        if (sketchfabApi && props.newAnnotationEnabledState === true) {
            temporaryAnnotationIndex.current = undefined
            sketchfabApi.addEventListener('click', createAnnotation, { pick: 'fast' })
        }
        else if (sketchfabApi) sketchfabApi.removeEventListener('click', createAnnotation, { pick: 'fast' })

        return () => { if (sketchfabApi) sketchfabApi.removeEventListener('click', createAnnotation, { pick: 'fast' }) }
    }, [props.newAnnotationEnabledState]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect allows repositioning of the activeAnnotation onClick (or removes it when there is no active annotation, or a new annotation)
    useEffect(() => {
        if (sketchfabApi && props.activeAnnotationIndex !== undefined && props.activeAnnotationIndex !== 'new' && props.repositionEnabled) {
            sketchfabApi.addEventListener('click', repositionAnnotation, { pick: 'fast' })
        }

        else if (sketchfabApi) sketchfabApi.removeEventListener('click', repositionAnnotation, { pick: 'fast' })

        return () => { if (sketchfabApi) sketchfabApi.removeEventListener('click', repositionAnnotation, { pick: 'fast' }) }
    }, [props.activeAnnotationIndex, props.repositionEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect repositions an annotation to its original location when the annotation reposition checkbox is unchecked
    useEffect(() => {

        if(props.activeAnnotationIndex === 1){
            temporaryAnnotationIndex.current = undefined
            removeHigherAnnotations()
            sketchfabApi.removeAnnotation(props.activeAnnotationIndex as number - 1, (err: any) => { })
            const position = props.firstAnnotationPosition as string
            sketchfabApi.createAnnotationFromScenePosition(position[0], position[1], position[2], 'Placeholder', '', (err: any, index: any) => {replaceHigherAnnotations()})
        }
        else if (sketchfabApi && props.position3D !== (props.annotations as fullAnnotation[])[props.activeAnnotationIndex as number - 2]?.position && !props.repositionEnabled) {
            temporaryAnnotationIndex.current = undefined
            removeHigherAnnotations()
            sketchfabApi.removeAnnotation(props.activeAnnotationIndex as number - 1, (err: any) => { })
            const position = JSON.parse((props.annotations as fullAnnotation[])[props.activeAnnotationIndex as number - 2].position as string)
            sketchfabApi.createAnnotationFromScenePosition(position[0], position[1], position[2], 'Placeholder', '', (err: any, index: any) => {replaceHigherAnnotations()})
        }
    }, [props.repositionEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect initializes the annotation select event handler and handles corresponding state changes within the handler
    useEffect(() => {

        // Set the activeAnnotationIndex when an annotation is selected
        // Note that this event is triggered by any click, even those not on an annotation. Such events return and index of -1

        if (sketchfabApi && !props.repositionEnabled) sketchfabApi.addEventListener('annotationSelect', annotationSelectHandler)
        else if (sketchfabApi) sketchfabApi.removeEventListener('annotationSelect', annotationSelectHandler)

        return () => { if (sketchfabApi) sketchfabApi.removeEventListener('annotationSelect', annotationSelectHandler) }
    }, [sketchfabApi, props.activeAnnotationIndex, props.repositionEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

    // Simple iframe with ref
    return (
        <>
            <div className={`flex bg-black m-auto min-h-[${minHeight}]`} style={{ height: "100%", width: "100%" }}>
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
        </>
    )
})

BotanistModelViewer.displayName = 'BotanistModelViewer'
export default BotanistModelViewer