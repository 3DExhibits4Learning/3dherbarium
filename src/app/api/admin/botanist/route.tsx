
import { getAnnotations, getPhotoAnnotation, getVideoAnnotation, markAsAnnotated, getModelAnnotation, updateModelAnnotator } from "@/api/queries"
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter";
import markIssueAsDone from "@/utils/Jira/markIssueAsDone";

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
        await markIssueAsDone('HERB-59', `Annotate ${toUpperFirstLetter(data.species)}`)
        return Response.json({ data: 'Model marked as annotated', response: markModelAsAnnotated })
    }
    catch (e: any) { return Response.json({ data: e.message, response: 'Prisma Error' }, { status: 400, statusText: 'Prisma Error' }) }
}