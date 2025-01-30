/**
 * @file src/functions/client/search.ts
 * 
 * @fileoverview search client logic file
 */

import { SearchPageParams, SearchPageState } from "@/ts/search";
import { model } from "@prisma/client";
import { MutableRefObject, SetStateAction, Dispatch } from "react";

/**
 * 
 * @param models 
 * @returns 
 */
export const getUniqueModelers = (models: model[]): string[] => {
  const uniqueModelers = new Set<string>();
  models.forEach(model => uniqueModelers.add(model.modeled_by as string))
  return Array.from(uniqueModelers)
}

/**
 * 
 * @param models 
 * @returns 
 */
export const getUniqueAnnotators = (models: model[]): string[] => {
  const uniqueAnnotators = new Set<string>()
  // Filter only necessary because unannotated models appear on the collections page in development environments
  models.filter(model => model.annotator !== null).forEach(model => uniqueAnnotators.add(model.annotator as string))
  return Array.from(uniqueAnnotators)
}

export const initializeSearchPage = async (siteReadyModels: MutableRefObject<model[]>, searchPageState: SearchPageState, setSearchPageState: Dispatch<SetStateAction<SearchPageState>>, paramObject: SearchPageParams) => {

  const communityModels = await fetch('/api/collections/models/community').then(res => res.json()).then(json => json.response)

  await fetch('/api/collections/models').then(res => res.json()).then(json => {

    siteReadyModels.current = json.response

    let modelers = getUniqueModelers(siteReadyModels.current as model[])
    let annotators = getUniqueAnnotators(siteReadyModels.current as model[])

    modelers.unshift('All')
    annotators.unshift('All')

    if (paramObject.modeler && modelers.includes(paramObject.modeler)) setSearchPageState({ ...searchPageState, selectedModeler: paramObject.modeler })
    if (paramObject.annotator && annotators.includes(paramObject.annotator)) setSearchPageState({ ...searchPageState, selectedAnnotator: paramObject.annotator })
    if (paramObject.order && ['Newest First', 'Alphabetical', 'Reverse Alphabetical'].includes(paramObject.order)) setSearchPageState({ ...searchPageState, order: paramObject.order })

    setSearchPageState({ ...searchPageState, communityModels: communityModels, modeledByList: modelers, annotatedByList: annotators })
  })
}