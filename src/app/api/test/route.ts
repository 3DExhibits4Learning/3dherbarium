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

const route = 'src/app/api/test/route.ts'

// DYNAMIC ROUTE
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {

  try {

    const headers = Object.fromEntries(request.headers)
    const fileName = headers['x-file-name']
    const reader = (request.body as ReadableStream).getReader()

    while(true){
      //@ts-ignore
      const {done, value} = await reader.read().catch((e: any) => routeHandlerErrorHandler(route, e.message, 'reader.read()', 'Reader error'))
      if (done) break
      fs.appendFileSync(`public/data/Herbarium/models/${fileName}`, value)
    }

    // const readable = new Readable({
    //   async read(){
    //     const {done, value} = await reader.read()
    //     if(done) this.push(null)
    //     else this.push(value)
    //   }
    // })

    // const writeStream = fs.createWriteStream(`public/data/Herbarium/models/${fileName}`)
    // readable.pipe(writeStream)

    // readable.on('end', () => console.log('File Uploaded'))

    return routeHandlerTypicalResponse('Model Uploaded', 'success')
  }
  catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}