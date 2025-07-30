
/**
 * @file src/app/api/admin/botanist/route.tsx
 * 
 * @fileoverview botanist route handler
 */

// Typical Imports
import { transitionSubtask } from "@/functions/server/jira"
import { sendErrorEmail } from "@/functions/server/email"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"

// Prisma singleton
import prisma from "@/functions/server/utils/prisma"

// PATH
const path = 'src/app/api/admin/botanist/route.tsx'

/**
 * 
 * @param request 
 * @returns 
 */
export async function GET(request: Request) {
    try {

        // Get params
        const { searchParams } = new URL(request.url);

        // Get annotations if that is the type (returns all base annotations for a 3D model)
        if (searchParams.get('type') === 'getAnnotations') {

            // Query in ascending order
            const annotations = await prisma.annotations.findMany({ where: { uid: searchParams.get('uid') as string }, orderBy: { annotation_no: 'asc' } })
                .catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.annotations.findMany()', "Couldn't get annotations"))

            // Typical response
            return routeHandlerTypicalResponse('Success', annotations)
        }

        // Else if get the typed annotation with provided id
        else if (searchParams.get('type') === 'getAnnotation') {

            var annotation

            // Get the appropriate annotation based on the annotation type
            if (searchParams.get('annotationType') == 'photo') annotation = await prisma.photo_annotation.findUnique({ where: { annotation_id: searchParams.get('id') as string } })
            else if (searchParams.get('annotationType') == 'video') annotation = await prisma.video_annotation.findUnique({ where: { annotation_id: searchParams.get('id') as string } })
            else annotation = await prisma.model_annotation.findUnique({ where: { annotation_id: searchParams.get('id') as string } })

            // Typical response
            return routeHandlerTypicalResponse('Success', annotation)
        }

        // Else throw error
        else throw Error("Invalid request type")
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}

/**
 * 
 * @param request 
 * @returns 
 */
export async function PATCH(request: Request) {

    try {
        // Grab request data
        const data = await request.json()

        // Mark model as annotated
        const markModelAsAnnotated = await prisma.model.update({ where: { uid: data.uid }, data: { annotated: true, annotator: "Jazzlyn Strebel" } })

        // Mark subtask as complete
        await transitionSubtask('SPRIN-1', (data.sid).slice(0, 8), 'Annotate', 31).catch(e => sendErrorEmail(path, 'transitionSubtask', e.message, true, 'POST'))

        // Typical response
        return routeHandlerTypicalResponse('Model marked as annotated', markModelAsAnnotated)
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}