import { prismaClient } from "@/api/queries"
import { modelInsertion } from "@/api/types"
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter"
import markIssueAsDone from "@/utils/Jira/markIssueAsDone"
import createTask from "@/utils/Jira/createTask"
const prisma = prismaClient()
import sendErrorEmail from "@/utils/Jira/sendErrorEmail"

export async function POST(request: Request) {

    // Variable initialization
    const model = await request.json() as modelInsertion

    var thumbUrl, insert, update, annotateTask

    // Try to check if there is associated image data, if so, insert model into database and update uid in image set table. Finally, create Jira annotation issue if the model is viable.
    try {

        // Ensure that image_set data has been entered first
        await prisma.image_set.findUnique({
            where: {
                spec_name_spec_acquis_date_set_no: {
                    spec_name: model.species,
                    spec_acquis_date: new Date(model.acquisitionDate),
                    set_no: 1
                }
            },
        }).catch(() => { throw new Error("Couldn't find Image Set") })

        // Get the model thumbnail
        thumbUrl = await fetch(`https://api.sketchfab.com/v3/models/${model.uid}`)
            .then(res => res.json())
            .then(data => data.thumbnails?.images[0]?.url ?? '')
            .catch((e: any) => { throw new Error("Couldn't get Thumbnail") })

        // Create model database entry
        insert = await prisma.model.create({
            data: {
                spec_name: model.species.toLowerCase(),
                spec_acquis_date: new Date(model.acquisitionDate),
                pref_comm_name: model.commonName.toLowerCase(),
                uid: model.uid,
                modeled_by: model.modeler,
                site_ready: !!parseInt(model.isViable),
                base_model: !!parseInt(model.isBase),
                thumbnail: thumbUrl
            }
        }).catch(() => { throw new Error("Couldn't enter model into Database") })

        // Update corresponding image_set UID
        update = await prisma.image_set.update({
            where: {
                spec_name_spec_acquis_date_set_no: {
                    spec_name: model.species.toLowerCase(),
                    spec_acquis_date: new Date(model.acquisitionDate),
                    set_no: 1
                }
            },
            data: {
                uid: model.uid
            }
        }).catch(() => { throw new Error("Couldn't update Image Set UID") })

        // Mark Create 3D Model task as done
        await markIssueAsDone('HERB-59', `Model ${toUpperFirstLetter(model.species)}`).catch((e: any) => sendErrorEmail(e.message, `Mark Model ${toUpperFirstLetter(model.species)} as done`))

        // Create Jira task if the model has been marked as viable by the 3D modeler
        if (parseInt(model.isViable)) {
            annotateTask = await createTask('HERB-59', `Annotate ${toUpperFirstLetter(model.species)}`, `Annotate ${toUpperFirstLetter(model.species)}`, process.env.KAT_JIRA_ID as string).catch((e: any) => sendErrorEmail(e.message,  `Create annotation for ${toUpperFirstLetter(model.species)}`))
        }

        return Response.json({ data: 'Model Data Entered Successfully', response: { insert: insert, update: update, task: annotateTask } })
    }
    catch (e: any) { return Response.json({ data: e.message, response: 'Model Entry Error' }, { status: 400, statusText: 'Model Entry Error' }) }
}