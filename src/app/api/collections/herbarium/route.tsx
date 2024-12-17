import { getSoftwares, getImageSet, getModelByUid } from '@/api/queries'
import { fetchGbifProfile, fetchGbifVernacularNames, fetchWikiSummary } from "@/api/fetchFunctions";
import { toUpperFirstLetter } from '@/utils/toUpperFirstLetter';
import { getWikiPediaPageOrSummary } from '@/functions/server/collections';

export async function GET(request: Request) {

    var results: any[] = []

    try {

        // Variable ini
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get('uid') as string
        const usageKey = parseInt(searchParams.get('usageKey') as string)
        const specimenName = searchParams.get('specimenName') as string

        // Throw error if data is missing
        if(!uid || !usageKey || !specimenName){throw Error('/api/collections/herbarium: Missing input data')}

        // Specimen metadata promises
        const promises = [
            fetchGbifVernacularNames(usageKey),
            getSoftwares(uid),
            getImageSet(uid),
            fetchGbifProfile(usageKey),
            fetchWikiSummary(specimenName),
        ]

        // Await promises, throw error if there are issues gathering metadata
        await Promise.all(promises).then(res => results.push(...res)).catch((e) =>{
            console.error(e.message)
            throw Error('/api/collections/herbarium: Error getting specimen metadata')
        })

        if(!results[0].length){
            results[0] = await getModelByUid(uid).then(model => [toUpperFirstLetter(model?.pref_comm_name as string)]).catch((e) =>{
                console.error(e.message)
                throw Error('/api/collections/herbarium: Error getting model by uid')
            })
        }

        return Response.json({data:"Success", response: results})
    }
    catch (e: any) { return Response.json({ data: e.message, response: results }, {status:400, statusText:e.message}) }
}