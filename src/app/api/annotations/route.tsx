/**
 * @file src\app\api\annotations\route.tsx
 * 
 * @fileoverview
 */

import {
    insertFirstAnnotationPosition,
    getFirstAnnotationPostion,
    createAnnotation,
    createPhotoAnnotation,
    createVideoAnnotation,
    deleteAnnotation,
    updateAnnotation,
    updatePhotoAnnotation,
    updateVideoAnnotation,
    deletePhotoAnnotation,
    deleteVideoAnnotation,
    createModelAnnotation,
    updateModelAnnotation,
    deleteModelAnnotation
} from "@/api/queries"
import { routeHandlerErrorHandler } from "@/functions/server/error"
import { mkdir, unlink, writeFile, rm } from "fs/promises"

const path = 'src/app/api/annotations/route.tsx'



// GET request handler
export async function GET(request: Request) {

    // Grab searchParams
    const { searchParams } = new URL(request.url)

    // Return first annotation position if it exists; typical try-catch return
    try {
        const firstAnnotationPosition = await getFirstAnnotationPostion(searchParams.get('uid') as string).catch((e) => routeHandlerErrorHandler(path, e.message, 'getFirstAnnotationPosition()', "Couldn't get annotation position"))
        return Response.json({ data: 'Annotation Position retrieved', response: firstAnnotationPosition })
    }
    catch (e: any) { return Response.json({ data: "Couldn't enter position", response: e.message }, { status: 400, statusText: "Couldn't enter position" }) }
}


// POST request handler
export async function POST(request: Request) {

    try {

        const data = await request.formData()
        // First annotation handler; always taxonomy and description, insert position with typical try-catch return
        if (data.get('index') == '1') {
            const update = await insertFirstAnnotationPosition(data.get('uid') as string, data.get('position') as string).catch((e) => routeHandlerErrorHandler(path, e.message, 'getFirstAnnotationPosition()', "Couldn't get annotation position"))
            return Response.json({ data: 'Annotation Created', response: update })
        }

        // Else the annotation must be photo or video (or 3D model coming soon)
        else {

            // Conditional based on annotationType
            switch (data.get('annotation_type')) {

                // annotationType = 'video' handler
                case 'video':

                    // Database annotation creation
                    const newAnnotation0 = await createAnnotation(
                        data.get('uid') as string,
                        data.get('position') as string,
                        data.get('url') as string,
                        parseInt(data.get('annotation_no') as string),
                        data.get('annotation_type') as string,
                        data.get('annotation_id') as string,
                        data.get('title') as string
                    ).catch((e) => routeHandlerErrorHandler(path, e.message, 'createAnnotation()', "Couldn't create annotation"))

                    const newVideoAnnotation = await createVideoAnnotation(
                        data.get('url') as string,
                        data.get('length') as string,
                        data.get('annotation_id') as string
                    ).catch((e) => routeHandlerErrorHandler(path, e.message, 'createVideoAnnotation()', "Couldn't create video annotation"))

                    return Response.json({ data: 'Annotation created', response: newAnnotation0, newVideoAnnotation })

                // annotationType = 'video' handler
                case 'model':

                    // Database annotation creation
                    const newAnnotation1 = await createAnnotation(
                        data.get('uid') as string,
                        data.get('position') as string,
                        data.get('url') as string,
                        parseInt(data.get('annotation_no') as string),
                        data.get('annotation_type') as string,
                        data.get('annotation_id') as string,
                        data.get('title') as string
                    ).catch((e) => routeHandlerErrorHandler(path, e.message, 'createAnnotation()', "Couldn't create annotation"))

                    const newModelAnnotation = await createModelAnnotation(
                        data.get('modelAnnotationUid') as string,
                        data.get('annotation') as string,
                        data.get('annotation_id') as string
                    ).catch((e) => routeHandlerErrorHandler(path, e.message, 'createModelAnnotation()', "Couldn't create model annotation"))

                    return Response.json({ data: 'Annotation created', response: newAnnotation1, newModelAnnotation })


                // Default case (annotationType == 'photo')
                default:

                    let photoBuffer

                    if (data.get('file')) {
                        const file = data.get('file') as File
                        const bytes = await file.arrayBuffer().catch((e) => routeHandlerErrorHandler(path, e.message, 'file.arrayBuffer()', "Couldn't get arrayBuffer")) as ArrayBuffer
                        photoBuffer = Buffer.from(bytes)

                        await mkdir(data.get('dir') as string, { recursive: true }).catch((e) => routeHandlerErrorHandler(path, e.message, 'mkdir()', "Couldn't make directory"))
                        //@ts-ignore
                        await writeFile(data.get('path') as string, photoBuffer).catch((e) => routeHandlerErrorHandler(path, e.message, 'writeFile()', "Couldn't write file"))
                    }

                    // Optional photo_annotation data initializtion
                    const website = data.get('website') ? data.get('website') : undefined
                    const title = data.get('photoTitle') ? data.get('title') : undefined

                    // Database annotation creation
                    const newAnnotation2 = await createAnnotation(
                        data.get('uid') as string, data.get('position') as string,
                        data.get('url') as string,
                        parseInt(data.get('annotation_no') as string),
                        data.get('annotation_type') as string,
                        data.get('annotation_id') as string,
                        data.get('title') as string
                    ).catch((e) => routeHandlerErrorHandler(path, e.message, 'createAnnotation()', "Couldn't create annotation"))

                    const newPhotoAnnotation = await createPhotoAnnotation(
                        data.get('url') as string,
                        data.get('author') as string,
                        data.get('license') as string,
                        data.get('annotator') as string,
                        data.get('annotation') as string,
                        data.get('annotation_id') as string,
                        website as string | undefined,
                        title as string | undefined
                    ).catch((e) => routeHandlerErrorHandler(path, e.message, 'createPhotoAnnotation()', "Couldn't create photo annotation"))

                    // Successful response returns message as the data value and response objects from prisma as the response values
                    return Response.json({ data: 'Annotation created', response: { newAnnotation2, newPhotoAnnotation } })

            }
        }
    }
    catch (e: any) { }
}




// Patch request handler
export async function PATCH(request: Request) {
    const data = await request.formData()

    // First annotation handler; always taxonomy and description, insert position with typical try-catch return
    if (data.get('index') == '1') {
        let update
        try {
            update = await insertFirstAnnotationPosition(data.get('uid') as string, data.get('position') as string)
            return Response.json({ data: 'Annotation Updated', response: update })
        }
        catch (e: any) { return Response.json({ data: "Couldn't enter position", response: update }, { status: 400, statusText: "Couldn't enter position" }) }
    }

    // Else the annotation must be photo or video (or 3D model coming soon)
    else {

        // Conditional based on annotationType
        switch (data.get('annotation_type')) {

            // annotationType = 'video' handler
            case 'video':

                try {

                    // If there is a change in media for the update, delete previous child of the annotations table, update, then return
                    if (data.get('mediaTransition')) {

                        let deletion

                        if (data.get('previousMedia') === 'photo') deletion = await deletePhotoAnnotation(data.get('annotation_id') as string)
                        else deletion = await deleteModelAnnotation(data.get('annotation_id') as string)

                        const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string, data.get('url') as string)
                        const newVideoAnnotation = await createVideoAnnotation(data.get('url') as string, data.get('length') as string, data.get('annotation_id') as string)

                        // Successful response returns message as the data value and response objects from prisma as the response values
                        return Response.json({ data: 'Annotation updated', response: deletion, updatedAnnotation, newVideoAnnotation })
                    }

                    // Database annotation update
                    const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string, data.get('url') as string)
                    const updatedVideoAnnotation = await updateVideoAnnotation(data.get('url') as string, data.get('length') as string, data.get('annotation_id') as string)

                    // Successful response returns message as the data value and response objects from prisma as the response values
                    return Response.json({ data: 'Annotation updated', response: updatedAnnotation, updatedVideoAnnotation })
                }
                // Catch returns 400 status with 3rd party error message as response value; data and statusText are generic error messages
                catch (e: any) { return Response.json({ data: 'Prisma Error', response: e.message }, { status: 400, statusText: 'Prisma Error' }) }

            // annotationType = 'model' handler
            case 'model':

                try {

                    // If there is a change in media for the update, delete previous child of the annotations table, update, then return
                    if (data.get('mediaTransition')) {

                        let deletion

                        if (data.get('previousMedia') === 'photo') deletion = await deletePhotoAnnotation(data.get('annotation_id') as string)
                        else deletion = await deleteVideoAnnotation(data.get('annotation_id') as string)

                        const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string)
                        const newModelAnnotation = await createModelAnnotation(data.get('modelAnnotationUid') as string, data.get('annotation') as string, data.get('annotation_id') as string)

                        // Successful response returns message as the data value and response objects from prisma as the response values
                        return Response.json({ data: 'Annotation updated', response: deletion, updatedAnnotation, newModelAnnotation })
                    }

                    // Database annotation update
                    const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string)
                    const updatedModelAnnotation = await updateModelAnnotation(data.get('modelAnnotationUid') as string, data.get('annotation') as string, data.get('annotation_id') as string)

                    // Successful response returns message as the data value and response objects from prisma as the response values
                    return Response.json({ data: 'Annotation updated', response: updatedAnnotation, updatedModelAnnotation })
                }
                // Catch returns 400 status with 3rd party error message as response value; data and statusText are generic error messages
                catch (e: any) { return Response.json({ data: 'Prisma Error', response: e.message }, { status: 400, statusText: 'Prisma Error' }) }

            // Default case (annotationType == 'photo')
            default:

                try {

                    // Optional photo_annotation data initializtion
                    let photoBuffer

                    if (data.get('file')) {
                        const file = data.get('file') as File
                        const bytes = await file.arrayBuffer().catch((e) => {
                            if (process.env.LOCAL_ENV) console.error(e.message)
                            throw Error("Couldn't get array buffer")
                        })

                        photoBuffer = Buffer.from(bytes)

                        await mkdir(data.get('dir') as string, { recursive: true }).catch((e) => {
                            if (process.env.LOCAL_ENV) console.error(e.message)
                            throw Error("Couldn't make directory")
                        })
                        //@ts-ignore
                        await writeFile(data.get('path') as string, photoBuffer).catch((e) => {
                            if (process.env.LOCAL_ENV) console.error(e.message)
                            throw Error("Couldn't write file")
                        })
                    }

                    // Temporary way of elminiating previous photo uploaded to data storage container
                    if (data.get('oldUrl')) {
                        await unlink(`public${data.get('oldUrl')}`).catch((e) => {
                            if (process.env.LOCAL_ENV) console.error(e.message)
                            throw Error("Couldn't delete old annotation")
                        })
                    }

                    const website = data.get('website') ? data.get('website') : undefined
                    const title = data.get('photoTitle') ? data.get('title') : undefined

                    // If there is a change in media for the update, delete previous child of the annotations table, update, then return
                    if (data.get('mediaTransition')) {

                        let deletion

                        if (data.get('previousMedia') === 'video') deletion = await deleteVideoAnnotation(data.get('annotation_id') as string)
                        else deletion = await deleteModelAnnotation(data.get('annotation_id') as string).catch((e) => {
                            if (process.env.LOCAL_ENV) console.error(e.message)
                            throw Error("Couldn't delete annotation")
                        })

                        const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string, data.get('url') as string).catch((e) => {
                            if (process.env.LOCAL_ENV) console.error(e.message)
                            throw Error("Couldn't update annotation")
                        })

                        const newPhotoAnnotation = await createPhotoAnnotation(data.get('url') as string, data.get('author') as string, data.get('license') as string, data.get('annotator') as string, data.get('annotation') as string, data.get('annotation_id') as string, website as string | undefined, title as string | undefined).catch((e) => {
                            if (process.env.LOCAL_ENV) console.error(e.message)
                            throw Error("Couldn't create photo annotation")
                        })

                        return Response.json({ data: 'Annotation updated', response: deletion, updatedAnnotation, newPhotoAnnotation })
                    }

                    // Database annotation update
                    const updatedAnnotation = await updateAnnotation(data.get('uid') as string, data.get('position') as string, data.get('annotation_type') as string, data.get('annotation_id') as string, data.get('title') as string, data.get('url') as string).catch((e) => {
                        if (process.env.LOCAL_ENV) console.error(e.message)
                        throw Error("Couldn't update annotation")
                    })

                    const updatedPhotoAnnotation = await updatePhotoAnnotation(data.get('url') as string, data.get('author') as string, data.get('license') as string, data.get('annotator') as string, data.get('annotation') as string, data.get('annotation_id') as string, website as string | undefined, title as string | undefined).catch((e) => {
                        if (process.env.LOCAL_ENV) console.error(e.message)
                        throw Error("Couldn't update photo annotation")
                    })

                    // Successful response returns message as the data value and response objects from prisma as the response values
                    return Response.json({ data: 'Annotation updated', response: { updatedAnnotation, updatedPhotoAnnotation } })
                }
                // Catch returns 400 status with 3rd party error message as response value; data and statusText are generic error messages
                catch (e: any) { return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: 'Prisma Error' }) }
        }
    }
}




// Delete request handler
export async function DELETE(request: Request) {

    try {
        // Get request data
        const data = await request.json()

        // Delete photo directory if it exists
        if (data.path) await rm(data.path, { recursive: true, force: true }).catch((e) => {
            if (process.env.LOCAL_ENV) console.error(e.message, { recursive: true, force: true })
            throw Error("Couldn't delete annotation directory")
        })

        // Delete the annotation, typical return 
        const deletion = await deleteAnnotation(data.annotation_id, data.uid).catch((e) => {
            if (process.env.LOCAL_ENV) console.error(e.message)
            throw Error("Couldn't delete annotation")
        })

        return Response.json({ data: 'Annotation deleted', response: deletion })

    }
    // Catch returns 400 status with 3rd party error message as response value; data and statusText are generic error messages
    catch (e: any) { return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: 'Deletion Error' }) }
}
