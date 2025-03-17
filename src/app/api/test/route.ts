/**
 * @file src/app/api/test/route.ts
 * 
 * @fileoverview route handler for testing new libraries/modules
 * 
 * @description currently testing JSZip external uploads
 */

// Typical imports
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"

// Default imports
import fs from 'fs'

// DYNAMIC ROUTE
export const dynamic = 'force-dynamic'

// PATH
const path = 'src/app/api/test/route.ts'

export async function POST(request: Request) {

  try {

    const headers = Object.fromEntries(request.headers)
    const fileName = headers['x-file-name']
    var reader: any = (request.body as ReadableStream).getReader()

    while(true){
      const {done, value} = await reader.read().catch((e: any) => routeHandlerErrorHandler(path, e.message, 'reader.read()', 'Reader error'))
      if (done) break
      fs.appendFileSync(`public/data/Herbarium/models/${fileName}`, value)
    }

    return routeHandlerTypicalResponse('Model Uploaded', 'success')
  }
  catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}