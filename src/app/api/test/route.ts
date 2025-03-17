/**
 * @file src/app/api/test/route.ts
 * 
 * @fileoverview route handler for testing new libraries/modules
 * 
 * @description currently testing JSZip external uploads
 */

// Typical imports
// import { ModelUploadResponse } from "@/ts/types"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"

// import https from 'https'
import fs from 'fs'
// import { autoWrite } from "@/functions/server/files"
// import { readFile } from "fs/promises"
// import FormData from "form-data"

export const dynamic = 'force-dynamic'

// PATH
const path = 'src/app/api/test/route.ts'

export async function POST(request: Request) {

  try {

    // await fs.createWriteStream('public/data/Herbarium/model/')
    const headers = Object.fromEntries(request.headers)
    const fileName = headers['x-file-name']
    // const writable = await fs.createWriteStream(`public/data/Herbarium/models/${fileName}`)
    // const writable = new WritableStream({
    //   start(controller) {
    //     console.log("Writable stream started")
    //   },
    //   write(chunk, controller) {
    //     fs.appendFileSync(`public/data/Herbarium/models/${fileName}`, chunk)
    //   },
    //   close() {
    //     console.log("File write complete!")
    //   },
    //   abort(err) {
    //     console.error("Stream aborted due to error:", err)
    //   }
    // })
    // request.body?.pipeTo(writable)

    var reader: any = (request.body as ReadableStream).getReader()

    const readStream = async () => {
      const {done, value} = await reader.read().catch((e: any) => routeHandlerErrorHandler(path, e.message, 'reader.read()', 'Reader error'))
      if (done) {
        reader.releaseLock()
        return
      }
      fs.appendFileSync(`public/data/Herbarium/models/${fileName}`, value)
      console.log('Writing Chunk')
      console.log(value)
      readStream()
    }

    readStream()

    return routeHandlerTypicalResponse('Model Uploaded', 'success')
  }
  catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}