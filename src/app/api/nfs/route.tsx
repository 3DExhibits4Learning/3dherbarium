/**
 * @file src/app/api/nfs/route.tsx
 * 
 * @fileoverview Retrieve buffers from NFS data storage
 */

// Imports
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { readFile } from "fs/promises"

// Path
const path = 'src/app/api/nfs/route.tsx'

/**
 * @param request HTTP request (must have path)
 * @returns Buffer
 */

export async function GET(request: Request) {

    try {
        // Get path, else throw error
        const { searchParams } = new URL(request.url)
        if(!searchParams.get('path')) throw Error('Path missing')

        // Get buffer
        const fileBuffer = await readFile(searchParams.get('path') as string).catch(e => routeHandlerErrorHandler(path, e.message, 'readFile()', "Can't read file")) as Buffer

        // Return response w/ buffer
        return new Response(fileBuffer)
    }
    // Typical catch
    catch (e: any) {return routeHandlerTypicalCatch(e.message)}
}