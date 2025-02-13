/**
 * @file src/app/api/admin/modeler/photos/route.tsx
 * 
 * @fileoverview route handler for 3D modeler to enter image data
 * 
 * @todo update 
 */

// Typical imports
import { imageInsertion } from "@/ts/types"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"
import { markSubtaskAsDone, markTaskAsInProgress } from "@/functions/server/jira"
import { sendErrorEmail } from "@/functions/server/email"

// Default imports
import prisma from "@/functions/server/utils/prisma"

// Path, issueKey
const path = 'src/app/api/admin/modeler/photos/route.tsx'
const issueKey = 'SPRIN-4'

/**
 * @param request Request
 * @returns typical response
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
                no_of_images: parseInt(images.numberOfImages),
                sid: images.sid
            }
        }).catch(e => routeHandlerErrorHandler(path, e.message, "prisma.image_set.create()", "Couldn't create image set record in database"))

        // Jira task management
        await Promise.all([markTaskAsInProgress(issueKey, images.sid.slice(0, 8)), markSubtaskAsDone(issueKey, images.sid.slice(0, 8), "Photograph")])
            .catch(e => sendErrorEmail(path, 'Promise.all', e.message, true))

        // Typical response
        return routeHandlerTypicalResponse("Image Data Entered Successfully", insert)
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}