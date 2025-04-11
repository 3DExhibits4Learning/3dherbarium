/**
 * @file src\app\api\modelSubmit\tmp\route.ts
 * 
 * @fileoverview writes files to temporarily to disk for third party uploads
 */

// Typical imports
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from '@/functions/server/error'

// Route
const route = 'src/app/api/modelSubmit/tmp/route.ts'

// Default imports
import fs from 'fs'

export async function POST(request: Request) {
    try {
        // Get form data, chunk and temporary file path
        const requestData = await request.formData().catch(e => routeHandlerErrorHandler(route, e.message, 'request.formData()', "Couldn't get form data")) as FormData
        const chunk = requestData.get('chunk') as File
        const tmpFilePath = requestData.get('path') as string

        // Append binary data to file
        const arrayBuffer = await chunk.arrayBuffer().catch(e => routeHandlerErrorHandler(route, e.message, 'chunk.arrayBuffer()', "Couldn't get array buffer")) as ArrayBuffer
        const typedArray = new Uint8Array(arrayBuffer)
        fs.appendFileSync(tmpFilePath, typedArray)

        // Default response
        return new Response()
    }
    // Typical catch
    catch(e: any) {return routeHandlerTypicalCatch(e.message)}
}