import { fullUserSubmittal } from "@/ts/types";

export interface SearchPageState {
    communityModels: fullUserSubmittal[] | undefined
    modeledByList: string[] | undefined
    annotatedByList: string[] | undefined
    selectedAnnotator: string
    selectedModeler: string
    order: string
    communityIncluded: boolean
}

export const initialState = {
    communityModels: undefined,
    modeledByList: undefined,
    annotatedByList: undefined,
    selectedAnnotator: 'All',
    selectedModeler: 'All',
    order: 'Newest First',
    communityIncluded: true
  }

export interface SearchPageParams {
    modeler: string | null,
    annotator: string | null,
    order: string | null,
  }
