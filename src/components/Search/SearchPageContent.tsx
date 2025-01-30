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
import { useEffect, useState, useRef, MutableRefObject } from "react"
import { model } from "@prisma/client"
import { useSearchParams } from "next/navigation"
import { initializeSearchPage } from "@/functions/client/search"
import { SearchPageState, SearchPageParams } from "@/ts/search"

// Default imports
import MobileSearchFilters from "./MobileFilters"
import SearchPageModelList from "./SearchPageModelList"
import SubHeader from "./SubHeader"

// Initial state object
const initialState = {
  communityModels: undefined,
  modeledByList: undefined,
  annotatedByList: undefined,
  selectedAnnotator: 'All',
  selectedModeler: 'All',
  order: 'Newest First',
  communityIncluded: true
}

// Main JSX
export default function SearchPageContent() {

  // Get params
  const params = useSearchParams()

  // Params object
  const paramObj: SearchPageParams = {
    modeler: params.get('modeler'),
    annotator: params.get('annotator'),
    order: params.get('order')
  }

  // Ref
  const siteReadyModels = useRef<model[]>()

  // State
  const [searchPageState, setSearchPageState] = useState<SearchPageState>(initialState)

  // Initialization effect
  useEffect(() => { initializeSearchPage(siteReadyModels as MutableRefObject<model[]>, searchPageState, setSearchPageState, paramObj) }, [])

  return <>
    {
      searchPageState.modeledByList && searchPageState.annotatedByList && searchPageState.communityModels &&
      <>
        <SubHeader state={searchPageState} setState={setSearchPageState} />
        <MobileSearchFilters state={searchPageState} setState={setSearchPageState} />
        <br />
        <SearchPageModelList state={searchPageState} setState={setSearchPageState} models={siteReadyModels.current as model[]} />
        <br />
      </>
    }
  </>
}