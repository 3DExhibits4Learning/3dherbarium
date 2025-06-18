import { getPublishedUserSubmittalsByUid } from "@/functions/server/queries";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {

    try {
        const searchParams = request.nextUrl.searchParams
        const uid = searchParams.get('uid')

        const communityModel = await getPublishedUserSubmittalsByUid(uid as string)

        return Response.json({ data: 'Success', response: communityModel })
    }
    catch (e: any) { return Response.json({ data: 'Error', response: e.message }, { status: 400, statusText: "Error" }) }
}