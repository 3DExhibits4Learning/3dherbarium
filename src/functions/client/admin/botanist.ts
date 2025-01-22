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
    else if (typeof (botanyState.activeAnnotationIndex) === 'number' && botanyState.annotations) botanyDispatch({ type: "numberedActiveAnnotation" })
}

/**
 * 
 * @param uid 
 * @param newAnnotationEnabled 
 * @param botanyDispatch 
 */
export const getAnnotationsObj = async (uid: string, newAnnotationEnabled: MutableRefObject<boolean>, botanyDispatch: Dispatch<BotanyClientAction>) => {

    // retrieve model annotations
    const modelAnnotations = await ModelAnnotations.retrieve(uid as string)

    // Fetch first annotation position, disable new annotation ref
    const annotationPosition = await fetch(`/api/annotations?uid=${uid}`, { cache: 'no-store' }).then(res => res.json()).then(json => { if (json.response) return json.response; return '' })
    newAnnotationEnabled.current = false

    // Type safe dispatch object and fn call
    const uidOrAnnotationDispatchObj: NewModelOrAnnotation = { type: 'newModelOrAnnotation', modelAnnotations: modelAnnotations, annotationPosition: annotationPosition }
    botanyDispatch(uidOrAnnotationDispatchObj)
}

export const setImgSrc = async (url: string) => {
    const path = process.env.NEXT_PUBLIC_LOCAL ? `X:${url.slice(5)}` : `public${url}`
    //setImageSource(`/api/nfs?path=${path}`)
}