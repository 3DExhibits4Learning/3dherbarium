import { getPublishedUserSubmittalsBySpecies } from "@/api/queries";

export async function GET(request: Request) {

    try {
        const { searchParams } = new URL(request.url)
        const speciesName = searchParams.get('species')

        const communityModels = await getPublishedUserSubmittalsBySpecies(speciesName as string)

        return Response.json({ data: 'Success', response: communityModels })
    }
    catch (e: any) { return Response.json({ data: 'Error', response: e.message }, { status: 400, statusText: "Error" }) }
}