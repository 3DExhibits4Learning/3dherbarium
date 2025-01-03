/**
 * @file src/app/collections/[specimenName]/page.tsx
 * 
 * @fileoverview the collections page for when users are viewing a specific specimen (genus or species).
 * Contains the 3D model (if it exists), images, and iNaturalist observations.
 * 
 * @todo move community model fetch logic here from client (CollectionsWrapper.tsx)
 */

// Typical imports
import { GbifImageResponse, GbifResponse, CommonNameInfo } from "@/api/types"
import { getModel } from '@/api/queries'
import { fetchCommonNameInfo, fetchSpecimenGbifInfo, fetchGbifImages } from "@/api/fetchFunctions"
import { fetchHSCImages } from "@/api/fetchFunctions"
import { model } from "@prisma/client"
import { redirect } from "next/navigation"
import { serverErrorHandler } from "@/functions/server/error"

// Default imports
import dynamic from "next/dynamic"
import NoDataFound from "@/components/Collections/NoData"
import FullPageError from "@/components/Error/FullPageError"

// Path
const path = 'src/app/collections/[specimenName]/page.tsx'

// Dynamic imports
const CollectionsWrapper = dynamic(() => import('@/components/Collections/CollectionsWrapper'), { ssr: false })

// Main JSX (communityId to be used here in the future, hence searchParams)
export default async function Page({ params, searchParams }: { params: { specimenName: string }, searchParams: { communityId: string } }) {

  try {

    // Variable declarations
    const promises = []
    var gMatch: any
    var _3dmodel: any
    var noModelData: any
    var images: any
    const decodedSpecimenName = decodeURI(params.specimenName)

    // Push initial promises onto array (GBIF data, 3D model data, HSC images)
    promises.push(fetchSpecimenGbifInfo(params.specimenName), getModel(decodedSpecimenName), fetchHSCImages(params.specimenName))

    // Await promises, populate noModelData object
    await Promise.all(promises).then(results => {
      gMatch = results[0] as { hasInfo: boolean; data?: GbifResponse }
      _3dmodel = results[1] as model[]
      images = results[2] as GbifImageResponse[]
      noModelData = { title: 'Images from the Cal Poly Humboldt Vascular Plant Herbarium', images: images }
    }).catch(e => serverErrorHandler(path, e.message, "Couldn't load initial data", "Promise.all()", false))

    // Fetch general GBIF images if the HSC (CPH Vascular plant herbarium) doens't have any for the searched specimen, but a GBIF match WAS found
    if (gMatch.hasInfo && !images.length) {
      images = await fetchGbifImages(gMatch.data.usageKey, gMatch.data.rank).catch(e => serverErrorHandler(path, e.message, "Couldn't get images", "fetchGbifImages()", false))
      noModelData = { title: 'Herbaria images from the Global Biodiversity Information Facility', images: images }
    }

    // If there are no models or images, search for common name information. If there is no common name information, display appropriate message. If there is, redirect to common name search.
    if (!(_3dmodel.length || images.length)) {

      // Fetch common name info
      const commonNameInfo = await fetchCommonNameInfo(params.specimenName).catch(e => serverErrorHandler(path, e.message, "Couldn't get vernacular name data", "fetchCommonNameInfo()", false)) as CommonNameInfo[]

      // If there is common name data, redirect to common name search; else display error component (redirect throws an internal error, hence the try-catch wrapper)
      if (commonNameInfo.length) { try { redirect(`/collections/common-name/${params.specimenName}`) } catch (e) { } }
      else return <NoDataFound specimenName={params.specimenName} />
    }

    // Typical client wrapper
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
        <meta name="description" content="A digital herbarium featuring annotated 3D models of various botanical specimens"></meta>
        <title>3D Herbarium Collections</title>
        <CollectionsWrapper model={_3dmodel} gMatch={gMatch} specimenName={params.specimenName} noModelData={noModelData as { title: string, images: GbifImageResponse[] }} />
      </>
    )
  }
  // Typical error component catch
  catch (e: any) { return <FullPageError clientErrorMessage={e.message} /> }
}


