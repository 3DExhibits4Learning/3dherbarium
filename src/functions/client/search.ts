/**
 * @file src/functions/client/search.ts
 * 
 * @fileoverview search client logic file
 */

import { fullUserSubmittal } from "@/api/types";
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

/**
 * 
 * @param siteReadyModels 
 * @param searchPageState 
 * @param setSearchPageState 
 * @param paramObject 
 */
export const initializeSearchPage = async (siteReadyModels: MutableRefObject<model[]>, searchPageState: SearchPageState, setSearchPageState: Dispatch<SetStateAction<SearchPageState>>, paramObject: SearchPageParams) => {

  // Await the community models
  const communityModels = await fetch('/api/collections/models/community').then(res => res.json()).then(json => json.response)

  // Await fetch of site ready models
  await fetch('/api/collections/models').then(res => res.json()).then(json => {

    // Site ready models assigned to ref
    siteReadyModels.current = json.response

    // Get unique modelers and annotators
    let modelers = getUniqueModelers(siteReadyModels.current as model[])
    let annotators = getUniqueAnnotators(siteReadyModels.current as model[])

    // Preface each array with an 'all' option
    modelers.unshift('All')
    annotators.unshift('All')

    // This needs to be restructured
    if (paramObject.modeler && modelers.includes(paramObject.modeler)) setSearchPageState({ ...searchPageState, selectedModeler: paramObject.modeler })
    if (paramObject.annotator && annotators.includes(paramObject.annotator)) setSearchPageState({ ...searchPageState, selectedAnnotator: paramObject.annotator })
    if (paramObject.order && ['Newest First', 'Alphabetical', 'Reverse Alphabetical'].includes(paramObject.order)) setSearchPageState({ ...searchPageState, order: paramObject.order })

    setSearchPageState({ ...searchPageState, communityModels: communityModels, modeledByList: modelers, annotatedByList: annotators })
  })
}

/**
 * 
 * @param models 
 * @param order 
 * @returns 
 */
export const sortModelsByOrder = (models: Array<model | fullUserSubmittal>, order: 'Newest First' | 'Alphabetical' | 'Reverse Alphabetical') => {
  
  return models.sort((a: any, b: any) => {

    var returnValue

    switch (order) {

      case 'Alphabetical': // These two data names should be unified in the database to avoid further blocks such as this one

        if (Object.keys(a).includes('speciesName') && Object.keys(b).includes('spec_name')) {
          const value = a.speciesName.localeCompare(b.spec_name) as number
          returnValue = value
        }
        else if (Object.keys(a).includes('spec_name') && Object.keys(b).includes('speciesName')) {
          const value = a.spec_name.localeCompare(b.speciesName) as number
          returnValue = value
        }
        else if (Object.keys(a).includes('speciesName') && Object.keys(b).includes('speciesName')) {
          const value = a.speciesName.localeCompare(b.speciesName) as number
          returnValue = value
        }
        else {
          const value = a.spec_name.localeCompare(b.spec_name) as number
          returnValue = value
        }

        break

      case 'Newest First': // These two data names should be unified in the database to avoid further blocks such as this one

        if (Object.keys(a).includes('dateTime') && Object.keys(b).includes('spec_acquis_date')) {
          const value = a.dateTime.localeCompare(b.spec_acquis_date) as number
          returnValue = -value
        }
        else if (Object.keys(a).includes('spec_acquis_date') && Object.keys(b).includes('dateTime')) {
          const value = a.spec_acquis_date.localeCompare(b.dateTime) as number
          returnValue = -value
        }
        else if (Object.keys(a).includes('dateTime') && Object.keys(b).includes('dateTime')) {
          const value = a.dateTime.localeCompare(b.dateTime) as number
          returnValue = -value
        }
        else {
          const value = a.spec_acquis_date.localeCompare(b.spec_acquis_date) as number
          returnValue = -value
        }

        break

      case 'Reverse Alphabetical': // These two data names should be unified in the database to avoid further blocks such as this one

        if (Object.keys(a).includes('speciesName') && Object.keys(b).includes('spec_name')) {
          const value = a.speciesName.localeCompare(b.spec_name) as number
          returnValue = -value
        }
        else if (Object.keys(a).includes('spec_name') && Object.keys(b).includes('speciesName')) {
          const value = a.spec_name.localeCompare(b.speciesName) as number
          returnValue = -value
        }
        else if (Object.keys(a).includes('speciesName') && Object.keys(b).includes('speciesName')) {
          const value = a.speciesName.localeCompare(b.speciesName) as number
          returnValue = -value
        }
        else {
          const value = a.spec_name.localeCompare(b.spec_name) as number
          returnValue = -value
        }

        break
    }

    return returnValue as number
  })
}