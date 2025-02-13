/**
 * @deprecated (all legacy annotations have been updated)
 * 
 * @file src/app/api/reAnnotation/route.ts
 * 
 * @fileoverview temporary route handler for reannotation of legacy 3D models
 */

// Typical imports
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error";
import { routeHandlerTypicalResponse } from "@/functions/server/response";

// SINGLETON
import prisma from "@/functions/server/utils/prisma";

// PATH
const path = 'src/app/api/reAnnotation/route.ts'

export interface ReannotationData {
    uid: string,
    annotations: {title: string, position: number[][]}[]
}

// Need: model uid for first annotation postiion, all annotations of that uid for remaining annotation positions and titles

export async function PATCH(request: Request) {

    try {
        
        // Grab request data
        const data = await request.json().catch(e => routeHandlerErrorHandler(path, e.message, "request.json()", "Couldn't get request data"))
        const requestData: ReannotationData = JSON.parse(data)

        console.log(requestData)

        // Array for update functions
        const annotationUpdates = []

        // Update first annotation position
        const updateModel = prisma.model.update({ 
            where: { uid: requestData.uid },
            data:{annotationPosition: JSON.stringify(requestData.annotations[0].position)} 
        })

        // Add the promise to the array
        annotationUpdates.push(updateModel)

        // Iterate through the remaining annotations
        console.log('Getting annotation IDs...')
        for(var i = 1; i < requestData.annotations.length; i++){

            // First get the annotation id of the annotation with corresponding uid and number
            const annotationId = await prisma.annotations.findFirstOrThrow({where:{uid: requestData.uid, annotation_no: i + 1}, select:{annotation_id: true} }).catch(e => routeHandlerErrorHandler(path, e.message, "prisma.annotations.findFirst()", "Couldn't find matching annotation"))

            annotationUpdates.push(prisma.annotations.update({
                where:{annotation_id: annotationId?.annotation_id},
                data: {title: requestData.annotations[i].title, position: JSON.stringify(requestData.annotations[i].position)}
            }))
        }

        // Complete update transaction
        console.log('Updating Annotations...')
        await prisma.$transaction(annotationUpdates).catch(e => routeHandlerErrorHandler(path, e.message, "prisma.$transaction()", "Couldn't complete database transaction"))
        console.log('Update Complete...')

        return routeHandlerTypicalResponse('Reannotation Successful', 'Success')
    }
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}