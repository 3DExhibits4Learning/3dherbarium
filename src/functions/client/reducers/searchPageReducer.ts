/**
 * @file src/functions/client/reducers/searchPageReducer.ts
 * 
 * @fileoverview simple reducer for the collections page media state (model, observations or images)
 */

'use client'

import { SearchPageAction, SetCommunityModels, SetSearchString, SetSearchStringArray } from "@/ts/reducer"
import { SearchPageState } from "@/ts/search"

/**
 * 
 * @param mediaState previous stat object (not used, but required parameter)
 * @param action dispatch action
 * @returns CollectionsMediaObject
 */
export default function searchPageReducer(searchPageState: SearchPageState, action: SearchPageAction ): SearchPageState  {

    switch (action.type) {

        case 'setStringValue':

        const setStringAction = action as SetSearchString

            return {
                ...searchPageState,
                [setStringAction.field]: setStringAction.value,
            }

        case 'setStringArray':

        const setStringArrayAction = action as SetSearchStringArray

            return {
                ...searchPageState,
                [setStringArrayAction.field]: setStringArrayAction.value
            }

        case 'setCommunityModels':

            const setCommunityModelAction = action as SetCommunityModels

            return {
                ...searchPageState,
                communityModels: setCommunityModelAction.communityModels
            }

        case 'setCommunityIncluded':

            return {
                ...searchPageState,
                communityIncluded: true,
            }

        case 'setCommunityNotIncluded':

            return {
                ...searchPageState,
                communityIncluded: false
            }

        default: throw new Error('Unkown dispatch type')
    }
}