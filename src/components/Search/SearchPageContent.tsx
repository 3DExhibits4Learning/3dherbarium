/**
 * @file /components/Search/SearchPageContent.tsx
 * 
 * @fileoverview list of 3D models available on the site.
 * 
 * @todo refactor with context
 * @todo extract logic and the logic of children into src/functions/client/search.ts
 */

'use client'

// Typical imports
import { useEffect, useState, useRef, SetStateAction, Dispatch, useReducer } from "react"
import { fullUserSubmittal } from "@/api/types"
import { model } from "@prisma/client"
import { useSearchParams } from "next/navigation"
import { getUniqueAnnotators, getUniqueModelers } from "@/functions/client/search"
import { SearchPageState } from "@/ts/search"

// Default imports
import MobileSearchFilters from "./MobileFilters"
import SearchPageModelList from "./SearchPageModelList"
import SubHeader from "./SubHeader"
import searchPageReducer from "@/functions/client/reducers/searchPageReducer"

// Main Component
const SearchPageContent = () => {

  // Params
  const params = useSearchParams()
  const modeler = params.get('modeler')
  const annotator = params.get('annotator')
  const orderParam = params.get('order')

  // Ref
  const siteReadyModels = useRef<model[]>()

  const initialData: SearchPageState = {
    communityModels: undefined,
    modeledByList: undefined,
    annotatedByList: undefined,
    selectedAnnotator: 'All',
    selectedModeler: 'All',
    order: 'Newest First',
    communityIncluded: true
  }

  const [searchPageState, searchPageDispatch] = useReducer(searchPageReducer, initialData)

  const [communityModels, setCommunityModels] = useState<fullUserSubmittal[]>()
  const [modeledByList, setModeledByList] = useState<string[]>()
  const [annotatedByList, setAnnotatedByList] = useState<string[]>()
  const [selectedModeler, setSelectedModeler] = useState<string>('All')
  const [selectedAnnotator, setSelectedAnnotator] = useState<string>('All')
  const [order, setOrder] = useState<string>('Newest First')
  const [communityIncluded, setCommunityIncluded] = useState<boolean>(true)
  
  useEffect(() => {

    let promises: any = []

    const getModels = fetch('/api/collections/models').then(res => res.json()).then(json => {

        siteReadyModels.current = json.response

        let a = getUniqueModelers(siteReadyModels.current as model[])
        let b = getUniqueAnnotators(siteReadyModels.current as model[])

        a.unshift('All') 
        b.unshift('All')

        if(modeler && a.includes(modeler)) setSelectedModeler(modeler);
        if(annotator && b.includes(annotator)) setSelectedAnnotator(annotator)
        if(orderParam && ['Newest First', 'Alphabetical', 'Reverse Alphabetical'].includes(orderParam)) setOrder(orderParam)

        setModeledByList(a)
        setAnnotatedByList(b)
      })

    const getCommunityModels = fetch('/api/collections/models/community').then(res => res.json()).then(json => setCommunityModels(json.response))
    promises.push(getModels, getCommunityModels)

    const getAllModels = async () => await Promise.all(promises)

    getAllModels()

  }, [])

  return (
    <>
      {
        modeledByList && annotatedByList && communityModels &&
        <>
          <SubHeader
            modeledByList={modeledByList}
            annotatedByList={annotatedByList}
            setSelectedModeler={setSelectedModeler}
            setSelectedAnnotator={setSelectedAnnotator}
            order={order}
            setOrder={setOrder as Dispatch<SetStateAction<string>>}
            modeler={selectedModeler}
            annotator={selectedAnnotator}
            communityIncluded={communityIncluded}
            setCommunityIncluded={setCommunityIncluded}
          />

          <MobileSearchFilters
            modeledByList={modeledByList}
            annotatedByList={annotatedByList}
            setSelectedModeler={setSelectedModeler}
            setSelectedAnnotator={setSelectedAnnotator}
            order={order}
            setOrder={setOrder as Dispatch<SetStateAction<string>>}
            modeler={selectedModeler}
            annotator={selectedAnnotator}
            communityIncluded={communityIncluded}
            setCommunityIncluded={setCommunityIncluded}
          />

          <br />

          <SearchPageModelList
            models={siteReadyModels.current as model[]}
            selectedModeler={selectedModeler}
            selectedAnnotator={selectedAnnotator}
            communityModels={communityModels}
            order={order}
            communityIncluded={communityIncluded}
          />
          <br />
        </>
      }
    </>
  )
}

export default SearchPageContent