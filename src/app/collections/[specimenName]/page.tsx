/**
 * @file /app/collections/[specimenName]/page.tsx
 * @fileoverview the collections page for when users are viewing a specific specimen (genus or species).
 * Contains the 3D model (if it exists), images and occurrence map.
 */

import { GbifImageResponse, GbifResponse } from "@/api/types"
import { getModel } from '@/api/queries'
import { fetchCommonNameInfo, fetchSpecimenGbifInfo, fetchGbifImages } from "@/api/fetchFunctions"
import { fetchHSCImages } from "@/api/fetchFunctions"
import Foot from '@/components/Shared/Foot'
import dynamic from "next/dynamic"
import { model } from "@prisma/client"
const Header = dynamic(() => import('@/components/Header/Header'), { ssr: false })
const CollectionsWrapper = dynamic(() => import('@/components/Collections/CollectionsWrapper'), { ssr: false })

// communityId to be used here in the future
export default async function Page({ params, searchParams }: { params: { specimenName: string }, searchParams: {communityId: string} }) {

  // Variable declarations
  let redirectUrl: string | null = null;
  var promises = []
  var gMatch: any
  var _3dmodel: any
  var noModelData: any
  var images: any
  const decodedSpecimenName = decodeURI(params.specimenName)

  // Populate promises then await the results
  promises.push(fetchSpecimenGbifInfo(params.specimenName), getModel(decodedSpecimenName))

  await Promise.all(promises).then(results => {
    
    gMatch = results[0] as { hasInfo: boolean; data?: GbifResponse },
    _3dmodel = results[1] as model[],
    images = fetchHSCImages(params.specimenName)
    noModelData = { title: 'Images from the Cal Poly Humboldt Vascular Plant Herbarium', images: images }
  })

  // Fetch general GBIF images if the HSC (CPH Vascular plant herbarium) doens't have any for the search specimen
  if (!images.length && gMatch.hasInfo) {
    images = await fetchGbifImages(gMatch.data.usageKey, gMatch.data.rank)
    noModelData = { title: 'Images from the Global Biodiversity Information Facility', images: images }
  }

  // If there is a 3d model for the searched specimen or image data for the specimen searched, continue
  if (_3dmodel.length || images) { }

  // If there are no models, search for common name information. If there is no common name information, display appropriate message. If there is, populate the redirect url.
  else {
    const commonNameInfo = await fetchCommonNameInfo(params.specimenName);

    if (commonNameInfo.length <= 0) {
      return (
        <>
          <Header headerTitle={params.specimenName} pageRoute="collections" />
          <div className="h-[calc(100vh-177px)] w-full flex justify-center items-center text-center text-2xl px-5">
            <p>No data found for search term &quot;{decodeURI(params.specimenName)}.&quot; Try a species, genus or vernacular name.</p>
          </div>
          <Foot />
        </>
      )
    }
    else {
      redirectUrl = `/collections/common-name/${params.specimenName}`
    }
  }
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <title>3D Herbarium Collections</title>

      {/* <Header
        searchTerm={params.specimenName}
        headerTitle={params.specimenName}
        hasModel={!!_3dmodel.length}
        pageRoute="collections" /> */}

      <CollectionsWrapper
        redirectUrl={redirectUrl}
        model={_3dmodel}
        gMatch={gMatch}
        specimenName={params.specimenName}
        noModelData={noModelData as { title: string, images: GbifImageResponse[] }}
      />

    </>
  )
}


