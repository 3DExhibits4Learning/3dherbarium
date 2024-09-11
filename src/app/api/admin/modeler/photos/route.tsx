import { imageInsertion } from "@/api/types"
import prisma from "@/utils/prisma"
import createTask from "@/utils/Jira/createTask"
import markIssueAsDone from "@/utils/Jira/markIssueAsDone"
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter"

export async function POST(request: Request){
    const images = await request.json() as imageInsertion
    try {
        const insert = await prisma.image_set.create({
            data: {
                spec_name: images.species.toLowerCase(),
                spec_acquis_date: new Date(images.acquisitionDate),
                set_no: 1,
                imaged_by: images.imagedBy,
                imaged_date: new Date(images.imagedDate),
                no_of_images: parseInt(images.numberOfImages)
            }
        })
        
        await markIssueAsDone('HERB-59', `Photograph ${toUpperFirstLetter(images.species)}`).catch() // TODO: Send Email
        const task = await createTask('HERB-59', `Model ${toUpperFirstLetter(images.species)}`, `Model ${toUpperFirstLetter(images.species)}`, process.env.HUNTER_JIRA_ID as string) .catch() // TODO: Send Email

        return Response.json({ data: 'Image Data Entered Successfully', response: insert, task })
    }
    catch (e: any) { return Response.json({ data: e.message, response: 'Prisma Error' }, { status: 400, statusText: 'Prisma Error' }) }
}