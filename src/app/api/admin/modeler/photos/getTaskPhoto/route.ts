/**
 * @file src/app/api/admin/modeler/photos/getTaskPhoto/route.ts
 * 
 * @fileoverview route handler returning photo buffers for the modeler "Tasks" client component
 */

// Imports
import { readFile } from "fs/promises";
import { routeHandlerErrorHandler } from "@/functions/server/error";
import { specimen } from "@prisma/client";
import { routeHandlerTypicalCatch } from "@/functions/server/error";
import prisma from "@/functions/server/utils/prisma"

// PATH
const path = 'src/app/api/admin/modeler/photos/getTaskPhoto/route.ts'

export async function GET(request: Request) {

    try {
        // Get search params
        const { searchParams } = new URL(request.url)

        // Variable initialization
        const sidSlice = searchParams.get('sidSlice') as string; if (!sidSlice) throw Error('Missing sid')

        // Find specimen containing the first 
        const specimen = await prisma.specimen.findFirst({ where: { sid: { contains: sidSlice } } })
            .catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.specimen.findFirst()', "Can't find specimen with provided sid")) as specimen
        if(!specimen) throw Error("Couldn't find specimen")

        // Determine path
        const filePath = process.env.LOCAL ? `X:${specimen.photoUrl.slice(11)}` : specimen.photoUrl

        // Read file
        const fileBuffer = await readFile(filePath).catch(e => routeHandlerErrorHandler(path, e.message, 'readFile()', "Can't read file")) as Buffer

        // Return response w/ buffer
        return new Response(fileBuffer, { status: 200 })
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}