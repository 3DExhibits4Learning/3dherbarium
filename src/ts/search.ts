import { fullUserSubmittal } from "@/api/types";

export interface SearchPageState {
    communityModels: fullUserSubmittal[] | undefined
    modeledByList: string[] | undefined
    annotatedByList: string[] | undefined
    selectedAnnotator: string
    selectedModeler: string
    order: string
    communityIncluded: boolean
}

export interface SearchPageParams {
    modeler: string | null,
    annotator: string | null,
    order: string | null,
  }
