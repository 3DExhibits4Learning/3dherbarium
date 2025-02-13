import { getPublishedUserSubmittals, getSubmittalSoftware, getSubmittalTags } from "@/functions/server/queries"

export const dynamic = 'force-dynamic'

export async function GET() {

  try {
    const communitySubmittals: any = await getPublishedUserSubmittals()

    const tagsAndSoftware = []

    for (let i in communitySubmittals) {
      tagsAndSoftware.push(getSubmittalTags(communitySubmittals[i].confirmation))
      tagsAndSoftware.push(getSubmittalSoftware(communitySubmittals[i].confirmation))
    }

    await Promise.all(tagsAndSoftware).then((tagsAndSoftware) => {
      for (let i = 0; i < communitySubmittals.length; i++) {
        communitySubmittals[i].tags = tagsAndSoftware[i]
        communitySubmittals[i].tags = tagsAndSoftware[i+1]
      }
    })
    return Response.json({ data: 'Got Community Models', response: communitySubmittals })
  }
  catch (e: any) { return Response.json({ data: 'Error getting community models', response: e.message }, { status: 400, statusText: 'Error getting community models' }) }
}