/**
 * @file src/app/api/admin/modeler/photos/route.tsx
 * 
 * @fileoverview route handler for 3D modeler to enter image data
 * 
 * @todo update 
 */

// Typical imports
import { imageInsertion } from "@/api/types"
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"

// Default imports
import sendErrorEmail from "@/functions/server/Jira/sendErrorEmail"
import prisma from "@/utils/prisma"
import createTask from "@/functions/server/Jira/createTask"
import markIssueAsDone from "@/functions/server/Jira/markIssueAsDone"

// Path
const path = 'src/app/api/admin/modeler/photos/route.tsx'

/**
 * @param request Request
 * @returns 
 */
export async function POST(request: Request) {

    try {
        
        // Get request data
        const images = await request.json().catch(e => routeHandlerErrorHandler(path, e.message, "request.json()", "Couldn't get request JSON")) as imageInsertion
        
        // Create image set record
        const insert = await prisma.image_set.create({
            data: {
                spec_name: images.species.toLowerCase(),
                spec_acquis_date: new Date(images.acquisitionDate),
                set_no: 1,
                imaged_by: images.imagedBy,
                imaged_date: new Date(images.imagedDate),
                no_of_images: parseInt(images.numberOfImages)
            }
        }).catch(e => routeHandlerErrorHandler(path, e.message, "prisma.image_set.create()", "Couldn't create image set record in database"))

        // Jira task management
        await markIssueAsDone('HERB-59', `Photograph ${toUpperFirstLetter(images.species)}`).catch((e: any) => sendErrorEmail(e.message, `Mark Photograph ${toUpperFirstLetter(images.species)} as done`))
        const task = await createTask('HERB-59', `Model ${toUpperFirstLetter(images.species)}`, `Model ${toUpperFirstLetter(images.species)}`, process.env.HUNTER_JIRA_ID as string).catch((e: any) => sendErrorEmail(e.message, `Create task: Model ${toUpperFirstLetter(images.species)}`))

        // Typical response
        return routeHandlerTypicalResponse("Image Data Entered Successfully", {insert, task})
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message)}
}