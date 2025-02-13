/**
 * @file src/app/api/collections/herbarium/route.tsx
 * 
 * @fileoverview route handler for client side Herbarium class
 */

// PATH
const path = 'src/app/api/collections/herbarium/route.tsx'

// Typical imports
import { getModelByUid } from '@/functions/server/queries'
import { fetchGbifProfile, fetchGbifVernacularNames, fetchWikiSummary } from "@/functions/server/fetchFunctions";
import { toUpperFirstLetter } from '@/functions/server/utils/toUpperFirstLetter';
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from '@/functions/server/error';

// Default imports
import prisma from '@/functions/server/utils/prisma';

export async function GET(request: Request) {

    try {

        // Variable initialization
        var results: any[] = []
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get('uid') as string
        const usageKey = parseInt(searchParams.get('usageKey') as string)
        const specimenName = searchParams.get('specimenName') as string
        const sid = searchParams.get('sid') as string

        // Throw error if data is miissing
        if (!(uid || usageKey || specimenName || sid)) throw Error('Input data missing')

        // Specimen metadata promises
        const promises = [
            fetchGbifVernacularNames(usageKey),
            prisma.software.findMany({ where: { uid: uid } }),
            prisma.image_set.findMany({ where: { uid: uid } }),
            fetchGbifProfile(usageKey),
            fetchWikiSummary(specimenName),
            prisma.specimen.findFirst({ where: { sid: sid } })
        ]

        // Await promises, throw error if there are issues gathering metadata
        await Promise.all(promises).then(res => results.push(...res)).catch(e => routeHandlerErrorHandler(path, e.message, 'Promise.all(promises)', "Coulnd't instantiate herbarium object"))
        
        // Use common name from 3D model in the event that no vernacular names are found (this has occurred in the past)
        if (!results[0].length) results[0] = await getModelByUid(uid).then(model => [toUpperFirstLetter(model?.pref_comm_name as string)]).catch(e => routeHandlerErrorHandler(path, e.message, 'getModelByUid', "Coulnd't get model"))

        // Typical response
        return Response.json({ data: "Success", response: results })
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}