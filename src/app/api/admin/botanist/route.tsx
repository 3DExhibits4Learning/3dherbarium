
import { getAnnotations, getPhotoAnnotation, getVideoAnnotation, markAsAnnotated, getModelAnnotation, updateModelAnnotator } from "@/api/queries"
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        if (searchParams.get('type') == 'getAnnotations') {
            const annotations = await getAnnotations(searchParams.get('uid') as string)
            return Response.json({ data: 'Success', response: annotations })
        }

        else if (searchParams.get('type') == 'getAnnotation') {
            let annotation

            if (searchParams.get('annotationType') == 'photo') annotation = await getPhotoAnnotation(searchParams.get('id') as string)
            else if (searchParams.get('annotationType') == 'video') annotation = await getVideoAnnotation(searchParams.get('id') as string)
            else annotation = await getModelAnnotation(searchParams.get('id') as string)

            return Response.json({ data: 'Success', response: annotation })
        }
        else {
            return Response.json({ data: 'request type error', response: 'request type error' }, { status: 400, statusText: 'request type error' })
        }
    }
    catch (e: any) { return Response.json({ data: e.message, response: 'Prisma Error' }, { status: 400, statusText: 'Prisma Error' }) }
}

export async function PATCH(request: Request) {
    try {
        const data = await request.json()
        const markModelAsAnnotated = await markAsAnnotated(data.uid).catch(() => { throw new Error("Couldn't mark as annotated") })

        const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

        const epic = await fetch(`https://3dteam.atlassian.net/rest/api/3/search?jql="parent" = HERB-59`, {
            //@ts-ignore -- without the first two headers, data is not returned in English
            headers: {
                'X-Force-Accept-Language': true,
                'Accept-Language': 'en',
                'Authorization': `Basic ${base64}`,
                'Content-Type': 'application/json',
            },
        })
            .then(res => res.json())
            .then(json => json)

        for (let i in epic.issues) {
            if (epic.issues[i].fields.summary.includes(`Annotate ${toUpperFirstLetter(data.species)}`)) {

                const transitionData = {
                    transition: { id: 31 }
                }

                await fetch(`https://3dteam.atlassian.net/rest/api/3/issue/${epic.issues[i].key}/transitions`, {
                    method: 'POST',
                    //@ts-ignore -- without the first two headers, data is not returned in English
                    headers: {
                        'X-Force-Accept-Language': true,
                        'Accept-Language': 'en',
                        'Authorization': `Basic ${base64}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(transitionData)
                })
                    .then(res => res.json())
            }
        }

        return Response.json({ data: 'Model marked as annotated', response: markModelAsAnnotated })
    }
    catch (e: any) { return Response.json({ data: e.message, response: 'Prisma Error' }, { status: 400, statusText: 'Prisma Error' }) }
}