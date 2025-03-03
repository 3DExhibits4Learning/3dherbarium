/**
 * @file src/functions/server/modelUpload.ts
 * 
 * @fileoverview model upload server actions
 * 
 */

'use server'

// Typical imports
import { ModelUploadResponse } from "@/ts/types"
import { serverActionErrorHandler, routeHandlerTypicalCatch } from "./error"
import { redirect } from "next/navigation"

/**
 * 
 * @param base64FileString 
 * @returns route handler style response with success message and ModelUploadResponse (or error messages onCatch)
 */
export const uploadModel = async (base64FileString: string) => {

    try {

        console.log('Uploading model')

        // Transition argument from base64 => file
        const buffer = Buffer.from(base64FileString, 'base64')
        const blob = new Blob([buffer])
        const file = new File([blob], "ServerAction.Blend")

        // Upload endpoint
        const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`

        // Form data
        const data = new FormData()
        data.append('orgProject', process.env.SKETCHFAB_PROJECT_TEST as string)
        data.append('modelFile', file)
        data.append('visibility', 'private')
        data.append('options', JSON.stringify({ background: { color: "#000000" } }))
        data.append('name', 'Server Action Test')

        // Upload 3D Model
        const sketchfabUpload: ModelUploadResponse = await fetch(orgModelUploadEnd, {
            headers: { 'Authorization': process.env.SKETCHFAB_API_TOKEN as string },
            method: 'POST',
            body: data
        })
            .then(res => { if (!res.ok) serverActionErrorHandler(res.statusText, "uploadModel()", "Coulnd't upload to Sketchfab", true); return res.json() })
            .then(json => json)
            .catch(e => serverActionErrorHandler(e.message, "uploadModel()", "Coulnd't upload to Sketchfab", true))

        console.log('Upload complete')
        redirect('/admin/management')
    }
    catch(e: any) {return routeHandlerTypicalCatch(e.message)}
}