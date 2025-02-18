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

// PATH
const path = 'src/app/api/test/route.ts'

export async function POST(request: Request) {

  try {
    const requestData = await request.formData()

    const model = requestData.get('file') as File
    const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`

    const data = new FormData()
    data.set('orgProject', process.env.SKETCHFAB_PROJECT_TEST as string)
    data.set('modelFile', model)
    data.set('visibility', 'private')
    data.set('options', JSON.stringify({ background: { color: "#000000" } }))
    data.set('name', 'Zip Test')

    // Upload 3D Model, setting uploadProgress in the process
    const sketchfabUpload: ModelUploadResponse = await fetch(orgModelUploadEnd, {
      headers: { 'Authorization': process.env.SKETCHFAB_API_TOKEN as string },
      method: 'POST',
      body: data
    })
      .then(res => { if (!res.ok) routeHandlerErrorHandler(path, res.statusText, "fetch(orgModelUploadEnd)", "Bad Sketchfab Request"); return res.json() })
      .then(json => json)
      .catch(e => routeHandlerErrorHandler(path, e.message, "fetch(orgModelUploadEnd)", "Coulnd't upload to Sketchfab"))

      return routeHandlerTypicalResponse('Model Uploaded', sketchfabUpload)
  }
  catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}