/**
 * @file src/components/Admin/Botanist/BotanistModelViewer.tsx
 * 
 * @fileoverview model viewer enabling botanist annotations
 * 
 * @todo refactor, test
 */

"use client"

// Typical imports
import { MutableRefObject, useEffect, useRef, forwardRef, ForwardedRef, useState, useContext } from 'react';
import { fullAnnotation } from '@/api/types';
import { BotanyClientContext } from './BotanyClient';
import { botanyClientContext } from '@/ts/botanist';
import { SetActiveAnnotationIndex, SetPosition } from '@/ts/reducer';

// Default imports
import Sketchfab from '@sketchfab/viewer-api';

const BotanistModelViewer = forwardRef((props: {minHeight?: string,}, ref: ForwardedRef<boolean>) => {

    // Context
    const context = useContext(BotanyClientContext) as botanyClientContext
    const botanyState = context.botanyState
    const dispatch = context.botanyDispatch

    // Variable declarations
    const newAnnotationEnabled = ref as MutableRefObject<boolean>
    const modelViewer = useRef<HTMLIFrameElement>()
    const temporaryAnnotationIndex = useRef<number>()

    const [sketchfabApi, setSketchfabApi] = useState<any>()

    const minHeight = props.minHeight ? props.minHeight : '150px'

    // This function removes all annotations higher than the active annotation
    const removeHigherAnnotations = () => {
        if (botanyState.annotations && botanyState.annotations.length + 1 !== botanyState.activeAnnotationIndex) {
            for (let i = botanyState.annotations.length; i >= (botanyState.activeAnnotationIndex as number); i--) {
                sketchfabApi.removeAnnotation(i, (err: any) => { })
            }
        }
    }

    // This function replaces all annotations higher than active annotation
    const replaceHigherAnnotations = () => {
        if (botanyState.annotations && botanyState.annotations.length + 1 !== botanyState.activeAnnotationIndex) {
            for (let i = botanyState.activeAnnotationIndex as number - 1; i < botanyState.annotations.length; i++) {
                const position = JSON.parse(botanyState.annotations[i].position as string)
                sketchfabApi.createAnnotationFromScenePosition(position[0], position[1], position[2], `${botanyState.annotations[i].title}`, '', (err: any, index: any) => { temporaryAnnotationIndex.current = index })
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
                    const positionDispatch: SetPosition = { type: "setPosition", position: JSON.stringify([positionArray, camera.position, camera.target]) }
                    dispatch(positionDispatch)

                    if (botanyState.activeAnnotationIndex !== 'new') {
                        const indexDispatch: SetActiveAnnotationIndex = { type: 'setActiveAnnotationIndex', index: 'new' }
                        dispatch(indexDispatch)
                    }

                }
                else {const positionDispatch: SetPosition = { type: "setPosition", position: undefined }; dispatch(positionDispatch)}
            })
        }
    }

    // Annotation reposition handler
    const repositionAnnotation = (info: any) => {

        if (botanyState.repositionEnabled) {

            // Remove higher annotations so that the current can be repositioned with all indexes remaining in tact
            removeHigherAnnotations()

            // Remove previous annotation if there is a new click
            sketchfabApi.removeAnnotation(botanyState.activeAnnotationIndex as number - 1, (err: any) => { })

            // Get camera position and create annotation
            sketchfabApi.getCameraLookAt((err: any, camera: any) => {

                const title = (botanyState.annotations as fullAnnotation[])[botanyState.activeAnnotationIndex as number - 2]?.title ? `${(botanyState.annotations as fullAnnotation[])[botanyState.activeAnnotationIndex as number - 2].title}` : 'Taxonomy and Description'

                sketchfabApi.createAnnotationFromScenePosition(info.position3D, camera.position, camera.target, `${title}`, '', (err: any, index: any) => {
                    temporaryAnnotationIndex.current = index
                    replaceHigherAnnotations()
                })

                // If the click was on the 3d model (and not the background) set position/activeAnnotation data, or else set position undefined
                if (info.position3D) {
                    const positionArray = Array.from(info.position3D)
                    const positionDispatch: SetPosition = { type: "setPosition", position: JSON.stringify([positionArray, camera.position, camera.target]) }
                    dispatch(positionDispatch)
                }
                else {const positionDispatch: SetPosition = { type: "setPosition", position: undefined }; dispatch(positionDispatch)}
            })
        }
    }

    // Annotation select handler
    const annotationSelectHandler = (index: any) => {
        if (newAnnotationEnabled.current) return
        else if (index !== -1) {const indexDispatch: SetActiveAnnotationIndex = { type: "setActiveAnnotationIndex", index: index + 1 }; dispatch(indexDispatch)}
    }

    // Sketchfab API initialization success object
    const successObj = {
        success: function onSuccess(api: any) {
            setSketchfabApi(api)
            api.current = api
            api.start()
            api.addEventListener('viewerready', function () {

                // Create the first annotation if it exists
                if (botanyState.firstAnnotationPosition) {
                    api.createAnnotationFromScenePosition(botanyState.firstAnnotationPosition[0], botanyState.firstAnnotationPosition[1], botanyState.firstAnnotationPosition[2], 'Taxonomy and Description', '', (err: any, index: any) => { })
                }

                // Create any futher annotations that exist
                if (botanyState.annotations) {
                    for (let i in botanyState.annotations) {
                        if (botanyState.annotations[i].position) {
                            const position = JSON.parse(botanyState.annotations[i].position)
                            api.createAnnotationFromScenePosition(position[0], position[1], position[2], `${botanyState.annotations[i].title}`, '', (err: any, index: any) => { })
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
        iframe.src = botanyState.uid as string
        const client = new Sketchfab(iframe)
        client.init(botanyState.uid, successObj)
    }, [botanyState.uid, botanyState.annotations]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect removes the temporary annotation when its cancelled
    useEffect(() => {
        if (sketchfabApi && temporaryAnnotationIndex.current != undefined) {
            sketchfabApi.removeAnnotation(temporaryAnnotationIndex.current, (err: any) => { })
            const positionDispatch: SetPosition = { type: "setPosition", position: undefined }; dispatch(positionDispatch)
        }
    }, [botanyState.cancelledAnnotation]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect adds the createAnnotation listener onClick when the associated state is enabled (or vice versa)
    useEffect(() => {
        if (sketchfabApi && botanyState.newAnnotationEnabled === true) {
            temporaryAnnotationIndex.current = undefined
            sketchfabApi.addEventListener('click', createAnnotation, { pick: 'fast' })
        }
        else if (sketchfabApi) sketchfabApi.removeEventListener('click', createAnnotation, { pick: 'fast' })

        return () => { if (sketchfabApi) sketchfabApi.removeEventListener('click', createAnnotation, { pick: 'fast' }) }
    }, [botanyState.newAnnotationEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect allows repositioning of the activeAnnotation onClick (or removes it when there is no active annotation, or a new annotation)
    useEffect(() => {
        if (sketchfabApi && botanyState.activeAnnotationIndex !== undefined && botanyState.activeAnnotationIndex !== 'new' && botanyState.repositionEnabled) {
            sketchfabApi.addEventListener('click', repositionAnnotation, { pick: 'fast' })
        }

        else if (sketchfabApi) sketchfabApi.removeEventListener('click', repositionAnnotation, { pick: 'fast' })

        return () => { if (sketchfabApi) sketchfabApi.removeEventListener('click', repositionAnnotation, { pick: 'fast' }) }
    }, [botanyState.activeAnnotationIndex, botanyState.repositionEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect repositions an annotation to its original location when the annotation reposition checkbox is unchecked
    useEffect(() => {

        if (botanyState.activeAnnotationIndex === 1) {
            temporaryAnnotationIndex.current = undefined
            removeHigherAnnotations()
            sketchfabApi.removeAnnotation(botanyState.activeAnnotationIndex as number - 1, (err: any) => { })
            const position = botanyState.firstAnnotationPosition as string
            sketchfabApi.createAnnotationFromScenePosition(position[0], position[1], position[2], 'Placeholder', '', (err: any, index: any) => { replaceHigherAnnotations() })
        }
        else if (sketchfabApi && botanyState.position3D !== (botanyState.annotations as fullAnnotation[])[botanyState.activeAnnotationIndex as number - 2]?.position && !botanyState.repositionEnabled) {
            temporaryAnnotationIndex.current = undefined
            removeHigherAnnotations()
            sketchfabApi.removeAnnotation(botanyState.activeAnnotationIndex as number - 1, (err: any) => { })
            const position = JSON.parse((botanyState.annotations as fullAnnotation[])[botanyState.activeAnnotationIndex as number - 2].position as string)
            sketchfabApi.createAnnotationFromScenePosition(position[0], position[1], position[2], 'Placeholder', '', (err: any, index: any) => { replaceHigherAnnotations() })
        }
    }, [botanyState.repositionEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

    // This effect initializes the annotation select event handler and handles corresponding state changes within the handler
    useEffect(() => {

        // Set the activeAnnotationIndex when an annotation is selected
        // Note that this event is triggered by any click, even those not on an annotation. Such events return and index of -1

        if (sketchfabApi && !botanyState.repositionEnabled) sketchfabApi.addEventListener('annotationSelect', annotationSelectHandler)
        else if (sketchfabApi) sketchfabApi.removeEventListener('annotationSelect', annotationSelectHandler)

        return () => { if (sketchfabApi) sketchfabApi.removeEventListener('annotationSelect', annotationSelectHandler) }
    }, [sketchfabApi, botanyState.activeAnnotationIndex, botanyState.repositionEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

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