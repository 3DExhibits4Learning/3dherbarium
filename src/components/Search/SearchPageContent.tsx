/**
 * @file /components/Search/SearchPageContent.tsx
 * 
 * @fileoverview list of 3D models available on the site.
 * 
 */

'use client'

// Typical imports
import { useEffect, useState, useRef, MutableRefObject } from "react"
import { model } from "@prisma/client"
import { useSearchParams } from "next/navigation"
import { initializeSearchPage } from "@/functions/client/search"
import { SearchPageState, SearchPageParams, initialState } from "@/ts/search"

// Default imports
import MobileSearchFilters from "./MobileFilters"
import SearchPageModelList from "./SearchPageModelList"
import SubHeader from "./SubHeader"

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

  // Ref for site ready models
  const siteReadyModels = useRef<model[]>(undefined)

  // State object for this component and its three immediate children
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