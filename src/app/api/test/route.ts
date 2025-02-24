/**
 * @file src/app/api/test/route.ts
 * 
 * @fileoverview route handler for testing new libraries/modules
 * 
 * @description currently testing JSZip external uploads
 */

// Typical imports
import { ModelUploadResponse } from "@/ts/types"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"
import fs from 'fs'
import FormData from "form-data"

// PATH
const path = 'src/app/api/test/route.ts'

export async function POST(request: Request) {

  try {
    
    const requestData = await request.formData()

    // var model = requestData.get('file') as File
    // const arrayBuffer = await model.arrayBuffer()
    // const buffer = Buffer.from(arrayBuffer) X:\Herbarium\models
    const stream = fs.createReadStream('X:/Herbarium/models/mushroom.blend')
    console.log(stream)

    const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`

    // const data = new FormData()
    // data.append('orgProject', process.env.SKETCHFAB_PROJECT_TEST as string)
    // data.append('modelFile', stream)
    // data.append('visibility', 'private')
    // data.append('options', JSON.stringify({ background: { color: "#000000" } }))
    // data.append('name', 'stream test')

    // // Upload 3D Model, setting uploadProgress in the process
    // const sketchfabUpload: ModelUploadResponse = await fetch(orgModelUploadEnd, {
    //   headers: { 'Authorization': process.env.SKETCHFAB_API_TOKEN as string },
    //   method: 'POST',
    //   //@ts-ignore
    //   body: data
    // })
    //   .then(res => { if (!res.ok) routeHandlerErrorHandler(path, res.statusText, "fetch(orgModelUploadEnd)", "Bad Sketchfab Request"); return res.json() })
    //   .then(json => json)
    //   .catch(e => routeHandlerErrorHandler(path, e.message, "fetch(orgModelUploadEnd)", "Coulnd't upload to Sketchfab"))

    //   return routeHandlerTypicalResponse('Model Uploaded', sketchfabUpload)
    return routeHandlerTypicalResponse('Model Uploaded', 'asdf')

  }
  catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}