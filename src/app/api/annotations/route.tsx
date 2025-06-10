/**
 * @file src\app\api\annotations\route.tsx
 * 
 * @fileoverview annotation CUD route handler
 * 
 */

// Typical imports
import { insertFirstAnnotationPosition, getFirstAnnotationPostion, deleteAnnotation } from "@/functions/server/queries"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { unlink, rm } from "fs/promises"
import { routeHandlerTypicalResponse } from "@/functions/server/response"
import { autoWrite } from "@/functions/server/files"
import { transitionSubtask, transitionTask } from "@/functions/server/jira"
import { sendErrorEmail } from "@/functions/server/email"

// Default imports
import prisma from "@/functions/server/utils/prisma"

// PATH
const path = 'src/app/api/annotations/route.tsx'

/**
 * 
 * @param request 
 * @returns 
 */
export async function GET(request: Request) {

    // Grab searchParams
    const { searchParams } = new URL(request.url)

    // Return first annotation position if it exists; typical try-catch return
    try {
        const firstAnnotationPosition = await getFirstAnnotationPostion(searchParams.get('uid') as string).catch((e) => routeHandlerErrorHandler(path, e.message, 'getFirstAnnotationPosition()', "Couldn't get annotation position"))
        return routeHandlerTypicalResponse('Annotation Position retrieved', firstAnnotationPosition)
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}

/**
 * 
 * @param request 
 * @returns 
 */
export async function POST(request: Request) {

    try {

        // Grab form data, ensure subtask is marked as 'in progress'
        const data = await request.formData()


        // First annotation handler; always taxonomy and description, insert position with typical try-catch return
        if (data.get('index') === '1') {
            const update = await insertFirstAnnotationPosition(data.get('uid') as string, data.get('position') as string).catch((e) => routeHandlerErrorHandler(path, e.message, 'getFirstAnnotationPosition()', "Couldn't get annotation position"))
            await transitionTask('SPRIN-1', (data.get('sid') as string).slice(0, 8), 21)
            return routeHandlerTypicalResponse('Annotation Created', update)
        }

        // Else the annotation must be photo, video or model
        else {
            await transitionSubtask('SPRIN-1', (data.get('sid') as string).slice(0, 8), 'Annotate', 21).catch(e => sendErrorEmail(path, 'transitionSubtask', e.message, true, 'POST'))

            // Base annotation (same for all annotation types)
            const annotation = prisma.annotations.create({
                data: {
                    uid: data.get('uid') as string,
                    position: data.get('position') as string,
                    url: data.get('url') as string,
                    annotation_no: parseInt(data.get('annotation_no') as string),
                    annotation_id: data.get('annotation_id') as string,
                    annotation_type: data.get('annotation_type') as string,
                    title: data.get('title') as string
                },
            })

            // Switch based on annotationType
            switch (data.get('annotation_type')) {

                case 'video':

                    // Video annotation 
                    const videoAnnotation = prisma.video_annotation.create({ data: { url: data.get('url') as string, length: data.get('length') as string, annotation_id: data.get('annotation_id') as string, annotation: data.get('annotation') as string } })

                    // Await transaction, typical response
                    const newVideoAnnotation = await prisma?.$transaction([annotation, videoAnnotation]).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction(videoAnnotation)', "Couldn't create video anotation"))
                    return routeHandlerTypicalResponse('Annotation Created', newVideoAnnotation)

                case 'model':

                    // Model annotation creation
                    const modelAnnotation = prisma.model_annotation.create({ data: { uid: data.get('modelAnnotationUid') as string, annotation: data.get('annotation') as string, annotation_id: data.get('annotation_id') as string } })

                    // Await transaction, typical response
                    const newModelAnnotation = await prisma?.$transaction([annotation, modelAnnotation]).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction(modelAnnotation)', "Couldn't create model anotation"))
                    return routeHandlerTypicalResponse('Annotation Created', newModelAnnotation)


                // Default case (annotationType == 'photo')
                default:

                    // Write file to data storage if it exists
                    if (data.get('file')) await autoWrite(data.get('file') as File, data.get('dir') as string, data.get('path') as string).catch(e => routeHandlerErrorHandler(path, e.message, 'autoWrite()', "Couldn't write photo to storage"))

                    // Optional photo_annotation data initializtion
                    const website = data.get('website') ? data.get('website') : undefined
                    const title = data.get('photoTitle') ? data.get('title') : undefined

                    // Create photo annotation
                    const photoAnnotation = prisma.photo_annotation.create({
                        data: {
                            url: data.get('url') as string,
                            author: data.get('author') as string,
                            license: data.get('license') as string,
                            annotator: data.get('annotator') as string,
                            annotation_id: data.get('annotation_id') as string,
                            annotation: data.get('annotation') as string,
                            website: website ? website as string : '',
                            title: title ? title as string : '',
                            photo: null
                        }
                    })

                    // Await transaction, typical response
                    const newPhotoAnnotation = await prisma?.$transaction([annotation, photoAnnotation]).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction(newPhotoAnnotation)', "Couldn't create photo anotation"))
                    return Response.json({ data: 'Annotation created', response: newPhotoAnnotation })
            }
        }
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

    // Grab form data
    const data = await request.formData()
    await transitionSubtask('SPRIN-1', (data.get('sid') as string).slice(0, 8), 'Annotate', 21).catch(e => sendErrorEmail(path, 'transitionSubtask', e.message, true, 'PATCH'))

    // First annotation handler; always taxonomy and description, insert position with typical try-catch return
    if (data.get('index') === '1') {
        try {
            const update = await insertFirstAnnotationPosition(data.get('uid') as string, data.get('position') as string).catch(e => routeHandlerErrorHandler(path, e.message, 'insertFirstAnnotationPosition()', "Coulnd't insert position"))
            return routeHandlerTypicalResponse('Annotation Updated', update)
        }
        // Typical catch
        catch (e: any) { return routeHandlerTypicalCatch(e.message) }
    }

    // Else the annotation must be photo, video or 3D model
    else {

        // Base columns that are updated with any annotation type
        const baseColumns = {
            uid: data.get('uid') as string,
            position: data.get('position') as string,
            annotation_type: data.get('annotation_type') as string,
            title: data.get('title') as string
        }

        // Update columns - either the base columns or base columns + url if the annotation type isn't 'model'
        const updateColumns = data.get('annotation_type') === 'model' ? baseColumns : { ...baseColumns, url: data.get('url') as string }

        // Update query (same for all cases in switch)
        const updateAnnotation = prisma.annotations.update({ where: { annotation_id: data.get('annotation_id') as string }, data: updateColumns })

        // Switch based on the type of the annotation
        switch (data.get('annotation_type')) {

            case 'video':

                try {

                    // If there is a change in media for the update, delete previous child of the annotations table, update, then return
                    if (data.get('mediaTransition')) {

                        // Determine annotation to delete
                        const deleteAnnotation = data.get('previousMedia') === 'photo' ? prisma.photo_annotation.delete({ where: { annotation_id: data.get('annotation_id') as string } }) :
                            prisma.model_annotation.delete({ where: { annotation_id: data.get('annotation_id') as string } })

                        // Create new video annotation
                        const newVideoAnnotation = prisma.video_annotation.create({ data: { url: data.get('url') as string, length: data.get('length') as string, annotation_id: data.get('annotation_id') as string, annotation: data.get('annotation') as string } })

                        // Await transaction, return with typical response
                        const update = await prisma?.$transaction([deleteAnnotation, updateAnnotation, newVideoAnnotation]).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction(update)', "Couldn't update annotation or make new video annotation"))
                        return Response.json({ data: 'Annotation updated', response: update })
                    }

                    // Update video annotation
                    const updatedVideoAnnotation = prisma.video_annotation.update({
                        where: { annotation_id: data.get('annotation_id') as string },
                        data: { url: data.get('url') as string, length: data.get('length') as string, annotation: data.get('annotation') as string }
                    })

                    // Await transaction, return with typical response
                    const update = await prisma?.$transaction([updateAnnotation, updatedVideoAnnotation]).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction(update)', "Couldn't update annotation or update video annotation"))
                    return routeHandlerTypicalResponse('Annotation Updated', update)
                }
                // Typical catch
                catch (e: any) { return routeHandlerTypicalCatch(e.message) }

            // annotationType = 'model' handler
            case 'model':

                try {

                    // If there is a change in media for the update, delete previous child of the annotations table, update, then return
                    if (data.get('mediaTransition')) {

                        // Determine annotation to delete
                        const deleteAnnotation = data.get('previousMedia') === 'photo' ? prisma.photo_annotation.delete({ where: { annotation_id: data.get('annotation_id') as string } }) :
                            prisma.video_annotation.delete({ where: { annotation_id: data.get('annotation_id') as string } })

                        const newModelAnnotation = prisma.model_annotation.create({
                            data: { uid: data.get('modelAnnotationUid') as string, annotation: data.get('annotation') as string, annotation_id: data.get('annotation_id') as string }
                        })

                        // Await transaction, return with typical response
                        const update = await prisma?.$transaction([deleteAnnotation, updateAnnotation, newModelAnnotation]).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction(update)', "Couldn't update annotation or make new model annotation"))
                        return routeHandlerTypicalResponse('Annotation Updated', update)
                    }

                    // Update model annotation
                    const updateModelAnnotation = prisma.model_annotation.update({
                        where: { annotation_id: data.get('annotation_id') as string },
                        data: { uid: data.get('modelAnnotationUid') as string, annotation: data.get('annotation') as string }
                    })

                    // Await transaction, return with typical response
                    const update = await prisma?.$transaction([updateAnnotation, updateModelAnnotation]).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction(update)', "Couldn't update annotation or update model annotation"))
                    return routeHandlerTypicalResponse('Annotation Updated', update)
                }
                // Typical catch
                catch (e: any) { return routeHandlerTypicalCatch(e.message) }

            // Default case (annotationType == 'photo')
            default:

                try {

                    // Write file (if there is a file); eliminate previous annotation image it an old url is provided
                    if (data.get('file')) await autoWrite(data.get('file') as File, data.get('dir') as string, data.get('dir') as string).catch(e => routeHandlerErrorHandler(path, e.message, 'autoWrite()', "Couldn't write photo to storage"))
                    if (data.get('oldUrl')) await unlink(`public${data.get('oldUrl')}`).catch(e => routeHandlerErrorHandler(path, e.message, 'unlink()', "Couldn't delete old annotation image"))

                    // Optional fields
                    const website = data.get('website') ? data.get('website') : undefined
                    const title = data.get('photoTitle') ? data.get('title') : undefined

                    // Photo annotation update data
                    const photoAnnotationUpdateData = {
                        url: data.get('url') as string,
                        author: data.get('author') as string,
                        license: data.get('license') as string,
                        annotator: data.get('annotator') as string,
                        annotation: data.get('annotation') as string,
                        website: website ? website as string : '',
                        title: title ? title as string : '',
                        photo: null
                    }

                    // Photo annotation create data
                    const photoAnnotationCreateData = { ...photoAnnotationUpdateData, annotation_id: data.get('annotation_id') as string }

                    // If there is a change in media for the update, delete previous child of the annotations table, update, then return
                    if (data.get('mediaTransition')) {

                        // Determine annotation to delete
                        const deleteAnnotation = data.get('previousMedia') === 'video' ? prisma.video_annotation.delete({ where: { annotation_id: data.get('annotation_id') as string } }) :
                            prisma.model_annotation.delete({ where: { annotation_id: data.get('annotation_id') as string } })

                        // Photo annotation create query
                        const photoAnnotation = prisma.photo_annotation.create({ data: photoAnnotationCreateData })

                        // Await transaction, return with typical response
                        const update = await prisma?.$transaction([deleteAnnotation, updateAnnotation, photoAnnotation]).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction(update)', "Couldn't update annotation or make new photo annotation"))
                        return routeHandlerTypicalResponse('Annotation Updated', update)
                    }

                    // Update photo anotation
                    const updatePhotoAnnotation = prisma.photo_annotation.update({ where: { annotation_id: data.get('annotation_id') as string }, data: photoAnnotationUpdateData })

                    // Await transaction, return with typical response
                    const update = await prisma?.$transaction([updateAnnotation, updatePhotoAnnotation]).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction(photoAnnotation)', "Couldn't update annotation or update photo annotation"))
                    return routeHandlerTypicalResponse('Annotation Updated', update)
                }
                // Typical catch
                catch (e: any) { return routeHandlerTypicalCatch(e.message) }
        }
    }
}
/**
 * 
 * @param request 
 * @returns 
 */
export async function DELETE(request: Request) {

    try {
        // Get request data
        const data = await request.json()

        // Delete photo directory if it exists
        if (data.path) await rm(data.path, { recursive: true, force: true }).catch(e => routeHandlerErrorHandler(path, e.message, "rm", "Couldn't remove directory"))

        // Delete the annotation, typical return 
        await deleteAnnotation(data.annotation_id, data.modelUid).catch(e => routeHandlerErrorHandler(path, e.message, "deleteAnnotation", "Couldn't delete annotation"))
        return routeHandlerTypicalResponse('Annotation deleted', 'Annotation deleted')
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}
