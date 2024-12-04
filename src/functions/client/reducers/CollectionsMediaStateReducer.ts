/**
 * @file src/functions/client/reducers/CollectionsMediaStateReducer.ts
 * 
 * @fileoverview simple reducer for the collections page media state (model, observations or images)
 */

'use client'

import { CollectionsMediaObject, CollectionsMediaAction } from "@/ts/reducer"

/**
 * 
 * @param mediaState previous stat object (not used, but required parameter)
 * @param action dispatch action
 * @returns CollectionsMediaObject
 */
export default function collectionsMediaReducer(mediaState: CollectionsMediaObject, action: CollectionsMediaAction): CollectionsMediaObject {
    switch (action.type) {
        case 'modelChecked':
            return {
                modelChecked: true,
                observationsChecked: false,
                photosChecked: false
            }
        case 'observationsChecked':
            return {
                modelChecked: false,
                observationsChecked: true,
                photosChecked: false
            }
        case 'photosChecked':
            return {
                modelChecked: false,
                observationsChecked: false,
                photosChecked: true
            }
    }
}