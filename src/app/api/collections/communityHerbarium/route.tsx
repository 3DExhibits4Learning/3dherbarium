import { getSubmittalSoftware, getSubmittalTags } from "@/functions/server/queries";
import { fetchGbifProfile, fetchGbifVernacularNames, fetchWikiSummary, fetchHSCImages } from "@/functions/server/fetchFunctions";

export async function GET(request: Request) {
    try {

        const { searchParams } = new URL(request.url)

        const confirmation = searchParams.get('confirmation') as string
        const usageKey = parseInt(searchParams.get('usageKey') as string)
        const specimenName = searchParams.get('specimenName') as string

        var results: any[] = []
        var promises: any

        if (usageKey) {
            promises = [
                getSubmittalSoftware(confirmation),
                getSubmittalTags(confirmation),
                fetchWikiSummary(specimenName),
                fetchGbifVernacularNames(usageKey),
                fetchGbifProfile(usageKey),
            ]
        }
        else{
            promises = [
                getSubmittalSoftware(confirmation),
                getSubmittalTags(confirmation),
            ]
        }

        await Promise.all(promises).then(res => results.push(...res))

        return Response.json({ data: "Success", response: results })
    }
    catch (e: any) { return Response.json({ data: 'Success', response: e.message }, { status: 400, statusText: 'Fetching error' }) }
}