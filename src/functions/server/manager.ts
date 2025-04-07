/**
 * @file src\functions\server\manager.ts
 * 
 * @fileoverview manager server actions
 */

'use server'

// Typical imports
import { configureThumbnailDir } from "../client/utils"
import { serverActionCatch, serverActionErrorHandler } from "./error"
import { autoWriteArrayBuffer } from "./files"
import { updateThumbUrl } from "./queries"

// Import all migration logic
import * as annotationModelMigrate from "@/functions/server/migrations/annotationModel"

// SINGLETON
import prisma from "./utils/prisma"

/**
 * 
 * @param uid 
 * @param isCommunity 
 * @returns 
 * @description fetches thumbnail url for the given uid; then fetches thumbnail photo, writes photo to storage, and updates corresponding database record url
 */
export const updateThumbnail = async (uid: string, isCommunity: boolean) => {
    try {
        // Variable initialization
        const dir = configureThumbnailDir() // Directory to write to based on env
        const cloudDir = '/data/Herbarium/thumbnails'
        var contentType
        var extension = ''

        // Get thumbnail url, then get thumbnail itself
        const thumbArrayBuffer = await fetch(`https://api.sketchfab.com/v3/models/${uid}`)
            .then(res => {
                if (res.ok) return res.json()
                throw Error("Couldn't get thumbnail url from model data")
            })
            .then(json => fetch(json.thumbnails.images[0].url)) // Fetch the photo after fetching the url (which is included in the model metadata)
            .then(res => {
                if (res.ok) {
                    contentType = res.headers.get('Content-Type')
                    extension = contentType ? '.' + contentType.split('/')[1] : '.jpeg' // Checking content type for future changes; all thumbmnails are currently jpegs
                    return res.arrayBuffer()
                }
                throw Error("Couldn't get thumbnail")
            }).catch(e => serverActionErrorHandler(e.message, 'thumbArrayBuffer', "Couldn't get thumbnail")) as ArrayBuffer

        // Declare path and url; write photo to data storage
        const path = `${dir}/${uid}${extension}`
        const url = `${cloudDir}/${uid}${extension}`
        await autoWriteArrayBuffer(thumbArrayBuffer, dir, path).catch(e => serverActionErrorHandler(e.message, 'autoWriteArrayBuffer()', "Couldn't write photo to storage"))

        // Update database record
        if (isCommunity) await updateThumbUrl(url, uid, true).catch(e => serverActionErrorHandler(e.message, 'updateThumbUrl()', "Coudn't update thumbnail in database"))
        else await updateThumbUrl(url, uid, false).catch(e => serverActionErrorHandler(e.message, 'updateThumbUrl()', "Coudn't update thumbnail in database"))

        // Success message
        return 'Thumbnail updated'
    }
    // Catch message
    catch (e: any) { return serverActionCatch(e.message) }
}

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateModelAnnotationToAnnotatedModel = async (modelAnnotationUid: string) => {
    try {
        // Get annotation id from model annotation uid
        const annotationId = await prisma.model_annotation.findUnique({ where: { uid: modelAnnotationUid } }).then(annotation => annotation?.annotation_id)
            .catch(e => serverActionErrorHandler(e.message, 'await prisma.model_annotation.findUnique()', "Couldn't get annotation id")) as string

        // Get base model uid from annotation id
        const baseModelUid = await prisma.annotations.findUnique({ where: { annotation_id: annotationId } }).then(annotation => annotation?.uid)
            .catch(e => serverActionErrorHandler(e.message, 'prisma.annotations.findUnique', "Couldn't get base model uid")) as string

        // Prisma transaction array
        const transaction = [
            annotationModelMigrate.migrateAnnotationModelData(baseModelUid),
            annotationModelMigrate.migrateAnnotationNumbers(baseModelUid),
            annotationModelMigrate.migrateBaseAnnotation(annotationId),
            annotationModelMigrate.migrateModelAnnotation(annotationId)
        ]

        // Await transaction, return
        await prisma.$transaction(transaction).catch(e => serverActionErrorHandler(e.message, 'prisma.$transaction(transaction)', "Couldn't migrate new model annotation"))
        return 'Model annotation added to test server'
    }
    // Typical catch
    catch (e: any) { serverActionCatch(e.message) }
}