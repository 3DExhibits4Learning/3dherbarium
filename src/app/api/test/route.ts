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

import https from 'https'
import fs from 'fs'
import { autoWrite } from "@/functions/server/files"
import { readFile } from "fs/promises"
//import FormData from "form-data"

export const dynamic = 'force-dynamic'

// PATH
const path = 'src/app/api/test/route.ts'

export async function POST(request: Request) {

  try {

    var requestData: any = await request.formData()

    var model: any = requestData.get('file') as File
    const dir = process.env.LOCAL_ENV === 'development' ? 'X:/Herbarium/models' : 'public/data/Herbarium/models'
    var write: any = await autoWrite(model, dir, dir + '/' + model.name)

    requestData = null; model = null, write = null

    // const model = await readFile('public/data/Herbarium/models/MeshroomVersusWebODM.blend')

    // const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`

    // const data = new FormData()
    // data.append('orgProject', process.env.SKETCHFAB_PROJECT_TEST as string)
    // data.append('modelFile', new Blob([model]))
    // data.append('visibility', 'private')
    // data.append('options', JSON.stringify({ background: { color: "#000000" } }))
    // data.append('name', 'stream test')

    // // Upload 3D Model, setting uploadProgress in the process
    // const sketchfabUpload: ModelUploadResponse = await fetch(orgModelUploadEnd, {
    //   headers: { 'Authorization': process.env.SKETCHFAB_API_TOKEN as string },
    //   method: 'POST',
    //   body: data
    // })
    //   .then(res => { if (!res.ok) routeHandlerErrorHandler(path, res.statusText, "fetch(orgModelUploadEnd)", "Bad Sketchfab Request"); return res.json() })
    //   .then(json => json)
    //   .catch(e => routeHandlerErrorHandler(path, e.message, "fetch(orgModelUploadEnd)", "Coulnd't upload to Sketchfab"))

      return routeHandlerTypicalResponse('Model Uploaded', 'success')

    // const formData = new FormData()
    
    // formData.append('orgProject', process.env.SKETCHFAB_PROJECT_TEST as string)
    // formData.append('visibility', 'private')
    // formData.append('options', JSON.stringify({ background: { color: "#000000" } }))
    // formData.append('name', 'stream test')
    // formData.append("modelFile", fs.createReadStream('X:/Herbarium/models/mushroom.blend'))

    // const headers = { 'Authorization': process.env.SKETCHFAB_API_TOKEN as string }

    // const req = https.request({
    //   hostname: `api.sketchfab.com`,
    //   path: `/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`,
    //   method: "POST",
    //   headers: formData.getHeaders(headers),
    // },
    //   res => {
    //     let response = ''

    //     res.on('data', chunk => response += chunk)
    //     res.on('end', () => console.log('Upload Response:', JSON.parse(response)))
    //   }
    // )

    // formData.pipe(req)

    // return routeHandlerTypicalResponse('Model Uploaded', '0')
  }
  catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}