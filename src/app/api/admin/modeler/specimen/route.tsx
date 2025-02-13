/**
 * @file src/app/api/admin/modeler/specimen/route.tsx
 * 
 * @fileoverview specimen insertion route handler
 * 
 * @todo update jira task management
 */

// Typical imports
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { v4 as uuidv4 } from 'uuid'
import { writeFile, mkdir } from "fs/promises"
import { sendErrorEmail } from "@/functions/server/email"
import { routeHandlerTypicalResponse } from "@/functions/server/response"
import { createTask } from "@/functions/server/jira"

// Default imports
import prisma from "@/functions/server/utils/prisma"

// Path
const path = 'src/app/api/admin/modeler/specimen/route.tsx'

/**
 * @function POST
 * @param request Request
 * @returns 
 */
export async function POST(request: Request) {

    try {

        // Get request data and check if species exists in database (deprected DB structure to be changed)
        const specimen = await request.formData().catch(e => routeHandlerErrorHandler(path, e.message, 'request.json()', "Couldn't get request JSON")) as FormData
        const speciesCheck = await prisma.species.findUnique({ where: { spec_name: (specimen.get('species') as string).toLowerCase() } }).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.species.findUnique()', "Couldn't check species"))

        // Specimen id, path variables
        const sid = uuidv4()
        const dir = `public/data/Herbarium/specimen/${sid}`
        const filePath = dir + `/${(specimen.get('photo') as File).name}`
        const species = toUpperFirstLetter(specimen.get('species') as string)
        const hunterJira = process.env.HUNTER_JIRA_ID as string

        // If the species doesn't exist in the database, it must be created (deprected DB structure to be changed)
        if (!speciesCheck) {
            await prisma.species.create({
                data: {
                    spec_name: species.toLowerCase(),
                    genus: (specimen.get('genus') as string).toLowerCase(),
                    is_local: specimen.get('isLocal') === 'true' ? true : false
                }
            }).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.species.create()', "Couldn't create species record in database"))
        }

        // Insert specimen into database
        const insert = await prisma.specimen.create({
            data: {
                spec_name: species.toLowerCase(),
                spec_acquis_date: new Date(specimen.get('acquisitionDate') as string),
                procurer: specimen.get('procurer') as string,
                height: specimen.get('height') as string,
                lat: JSON.parse(specimen.get('position') as string).lat.toString(),
                lng: JSON.parse(specimen.get('position') as string).lng.toString(),
                locality: specimen.get('locality') as string,
                sid: sid,
                photoUrl: filePath
            }
        }).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.specimen.create()', "Couldn't create specimen record in database"))

        // Write photo to data storage
        await mkdir(dir, { recursive: true })
        const arrayBuffer = await (specimen.get('photo') as File).arrayBuffer().catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.specimen.create()', "Couldn't create specimen record in database")) as ArrayBuffer
        const buffer = Buffer.from(arrayBuffer)
        await writeFile(filePath, buffer).catch(e => routeHandlerErrorHandler(path, e.message, 'writeFile()', "Couldn't write photo file"))

        // Jira task management (Create model task with two subtasks for photography and 3D model compilation)
        const task = await createTask('SPRIN-4', `Model ${species} (${sid.slice(0, 8)})`, `Photograph and compile 3D model of ${species}`, process.env.HUNTER_JIRA_ID as string).catch((e: any) => sendErrorEmail(path, 'createTask()', e.message, true))
        const subTasks = [
            createTask(task.key, `Photograph ${species} (${sid.slice(0, 8)})`, `Photograph ${species}`, hunterJira, 'Subtask'), 
            createTask(task.key, `Build 3D model of ${species} (${sid.slice(0, 8)})`, `Build 3D model of ${species}`, hunterJira, 'Subtask'),
            createTask(task.key, `Convert RAWs to TIFs`, `Convert RAWs to TIFs for ${species}`, hunterJira, 'Subtask')
        ]
        await Promise.all(subTasks).catch(e => sendErrorEmail(path, 'Promise.all(createTask())', e.message, true))

        // Typical response
        return routeHandlerTypicalResponse('Specimen Entered Successfully', { insert, task })
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}