/**
 * @file src/components/Collections/CollectionsWrapper.tsx
 * @fileoverview client wrapper for the collections page
 * 
 */

"use client"

// Typical imports
import { useEffect, useState, createContext, useReducer } from 'react'
import { useSearchParams } from "next/navigation"
import { isMobileOrTablet } from '@/utils/isMobile';
import { userSubmittal } from '@prisma/client';
import { CollectionsWrapperData } from '@/ts/reducer';
import { CollectionsWrapperProps } from '@/ts/collections';
import { getCommunityModel } from '@/functions/client/collections/collectionsWrapper';

// Default imports
import Header from '../Header/Header';
import CollectionsSubheader from './SubHeader';
import ComponentDivider from '@/components/Shared/ComponentDivider'
import OccurrenceSwiper from "@/components/Collections/GbifSwiper"
import Inaturalist from '@/components/Collections/iNaturalist'
import CommunitySFAPI from '@/components/Collections/CommunitySFAPI'
import CommunityModelWithoutGmatch from '@/components/Collections/CommunityWithoutGmatch';
import collectionsMediaReducer from '@/functions/client/reducers/CollectionsMediaStateReducer';
import Foot from '@/components/Shared/Foot'
import CollectionsWrapperIdError from '../Error/CollectionsWrapper';
import CollectionsHerbariumModel from './CollectionsWrapper/HerbariumModel';

// Exported context
export const CollectionsContext = createContext<'' | CollectionsWrapperData>('')

// Main JSX
export default function MainWrap(props: CollectionsWrapperProps) {

  // Variable Declarations
  const collectionsWrapperProps = { ...props }
  const searchParams = useSearchParams()
  const modelHeight = isMobileOrTablet() ? "calc(100vh - 160px)" : "calc(100vh - 216.67px)"

  // User model, community id param, id error state, annotation switch boolean
  const [userModel, setUserModels] = useState<userSubmittal>()
  const [communityId] = useState<string | null>(searchParams.get('communityId'))
  const [idError, setIdError] = useState<boolean>(false)
  const [isSelected, setIsSelected] = useState(true)

  // Sizes object
  const [sizes, setSizes] = useState<any>({
    viewWidthInPx: window.outerWidth,
    viewportHeightInPx: window.outerHeight + 200,
    swiperHeight: window.outerHeight - 96,
    imgHeight: window.outerHeight - 208
  })

  // Resize handler (allows for scale on zoom in/out)
  window.onresize = () => setSizes({
    viewWidthInPx: window.outerWidth,
    viewportHeightInPx: window.outerHeight + 200,
    swiperHeight: window.outerHeight - 96,
    imgHeight: window.outerHeight - 208
  })

  // Initial media state
  const initialMediaState = {
    modelChecked: true,
    observationsChecked: false,
    photosChecked: false
  }

  // Media state reducer, context data
  const [mediaState, mediaStateDispatch] = useReducer(collectionsMediaReducer, initialMediaState)
  const collectionsContext: CollectionsWrapperData = { mediaState, mediaStateDispatch, collectionsWrapperProps }

  // Check for community model if there is a community ID parameter or no herbarium 3D model found for the searched specimen name
  useEffect(() => {if (communityId || !props.model.length) getCommunityModel(collectionsWrapperProps, communityId, setUserModels, setIdError)}, [])

  // Return error page if idError is true
  if (idError) return <CollectionsWrapperIdError specimenName={props.specimenName} />

  else {
    return (
      <>
        <Header
          searchTerm={props.specimenName}
          headerTitle={props.specimenName}
          hasModel={!!props.model.length}
          pageRoute="collections"
          annotationsEnabled={isSelected}
          setAnnotationsEnabled={setIsSelected}
        />
        {
          !!props.model.length && !communityId &&
          <CollectionsContext.Provider value={collectionsContext}>
            <CollectionsSubheader isSelected={isSelected} setIsSelected={setIsSelected} title={props.noModelData.title} />
            <CollectionsHerbariumModel sizes={sizes} modelHeight={modelHeight}/>
          </CollectionsContext.Provider>
        }

        {
          (!props.model.length || communityId) && userModel && props.gMatch.hasInfo &&
          <>
            <div className="hidden lg:flex h-10 bg-[#00856A] dark:bg-[#212121] text-white items-center justify-between ">
              <p style={{ paddingLeft: "2.5%" }}>Also on this page: <a className="mx-4" href="#images"><u>Images</u></a> <a href="#observations"><u>iNaturalist Observations</u></a></p>
            </div>
            <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: sizes.viewWidthInPx, margin: "0 auto !important" }}>
              <div style={{ height: modelHeight, maxHeight: sizes.viewportHeightInPx }}>
                <CommunitySFAPI model={userModel} gMatch={props.gMatch} images={props.noModelData.images} imageTitle={props.noModelData.title} />
              </div>
              {/* Tailwind utility class "mb" was literally broken here. Anything less than mb-4 was treated as zero margin. Only style would work. */}
              <div id="images" style={{ marginBottom: "14px" }} className="mt-4">
                <ComponentDivider title={props.noModelData.title} />
              </div>
              <div style={{ maxHeight: sizes.viewportHeightInPx }}>
                <OccurrenceSwiper
                  info={props.noModelData.images} swiperHeight={sizes.swiperHeight} imageHeight={sizes.imgHeight} />
              </div>
              <div id='observations' className="mt-4">
                <ComponentDivider title={'Observations from iNaturalist'} />
              </div>
              <div style={{ height: "calc(100vh - 176px)", maxHeight: sizes.viewportHeightInPx, minHeight: '750px' }}>
                <Inaturalist activeSpecies={props.specimenName} />
              </div>
              <Foot />
            </div>
          </>
        }

        {
          (!props.model.length || communityId) && userModel && !props.gMatch.hasInfo &&
          <>
            <CommunityModelWithoutGmatch communityModel={userModel} />
            <Foot />
          </>
        }

        {
          !props.model.length && props.gMatch.hasInfo && userModel === undefined &&
          <>
            <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: sizes.viewWidthInPx, margin: "0 auto !important" }}>
              {/* lg breakpoint in tailwind not working here, hence id and hard coded breakpoint in globals */}
              <div id='tailwindBroken' className="h-14 !lg:h-8 bg-[#00856A] dark:bg-[#3d3d3d] text-white flex justify-center items-center text-center">
                <p><i>{`"${decodeURI(props.specimenName)}" `}</i>{`${props.noModelData.title}`}</p>
              </div>
              <div style={{ maxHeight: sizes.viewportHeightInPx }}>
                <OccurrenceSwiper
                  info={props.noModelData.images} swiperHeight={sizes.swiperHeight} imageHeight={sizes.imgHeight} />
              </div>
              <div className="mt-4">
                <ComponentDivider title='iNaturalist Observations' />
              </div>
              <div style={{ height: "calc(100vh - 176px)", maxHeight: sizes.viewportHeightInPx }}>
                <Inaturalist activeSpecies={props.specimenName} />
              </div>
              <Foot />
            </div>
          </>
        }
      </>
    )
  }
}


