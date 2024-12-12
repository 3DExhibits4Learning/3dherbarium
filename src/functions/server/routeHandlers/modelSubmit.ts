/**
 * @file src/functions/server/routeHandlers/modelSubmit.ts
 * 
 * @fileoverview logic file for src/app/api/modelSubmit/route.ts
 */

import { routeHandlerErrorHandler } from "../error"
import { mkdir, writeFile } from "fs/promises"

/**
 * 
 * @param body formData sent to route
 */
export const writePhotosToTmpSubmittal = async (body: FormData) => {

    // Variables
    const writePromises = []
    const path = `public/data/Herbarium/tmp/submittal/${body.get('confirmation')}`
    const handlerPath = 'src/app/api/modelSubmit/route.ts'

    // Iterator
    for (let i = 0; i < parseInt(body.get('numberOfPhotos') as string); i++) {

        // Make the directory if this is the first photo
        if (i === 0) await mkdir(path, { recursive: true }).catch(e => routeHandlerErrorHandler(handlerPath, e.message, "mkdir()", "Coulnd't make directory"))

        // file => arrayBuffer => buffer
        const file = body.get(`photo${i}`) as File
        const bytes = await file.arrayBuffer().catch(e => routeHandlerErrorHandler(handlerPath, e.message, "file.arrayBuffer()", "Couldn't create arrayBuffer")) as ArrayBuffer
        const buffer = Buffer.from(bytes)

        // Create filePath, prush promise onto array
        const filePath = path + `/${file.name}`
        writePromises.push(writeFile(filePath, buffer))
    }

    // Await all the file writings
    await Promise.all(writePromises).catch(e => routeHandlerErrorHandler(handlerPath, e.message, "Promise.all(writePromises)", "Coulnd't write photo file"))
}