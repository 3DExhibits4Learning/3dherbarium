import { getSoftwares, getImageSet } from '@/api/queries'
import { fetchGbifProfile, fetchGbifVernacularNames, fetchWikiSummary, fetchHSCImages } from "@/api/fetchFunctions";

export async function GET(request: Request) {
    try {

        const { searchParams } = new URL(request.url)

        const uid = searchParams.get('uid') as string
        const usageKey = parseInt(searchParams.get('usageKey') as string)
        const specimenName = searchParams.get('specimenName') as string

        var results: any[] = []

        const promises = [
            fetchGbifVernacularNames(usageKey),
            getSoftwares(uid),
            getImageSet(uid),
            fetchGbifProfile(usageKey),
            fetchWikiSummary(specimenName),
        ]

        await Promise.all(promises).then(res => results.push(...res))

        return Response.json({data:"Success", response: results})
    }
    catch (e: any) { return Response.json({ data: 'Success', response: e.message }, {status:400, statusText:'Fetching error'}) }
}