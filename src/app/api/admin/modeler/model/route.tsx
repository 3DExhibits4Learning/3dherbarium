/**
 * @file src/app/api/admin/modeler/model/route.tsx
 * 
 * @fileoverview route handler for 3D modeler to enter a newly created 3D model into the database
 * 
 * @todo update once sid is deemed primary key for specimen and image set in the database
 */

// Imports
import { prismaClient } from "@/functions/server/queries"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { routeHandlerError, routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { ModelUploadResponse } from "@/ts/types"
import { markSubtaskAsDone, transitionSubtask, transitionTask } from "@/functions/server/jira"
import { sendErrorEmail } from "@/functions/server/email"
import { createTask } from "@/functions/server/jira"
import { routeHandlerTypicalResponse } from "@/functions/server/response"
import { Prisma } from "@prisma/client"
import { readFile } from "fs/promises"

// Prisma singleton
const prisma = prismaClient()

// PATH
const path = 'src/app/api/admin/modeler/model/route.tsx'

/**
 * 
 * @param request HTTP
 * @returns typical response
 */
export async function POST(request: Request) {

    try {

        // Get request formData
        const model = await request.formData().catch(e => routeHandlerErrorHandler(path, e.message, "request.json()", "Couldn't get request JSON")) as FormData

        // Variable initialization
        const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`
        const sid = model.get('sid') as string
        const commonName = model.get('commonName') as string
        const modeler = model.get('modeler') as string
        const isViable = model.get('isViable') as string
        const isBase = model.get('isBase') as string
        const jazzJira = process.env.BOTANIST_JIRA_ID as string
        const species = model.get('species') as string
        const modelPath = model.get('modelPath') as string
        const fileName = model.get('fileName') as string

        // Value check
        const requiredValues = [sid, modelPath, fileName, commonName, modeler, isViable, isBase]
        if (!requiredValues.every(value => value)) { throw Error("Missing model input data") }

        // Read file from backup
        const buffer = await readFile(modelPath)
        const typedArray = new Uint8Array(buffer)
        const blob = new Blob([typedArray])

        // Ensure that image_set data has been entered first *Note sid will be implemented as key in the future
        const imageSet = await prisma.image_set.findFirst({ where: { sid: sid } }).catch(e => routeHandlerErrorHandler(path, e.message, "prisma.image_set.findFirst()", "Couldn't find corresponding image set data"))
        if (!imageSet) throw Error("Couldn't find corresponding image set data")

        // Set from data
        const data = new FormData()
        data.set('orgProject', process.env.SKETCHFAB_PROJECT_HUNTER as string)
        data.set('modelFile', blob, fileName)
        data.set('visibility', 'private')
        data.set('options', JSON.stringify({ background: { color: "#000000" } }))
        data.set('name', species)

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
            .catch(e => console.error(routeHandlerError(path, e.message, 'thumbUrl', 'POST', true)))

        // Create model database entry
        const insert = prisma.model.create({
            data: {
                spec_name: imageSet.spec_name.toLowerCase(),
                spec_acquis_date: imageSet.spec_acquis_date,
                pref_comm_name: commonName.toLowerCase(),
                uid: modelUid,
                modeled_by: modeler,
                site_ready: isViable === 'yes' ? true : false,
                base_model: isBase === 'yes' ? true : false,
                thumbnail: thumbUrl ? thumbUrl : '',
                sid: sid
            }
        })

        // Update corresponding image_set UID
        const update = prisma.image_set.update({
            where: {
                spec_name_spec_acquis_date_set_no: {
                    spec_name: imageSet.spec_name,
                    spec_acquis_date: imageSet.spec_acquis_date,
                    set_no: 1
                }
            },
            data: { uid: modelUid }
        })

        // Create software records
        const insertSoftware = prisma.software.createMany({
            data: [
                { uid: modelUid, software: 'Agisoft Metashape' },
                { uid: modelUid, software: 'Blender' },
                { uid: modelUid, software: 'Instant Meshes' }
            ]
        })

        // Declare transaction array and determine if height update needs to be added
        const transactionArr: Prisma.PrismaPromise<any>[] = [insert, update, insertSoftware]
        if(data.get('height')) transactionArr.push(prisma.specimen.update({where: {sid: sid}, data:{height: data.get('height') as string}}))

        // Await transaction
        await prisma.$transaction(transactionArr).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction', "Couldn't complete database transaction"))

        // Mark 3D model subtask as complete and the parent model task as complete
        await Promise.all([transitionSubtask('SPRIN-4', imageSet.sid.slice(0, 8), "Build", 31), transitionTask('SPRIN-4', imageSet.sid.slice(0, 8), 31)])
            .catch(e => sendErrorEmail(path, 'Promise.all(markSubtask, transitionTask)', e.message, true))

        // Create annotation task if the model is a viable base model
        if (isViable === 'yes' && isBase === 'yes') {

            // Await task, get task key to make subtasks
            const task = await createTask(
                'SPRIN-1',
                `Annotate ${toUpperFirstLetter(imageSet.spec_name)} (${sid.slice(0, 8)})`,
                `Annotate ${imageSet.spec_name}`,
                jazzJira
            ).catch((e: any) => sendErrorEmail(path, 'createTask()', e.message, true))

            // Subtasks (annotation and sketchfab metadata)
            const subTasks = [
                createTask(task.key, `Add metadata for ${imageSet.spec_name} (${sid.slice(0, 8)})`, `Add metadata for ${imageSet.spec_name}`, jazzJira, 'Subtask'),
                createTask(task.key, `Annotate ${imageSet.spec_name} (${sid.slice(0, 8)})`, `Annotate ${imageSet.spec_name}`, jazzJira, 'Subtask'),
            ]
            await Promise.all(subTasks).catch(e => sendErrorEmail(path, 'Promise.all(createTask())', e.message, true))

            // Typical response
            return routeHandlerTypicalResponse('Model Data Entered Successfully', { task, insert, update })
        }

        // Create a metadata task if the model is a viable annotation model
        else if (isViable === 'yes' && isBase === 'no') {
            const task = await createTask(
                'SPRIN-1',
                `Add metadata for ${toUpperFirstLetter(imageSet.spec_name)} (${sid.slice(0, 8)})`,
                `Add metadata for ${imageSet.spec_name}`,
                jazzJira
            ).catch((e: any) => sendErrorEmail(path, 'createTask()', e.message, true))

            // Typical response
            return routeHandlerTypicalResponse('Model Data Entered Successfully', { task, insert, update })
        }

        // Typical response without task
        return routeHandlerTypicalResponse('Model Data Entered Successfully', { insert, update })
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}