/**
 * @file src/functions/client/admin/botanist.ts
 * 
 * @fileoverview botany admin logic
 */

import { BotanyClientState } from "@/ts/botanist"
import { BotanyClientAction } from "@/ts/reducer"
import { Dispatch, MutableRefObject } from "react"
import { NewModelOrAnnotation } from "@/ts/reducer"

import ModelAnnotations from "@/utils/ModelAnnotationsClass"

/**
 * 
 * @returns 
 */
export const getIndex = (context: BotanyClientState) => {

    let index

    if (!context.numberOfAnnotations && !context.firstAnnotationPosition || context.activeAnnotationIndex === 1) index = 1
    else if (!context.numberOfAnnotations) index = 2
    else if (context.numberOfAnnotations && context.activeAnnotationIndex != 'new') index = context.activeAnnotationIndex
    else if (context.activeAnnotationIndex === 'new') index = context.numberOfAnnotations + 2
    else throw Error('Index is undefined')

    return index
}

/**
 * 
 * @param botanyState 
 * @param botanyDispatch 
 */
export const activeAnnotationIndexDispatch = (botanyState: BotanyClientState, botanyDispatch: Dispatch<BotanyClientAction>) => {
    if (botanyState.activeAnnotationIndex === 1) botanyDispatch({ type: 'activeAnnotationSetTo1' })
    else if (typeof (botanyState.activeAnnotationIndex) === 'number' && botanyState.annotations) { botanyDispatch({ type: "numberedActiveAnnotation" }) }
}

// Set relevant model data; this is called onPress of the Accordion
export const getAnnotationsObj = async (uid: string, newAnnotationEnabled: MutableRefObject<boolean>, botanyDispatch: Dispatch<BotanyClientAction>) => {
    
    const modelAnnotations = await ModelAnnotations.retrieve(uid as string)
    let annotationPosition = ''

    await fetch(`/api/annotations?uid=${uid}`, { cache: 'no-store' }).then(res => res.json()).then(json => {
            if (json.response) annotationPosition = JSON.parse(json.response)
        })

    newAnnotationEnabled.current = false
    const uidOrAnnotationDispatchObj: NewModelOrAnnotation = { type: 'newModelOrAnnotation', modelAnnotations: modelAnnotations, annotationPosition: annotationPosition }
    botanyDispatch(uidOrAnnotationDispatchObj)
}