/**
 * @file  src/components/Collections/CollectionsWrapper.tsx
 * 
 * @fileoverview client wrapper for the collections page
 */

"use client"

// Typical imports
import { useEffect, useState, createContext, useReducer } from 'react'
import { useRouter, useSearchParams } from "next/navigation"
import { isMobileOrTablet } from '@/utils/isMobile';
import { model, userSubmittal } from '@prisma/client';
import { GbifResponse, GbifImageResponse } from '@/api/types';
import { CollectionsWrapperData } from '@/ts/reducer';

// Default imports
import Header from '../Header/Header';
import CollectionsSubheader from './SubHeader';
import ComponentDivider from '@/components/Shared/ComponentDivider'
import OccurrenceSwiper from "@/components/Collections/GbifSwiper"
import Inaturalist from '@/components/Collections/iNaturalist'
import dynamic from 'next/dynamic'
import CommunitySFAPI from '@/components/Collections/CommunitySFAPI'
import CommunityModelWithoutGmatch from '@/components/Collections/CommunityWithoutGmatch';
import collectionsMediaReducer from '@/functions/client/reducers/CollectionsMediaStateReducer';
import Foot from '@/components/Shared/Foot'

// Dynamic imports
const SketchfabApi = dynamic(() => import('@/components/Collections/SketchFabAPI'), { ssr: false })

// Exported context
export const CollectionsContext = createContext<'' | CollectionsWrapperData>('')

// Main JSX
export default function MainWrap(props: {
  redirectUrl: string | null,
  model: model[],
  gMatch: { hasInfo: boolean, data?: GbifResponse },
  specimenName: string,
  noModelData: { title: string, images: GbifImageResponse[] }
}) {

  // Variable Declarations
  const redirectUrl: string | null = props.redirectUrl
  const router = useRouter();
  var modelHeight = isMobileOrTablet() ? "calc(100vh - 160px)" : "calc(100vh - 216.67px)"
  const searchParams = useSearchParams()

  // Height states
  const [viewWidthInPx, setViewWidthInPx] = useState(window.outerWidth)
  const [viewportHeightInPx, setViewportHeightInPx] = useState(window.outerHeight + 200)
  const [swiperHeight, setSwiperHeight] = useState(window.outerHeight - 96)
  const [imgHeight, setImageHeight] = useState(window.outerHeight - 208)

  // User models, community id param, id error state
  const [userModel, setUserModels] = useState<userSubmittal>()
  const [communityId] = useState<string | null>(searchParams.get('communityId'))
  const [idError, setIdError] = useState<boolean>(false)

  // Annotation switch bool
  const [isSelected, setIsSelected] = useState(true)

  const initialMediaState = {
    modelChecked: true,
    observationsChecked: false,
    photosChecked: false
  }

  const [mediaState, mediaStateDispatch] = useReducer(collectionsMediaReducer, initialMediaState)
  const collectionsContext = { mediaState, mediaStateDispatch }

  useEffect(() => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [redirectUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  if (typeof (window)) {
    window.onresize = () => {
      setViewportHeightInPx(window.outerHeight + 200)
      setViewWidthInPx(window.outerWidth)
      setSwiperHeight(window.outerHeight)
      setImageHeight(window.outerHeight - 112)
    }
  }

  //var screenSize: boolean = window.matchMedia(("(max-width: 768px)")).matches
  //var txtSize: string = screenSize ? "1rem" : "1.4rem"

  useEffect(() => {

    switch (communityId) {

      case (null):

        if (!props.model.length) {
          const getCommunityModel = async () => {
            const userModels = await fetch(`/api/collections/models/community/speciesSearch?species=${props.specimenName}`)
              .then(res => res.json()).then(json => json.response)

            if (userModels.length) setUserModels(userModels[0])
          }
          getCommunityModel()
        }

        break

      default:

        const getCommunityModel = async () => {
          const userModel = await fetch(`/api/collections/models/community/uidSearch?uid=${communityId}`)
            .then(res => res.json()).then(json => json.response)

          if (userModel) setUserModels(userModel)
          else setIdError(true)
        }
        getCommunityModel()

        break
    }

  }, [])

  if (idError) {
    return (
      <>
        <section className='min-h-[calc(100vh-177px)]'>
          <p>Model not found</p>
        </section>
        <Foot />
      </>
    )
  }

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
            <CollectionsSubheader isSelected={isSelected} setIsSelected={setIsSelected} title={props.noModelData.title}/>
            <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: viewWidthInPx, margin: "0 auto !important" }}>
              {
                mediaState.modelChecked &&
                <div style={{ height: modelHeight, maxHeight: viewportHeightInPx }}>
                  <SketchfabApi
                    model={props.model[0]}
                    gMatch={props.gMatch}
                    images={props.noModelData.images}
                    imageTitle={props.noModelData.title}
                  />
                </div>
              }
              {
                mediaState.photosChecked &&
                  <div style={{ maxHeight: viewportHeightInPx }}>
                    <OccurrenceSwiper
                      info={props.noModelData.images} swiperHeight={swiperHeight} imageHeight={imgHeight} />
                  </div>
              }
              {
                mediaState.observationsChecked &&
                  <div style={{ height: "calc(100vh - 217px)", maxHeight: viewportHeightInPx, minHeight: '750px' }}>
                    <Inaturalist activeSpecies={props.specimenName} />
                  </div>
              }
              <Foot />
            </div>
          </CollectionsContext.Provider>
        }

        {
          (!props.model.length || communityId) && userModel && props.gMatch.hasInfo &&
          <>
            <div className="hidden lg:flex h-10 bg-[#00856A] dark:bg-[#212121] text-white items-center justify-between ">
              <p style={{ paddingLeft: "2.5%" }}>Also on this page: <a className="mx-4" href="#images"><u>Images</u></a> <a href="#observations"><u>iNaturalist Observations</u></a></p>
            </div>
            <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: viewWidthInPx, margin: "0 auto !important" }}>
              <div style={{ height: modelHeight, maxHeight: viewportHeightInPx }}>
                <CommunitySFAPI model={userModel} gMatch={props.gMatch} images={props.noModelData.images} imageTitle={props.noModelData.title} />
              </div>
              {/* Tailwind utility class "mb" was literally broken here. Anything less than mb-4 was treated as zero margin. Only style would work. */}
              <div id="images" style={{ marginBottom: "14px" }} className="mt-4">
                <ComponentDivider title={props.noModelData.title} />
              </div>
              <div style={{ maxHeight: viewportHeightInPx }}>
                <OccurrenceSwiper
                  info={props.noModelData.images} swiperHeight={swiperHeight} imageHeight={imgHeight} />
              </div>
              <div id='observations' className="mt-4">
                <ComponentDivider title={'Observations from iNaturalist'} />
              </div>
              <div style={{ height: "calc(100vh - 176px)", maxHeight: viewportHeightInPx, minHeight: '750px' }}>
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
            <div className="flex flex-col m-auto" style={{ width: "100vw", maxWidth: viewWidthInPx, margin: "0 auto !important" }}>
              {/* lg breakpoint in tailwind not working here, hence id and hard coded breakpoint in globals */}
              <div id='tailwindBroken' className="h-14 !lg:h-8 bg-[#00856A] dark:bg-[#3d3d3d] text-white flex justify-center items-center text-center">
                <p><i>{`"${decodeURI(props.specimenName)}" `}</i>{`${props.noModelData.title}`}</p>
              </div>
              <div style={{ maxHeight: viewportHeightInPx }}>
                <OccurrenceSwiper
                  info={props.noModelData.images} swiperHeight={swiperHeight} imageHeight={imgHeight} />
              </div>
              <div className="mt-4">
                <ComponentDivider title='iNaturalist Observations' />
              </div>
              <div style={{ height: "calc(100vh - 176px)", maxHeight: viewportHeightInPx }}>
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


