/**
 * @file src/functions/client/reducers/CollectionsMediaStateReducer.ts
 * 
 * @fileoverview simple reducer for the collections page media state (model, observations or images)
 */

'use client'

import { fullAnnotation } from "@/ts/types"
import { BotanyClientState } from "@/ts/botanist"
import { BotanyClientAction, NewModelClicked, NewModelOrAnnotation, SetActiveAnnotationIndex, SetPosition } from "@/ts/reducer"
import ModelAnnotations from "@/functions/client/utils/ModelAnnotationsClass"

/**
 * 
 * @param mediaState previous stat object (not used, but required parameter)
 * @param action dispatch action
 * @returns CollectionsMediaObject
 */
export default function botanyClientReducer(botanistState: BotanyClientState, action: BotanyClientAction): BotanyClientState {

    switch (action.type) {

        case 'activeAnnotationSetTo1':

            return {
                ...botanistState,
                activeAnnotation: undefined,
                activeAnnotationType: undefined,
                activeAnnotationPosition: undefined
            }

        case 'numberedActiveAnnotation':

            const annotations = botanistState.annotations as fullAnnotation[]
            const index = botanistState.activeAnnotationIndex as number
            const annotation = annotations[index - 2]

            return {
                ...botanistState,
                activeAnnotationType: annotation.annotation_type as 'photo' | 'video' | 'model',
                activeAnnotationPosition: annotation.position as string,
                newAnnotationEnabled: false,
                repositionEnabled: false,
                activeAnnotationTitle: annotation.title ?? '',
                activeAnnotation: annotation.annotation
            }

        case 'newModelOrAnnotation':

            const newModelAction = action as NewModelOrAnnotation
            const modelAnnotations = newModelAction.modelAnnotations

            return {
                ...botanistState,
                annotations: modelAnnotations.annotations,
                numberOfAnnotations: modelAnnotations.annotations.length,
                activeAnnotationIndex: undefined,
                position3D: undefined,
                newAnnotationEnabled: false,
                firstAnnotationPosition: newModelAction.annotationPosition,
                activeAnnotation: undefined,
                repositionEnabled: false
            }

        case 'newModelClicked':

            const modelClickedAction = action as NewModelClicked
            const model = modelClickedAction.model

            return {
                ...botanistState,
                firstAnnotationPosition: undefined,
                specimenName: model.spec_name,
                uid: model.uid,
                sid: model.sid
            }

        case 'newAnnotationClicked':

            return {
                ...botanistState,
                newAnnotationEnabled: true,
                activeAnnotationIndex: 'new',
                repositionEnabled: false
            }

        case 'newAnnotationCancelled':

            return {
                ...botanistState,
                newAnnotationEnabled: false,
                activeAnnotationIndex: undefined,
                cancelledAnnotation: !botanistState.cancelledAnnotation
            }

        case 'setActiveAnnotationIndex':

            const setIndexAction = action as SetActiveAnnotationIndex

            return {
                ...botanistState,
                activeAnnotationIndex: setIndexAction.index
            }

        case 'setPosition':

            const setPositionAction = action as SetPosition

            return {
                ...botanistState,
                position3D: setPositionAction.position
            }

        case 'setRepositionEnabled':

            return {
                ...botanistState,
                repositionEnabled: !botanistState.repositionEnabled
            }

        case 'annotationSavedOrDeleted':

            return {
                ...botanistState,
                annotationSavedOrDeleted: !botanistState.annotationSavedOrDeleted
            }

        case 'setUidUndefined':

            return {
                ...botanistState,
                uid: undefined
            }

        case 'undefineUidAndActiveAnnotation':

            return {
                ...botanistState,
                uid: undefined,
                activeAnnotationIndex: undefined
            }

        default: throw new Error('Unkown dispatch type')
    }
}