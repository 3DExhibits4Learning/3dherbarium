/**
 * @file src/functions/server/modelUpload.ts
 * 
 * @fileoverview model upload server actions
 * 
 */

'use server'

// Typical imports
import { ModelUploadResponse } from "@/ts/types"
import { serverActionErrorHandler} from "./error"
import { redirect } from "next/navigation"
import { readFile } from "fs/promises"

/**
 * 
 * @param base64FileString 
 * @returns route handler style response with success message and ModelUploadResponse (or error messages onCatch)
 */
export const uploadModel = async () => {

    try {

        console.log('Uploading model')

        // Transition argument from base64 => file
        const path = process.env.NEXT_PUBLIC_LOCAL_ENV === 'development' ? 'X:/Herbarium/models/mushroom.blend' : 'public/data/Herbarium/models/MeshroomVersusWebODM.blend'
        var buffer: any = await readFile(path)
        var blob: any = new Blob([buffer])
        var file: any = new File([blob], "ServerAction.Blend")

        // Upload endpoint
        const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`

        // Form data
        var data: any = new FormData()
        data.append('orgProject', process.env.SKETCHFAB_PROJECT_TEST as string)
        data.append('modelFile', file)
        data.append('visibility', 'private')
        data.append('options', JSON.stringify({ background: { color: "#000000" } }))
        data.append('name', 'Server Action Test')

        // Upload 3D Model
        var sketchfabUpload: ModelUploadResponse | null = await fetch(orgModelUploadEnd, {
            headers: { 'Authorization': process.env.SKETCHFAB_API_TOKEN as string },
            method: 'POST',
            body: data
        })
            .then(res => { if (!res.ok) serverActionErrorHandler(res.statusText, "uploadModel()", "Coulnd't upload to Sketchfab", true); return res.json() })
            .then(json => json)
            .catch(e => serverActionErrorHandler(e.message, "uploadModel()", "Coulnd't upload to Sketchfab", true))

        buffer = blob = file = sketchfabUpload = data = null
        
        if(global.gc) global.gc()
        else console.log('No cleanup')

        console.log('Upload complete')
    }
    catch(e: any) {console.error(e.message)}
}