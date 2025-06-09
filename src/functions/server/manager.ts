/**
 * @file src\functions\server\manager.ts
 * 
 * @fileoverview manager server actions
 */

'use server'

// Typical imports
import { configureThumbnailDir, isLocalEnv } from "../client/utils"
import { serverActionCatch, serverActionErrorHandler } from "./error"
import { autoWriteArrayBuffer } from "./files"
import { updateThumbUrl } from "./queries"
import { getAnnotatedAndAnnotationModelsMigrationArray } from "./migrations/annotatedAndAnnotation"
import { readdir } from "fs/promises"

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
export const migrateModelAnnotationToAnnotatedModel = async (annotationModelUid: string) => {
    try {
        // Get annotation id from model annotation uid
        const annotationId = await prisma.model_annotation.findUnique({ where: { uid: annotationModelUid } }).then(annotation => annotation?.annotation_id)
            .catch(e => serverActionErrorHandler(e.message, 'await prisma.model_annotation.findUnique()', "Couldn't get annotation id")) as string

        // Establish database to migrate to/from based on environment
        const local = process.env.LOCAL_ENV
        const d1 = local === 'development' ? 'Development' : 'Test'
        const d2 = local === 'development' ? 'Test' : 'Production'

        // Prisma transaction array
        const transaction = [
            annotationModelMigrate.migrateAnnotationModelData(annotationModelUid, d1, d2),
            annotationModelMigrate.migrateBaseAnnotation(annotationId, d1, d2),
            annotationModelMigrate.migrateModelAnnotation(annotationId, d1, d2)
        ]

        // Await transaction, return
        await prisma.$transaction(transaction).catch(e => serverActionErrorHandler(e.message, 'prisma.$transaction(transaction)', "Couldn't migrate new model annotation"))
        return `Annotation Model migrated from ${d1} database to ${d2} database`
    }
    // Typical catch
    catch (e: any) { return `Error: ${e.message}` }
}

/**
 * 
 * @returns 
 */
export const migrateAnnotatedAndAnnotationModels = async () => {
    try {
        // Determine databased for migration based on env
        const local = process.env.LOCAL_ENV
        const d1 = local === 'development' ? 'Development' : 'Test'
        const d2 = local === 'development' ? 'Test' : 'Production'

        // Get transaction array and await transaction
        const migrationTransactionArray = getAnnotatedAndAnnotationModelsMigrationArray(d1, d2)
        await prisma.$transaction(migrationTransactionArray).catch(e => serverActionErrorHandler(e.message, 'prisma.$transaction(transaction)', "Couldn't migrate models"))
        return `Annotated and annotation 3D models from ${d1} database have been migrated to ${d2} database`
    }
    catch (e: any) { serverActionCatch(e.message) }
}

/**
 * 
 * @param path path of directory to read
 * @returns ideally, a string[] containing all file names in a given directory; returns empty string on error
 */
export const readDirectory = async (path: string) => {
    try { return await readdir(path).catch(e => serverActionErrorHandler(e.message, 'readdir(path)', "Directory not found")) }
    catch (e: any) { return [] }
}
