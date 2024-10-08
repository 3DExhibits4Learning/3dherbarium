/**
 * @file /components/Search/SearchPageContent.tsx
 * @fileoverview list of 3D models available on the site.
 */

'use client'

import { useEffect, useState, useRef, SetStateAction, Dispatch } from "react"
import SearchPageModelList from "./SearchPageModelList"
import SubHeader from "./SubHeader"
import { fullUserSubmittal } from "@/api/types"
import { model } from "@prisma/client"

// For filtering
const getUniqueModelers = (models: model[]): string[] => {
  const uniqueModelers = new Set<string>();
  models.forEach(model => uniqueModelers.add(model.modeled_by as string))
  return Array.from(uniqueModelers)
}

// For filtering
const getUniqueAnnotators = (models: model[]): string[] => {
  const uniqueAnnotators = new Set<string>()
  // Filter only necessary because unannotated models appear on the collections page in development environments
  models.filter(model => model.annotator !== null).forEach(model => uniqueAnnotators.add(model.annotator as string))
  return Array.from(uniqueAnnotators)
}

// Main Component
const SearchPageContent = () => {

  const siteReadyModels = useRef<model[]>()
  
  const [communityModels, setCommunityModels] = useState<fullUserSubmittal[]>()
  const [modeledByList, setModeledByList] = useState<string[]>()
  const [annotatedByList, setAnnotatedByList] = useState<string[]>()
  const [selectedModeler, setSelectedModeler] = useState<string | undefined>('')
  const [selectedAnnotator, setSelectedAnnotator] = useState<string | undefined>('')
  const [order, setOrder] = useState<string>('Newest First')

  useEffect(() => {

    let promises = []

    const getModels = fetch('/api/collections/models')
    .then(res => res.json())
    .then(json => {
        
        siteReadyModels.current = json.response
        
        let a = getUniqueModelers(siteReadyModels.current as model[])
        let b = getUniqueAnnotators(siteReadyModels.current as model[])
        
        a.unshift('All'); b.unshift('All')
        
        setModeledByList(a)
        setAnnotatedByList(b)
      })

    const getCommunityModels = fetch('/api/collections/models/community').then(res => res.json()).then(json => setCommunityModels(json.response))

    promises.push(getModels, getCommunityModels)
    
    const getAllModels = async() => {
      await Promise.all(promises)
    }

    getAllModels()

  }, [])

  return (
    <>
      {
        modeledByList && annotatedByList && communityModels && 
        <>
          <SubHeader modeledByList={modeledByList} annotatedByList={annotatedByList} setSelectedModeler={setSelectedModeler} setSelectedAnnotator={setSelectedAnnotator} setOrder={setOrder as Dispatch<SetStateAction<string>>} />
          <br />
            <SearchPageModelList models={siteReadyModels.current as model[]} selectedModeler={selectedModeler} selectedAnnotator={selectedAnnotator} communityModels={communityModels} order={order} />
            <br />
        </>
      }
    </>
  )
}

export default SearchPageContent