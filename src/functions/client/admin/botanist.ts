/**
 * @file src/functions/client/admin/botanist.ts
 * 
 * @fileoverview botany admin logic
 */

import { botanyClientContext, BotanyClientState } from "@/ts/botanist"
import { BotanyClientAction } from "@/ts/reducer"
import { Dispatch } from "react"

/**
 * 
 * @returns 
 */

export const getIndex = (context: BotanyClientState) => {

    let index

    if (!context.numberOfAnnotations && !context.firstAnnotationPosition || context.activeAnnotationIndex == 1) index = 1
    else if (!context.numberOfAnnotations) index = 2
    else if (context.numberOfAnnotations && context.activeAnnotationIndex != 'new') index = context.activeAnnotationIndex
    else if (context.activeAnnotationIndex == 'new') index = context.numberOfAnnotations + 2

    return index
}

export const activeAnnotationIndexDispatch = (botanyState: BotanyClientState, botanyDispatch: Dispatch<BotanyClientAction>) => {
    if (botanyState.activeAnnotationIndex == 1) botanyDispatch({ type: 'activeAnnotationSetTo1' })
    else if (typeof (botanyState.activeAnnotationIndex) === 'number' && botanyState.annotations) { botanyDispatch({ type: "numberedActiveAnnotation" }) }
}