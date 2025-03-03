'use server'

import { ModelUploadResponse } from "@/ts/types"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "./error"
import { routeHandlerTypicalResponse } from "./response"
import { readFile } from "fs/promises"

const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`

const path = 'Model Upload Server Action'

export const uploadModel = async () => {

    try {

        const buffer = await readFile('public/data/Herbarium/models/MeshroomVersusWebODM.blend')
        const blob = new Blob([buffer])
        const file = new File([blob], "ServerAction.Blend")

        const data = new FormData()
        data.append('orgProject', process.env.SKETCHFAB_PROJECT_TEST as string)
        data.append('modelFile', file)
        data.append('visibility', 'private')
        data.append('options', JSON.stringify({ background: { color: "#000000" } }))
        data.append('name', 'Server Action Test')

        // Upload 3D Model, setting uploadProgress in the process
        const sketchfabUpload: ModelUploadResponse = await fetch(orgModelUploadEnd, {
            headers: { 'Authorization': process.env.SKETCHFAB_API_TOKEN as string },
            method: 'POST',
            body: data
        })
            .then(res => { if (!res.ok) routeHandlerErrorHandler(path, res.statusText, "fetch(orgModelUploadEnd)", "Bad Sketchfab Request"); return res.json() })
            .then(json => json)
            .catch(e => routeHandlerErrorHandler(path, e.message, "fetch(orgModelUploadEnd)", "Coulnd't upload to Sketchfab"))

        console.log('Model Uploaded')
    }
    catch(e: any) {console.log('Error: ', e.message)}
}