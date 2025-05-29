/**
 * @file src/components/Search/SearchPageModelList.tsx
 * 
 * @fileoverview search client component listing all site ready 3D models
 * 
 * @todo determine where community models are leaking into the filteredModel array before they are supposed to be pushed
 * @todo handle duplicates pushed onto filtredModel array allowing duplicate check to be removed
 */

// Typical imports
import { useContext, Dispatch, SetStateAction} from 'react'
import { model, userSubmittal } from '@prisma/client'
import { fullUserSubmittal } from '@/ts/types'
import { QueryContext } from './SearchClient'
import { SearchPageState } from '@/ts/search'
import { get2dModelArray, sortModelsByOrder } from '@/functions/client/search'

// Default imports
import LazyLoader from '@/components/Search/LazyLoader'

// Main JSX
export default function SearchPageModelList(props: { state: SearchPageState, setState: Dispatch<SetStateAction<SearchPageState>>, models: model[] }) {

  // Props => variables
  const state = props.state
  const models = props.models
  const selectedModeler = state.selectedModeler
  const selectedAnnotator = state.selectedAnnotator
  var communityModels = state.communityModels as fullUserSubmittal[]

  // Query context from search client
  const query = useContext(QueryContext).query

  // Filter by modeler and annotator
  var filteredModels: Array<fullUserSubmittal | model> = selectedAnnotator === 'All' && selectedModeler === 'All' ? models :
    models.filter(model => (selectedModeler === 'All' || model.modeled_by === selectedModeler) && (selectedAnnotator === 'All' || model.annotator === selectedAnnotator))

  // Filter by search query if a query exists
  if (query) {
    filteredModels = filteredModels.filter(model => !Object.keys(model).includes('confirmation')) // Need to figure out where a community model is sneaking into this array which should only have herbarium models at this point
    filteredModels = filteredModels.filter(model => (model as model).spec_name.toLowerCase().includes(query.toLowerCase()) || (model as model).pref_comm_name.toLowerCase().includes(query.toLowerCase()))
    communityModels = communityModels.filter(model => model.speciesName.toLowerCase().includes(query.toLowerCase()) || model.commonName.toLowerCase().includes(query.toLowerCase()))
  }

  // A bug is causing community model duplicates when a query is started and then deleted; this is the temporary patch
  filteredModels = Array.from(new Set(filteredModels.map(model => JSON.stringify(model)).map(string => JSON.parse(string))))

  // Join herbarium models and community models if there is no selected modeler or annotator and the corresponding checkbox is checked; sort models by order
  if (selectedModeler === 'All' && selectedAnnotator === 'All' && state.communityIncluded) filteredModels.push(...communityModels)
  filteredModels = sortModelsByOrder(filteredModels, state.order as 'Newest First' | 'Alphabetical' | 'Reverse Alphabetical')

  // Finally, return a filtered array of arrays of a maxiumum of 12 models
  const filteredChunks = get2dModelArray(filteredModels) as unknown as (model | fullUserSubmittal)[][]

  return <>
    {
      filteredModels && filteredModels.length === 0 &&
      <div className='h-[35rem] rounded mx-auto flex items-center justify-center'>
        <p className='text-2xl px-5'>No models found matching the current filters. Try adjusting your filter settings for broader results.</p>
      </div>
    }
    {filteredChunks.map((filteredChunk) => <LazyLoader key={(filteredChunk[0] as model).uid ?? (filteredChunk[0] as userSubmittal).confirmation} filteredModels={filteredChunk} />)}
  </>
}