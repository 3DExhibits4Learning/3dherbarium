/**
 * @file src/app/api/admin/modeler/model/route.tsx
 * 
 * @fileoverview route handler for 3D modeler to enter a newly created 3D model into the database
 * 
 * @todo update once sid is deemed primary key for specimen and image set in the database
 */

// Typical imports
import { prismaClient } from "@/api/queries"
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter"
import { routeHandlerErrorHandler } from "@/functions/server/error"
import { ModelUploadResponse } from "@/api/types"

// Default imports
import markIssueAsDone from "@/functions/server/Jira/markIssueAsDone"
import createTask from "@/functions/server/Jira/createTask"
import sendErrorEmail from "@/functions/server/Jira/sendErrorEmail"

// Prisma singleton
const prisma = prismaClient()

// PATH
const path = 'src/app/api/admin/modeler/model/route.tsx'

/**
 * 
 * @param request HTTP
 * @returns 
 */
export async function POST(request: Request) {

    try {

        // Get request formData
        const model = await request.formData().catch(e => routeHandlerErrorHandler(path, e.message, "request.json()", "Couldn't get request JSON")) as FormData

        // Variable initialization
        const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`
        const sid = model.get('sid') as string
        const _3dModel = model.get('model') as File
        const commonName = model.get('commonName') as string
        const modeler = model.get('modeler') as string
        const isViable = model.get('isViable') as string
        const isBase = model.get('isBase') as string

        // Ensure that image_set data has been entered first *Note sid will be implemented as key in the future
        const imageSet = await prisma.image_set.findFirst({ where: { sid: sid } }).catch(e => routeHandlerErrorHandler(path, e.message, "prisma.image_set.findFirst()", "Couldn't find corresponding image set data"))
        if (!imageSet) throw Error("Couldn't find corresponding image set data")

        // Set from data
        const data = new FormData()
        data.set('orgProject', process.env.SKETCHFAB_PROJECT_HUNTER as string)
        data.set('modelFile', _3dModel)
        data.set('visibility', 'private')
        data.set('options', JSON.stringify({ background: { color: "#000000" } }))

        // Upload 3D Model, setting uploadProgress in the process
        const sketchfabUpload: ModelUploadResponse = await fetch(orgModelUploadEnd, {
            headers: { 'Authorization': process.env.SKETCHFAB_API_TOKEN as string },
            method: 'POST',
            body: data
        })
            .then(res => { if (!res.ok) routeHandlerErrorHandler(path, res.statusText, "fetch(orgModelUploadEnd)", "Bad Sketchfab Request"); return res.json() })
            .then(json => json)
            .catch(e => routeHandlerErrorHandler(path, e.message, "fetch(orgModelUploadEnd)", "Coulnd't upload to Sketchfab"))

        // Grab the uid and thumbnail, then enter model data into database
        const modelUid = sketchfabUpload.uid

        // Get the model thumbnail
        const thumbUrl = await fetch(`https://api.sketchfab.com/v3/models/${modelUid}`)
            .then(res => res.json())
            .then(data => data.thumbnails?.images[0]?.url ?? '')
            .catch((e: any) => { console.error(e.message); throw new Error("Couldn't get Thumbnail") })

        // Create model database entry
        const insert = await prisma.model.create({
            data: {
                spec_name: imageSet.spec_name.toLowerCase(),
                spec_acquis_date: imageSet.spec_acquis_date,
                pref_comm_name: commonName.toLowerCase(),
                uid: modelUid,
                modeled_by: modeler,
                site_ready: isViable === 'yes' ? true : false,
                base_model: isBase === 'yes' ? true : false,
                thumbnail: thumbUrl
            }
        }).catch(e => routeHandlerErrorHandler(path, e.message, "prisma.model.create()", "Couldn't enter model into databse"))

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
            annotateTask = await createTask('HERB-59', `Annotate ${toUpperFirstLetter(model.species)}`, `Annotate ${toUpperFirstLetter(model.species)}`, process.env.KAT_JIRA_ID as string).catch((e: any) => sendErrorEmail(e.message, `Create annotation for ${toUpperFirstLetter(model.species)}`))
        }

        return Response.json({ data: 'Model Data Entered Successfully', response: { insert: insert, update: update, task: annotateTask } })
    }
    catch (e: any) { return Response.json({ data: e.message, response: 'Model Entry Error' }, { status: 400, statusText: 'Model Entry Error' }) }
}