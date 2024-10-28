/**
 * @file /app/api/approveModel
 * @fileoverview route handler for approving 3D model submissions (and posting to inaturalist for community ID)
 */

import { approveModel, getAccount } from "@/api/queries"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { Account } from "@prisma/client"
import { readFile } from "fs/promises"
import ExifReader from "exifreader"
import { ApproveModelObject } from "@/api/types"
import { fetchSpecimenGbifInfo } from "@/api/fetchFunctions"
import { updateCommunityId } from "@/api/queries"

export async function POST(request: Request) {

    try {

        // Variable initialization
        const data = new FormData()
        var dateTimeOriginal = ''
        const photoBuffers = []
        let promises = []
        let results: any = []

        const requestData: ApproveModelObject = await request.json().catch((e) => {
            console.error(e.message)
            throw new Error("Couldn't get body data")
        })

        // Check if we can find data on the species
        const gMatch = await fetchSpecimenGbifInfo(requestData.species)

        // If so, we make an iNaturalist post with submitted image(s) for community id of the specimen
        if (gMatch.hasInfo && requestData.wild) {

            // Get server session
            const session = await getServerSession(authOptions).catch((e) => {
                console.error(e.message)
                throw new Error("Couldn't get session")
            })

            // Get account
            const account = await getAccount(session.user.id, 'inaturalist').catch((e) => {
                console.error(e.message)
                throw new Error("Couldn't get account")
            }) as Account

            // Get iNatToken from account
            const iNatToken = account.access_token

            // Get photo buffers and extract the date of the photos if available
            for (let i = 0; i < (requestData.files as string[]).length; i++) {

                // Get buffer
                const buffer = await readFile(`public/data/Herbarium/tmp/submittal/${requestData.confirmation}/${requestData.files[i]}`).catch((e) => {
                    console.error(e.message)
                    throw new Error("Couldn't read photo file")
                })

                // Update dateTimeOriginal if data is available
                if (!dateTimeOriginal) {

                    // Load buffer into exif reader
                    const tags = ExifReader.load(buffer)

                    // Format and add dateTimeOriginal if available
                    if (tags['DateTimeOriginal'] && tags['DateTimeOriginal'].description) {
                        const date = dateTimeOriginal.slice(0, 10).replace(/:/g, "-")
                        const time = dateTimeOriginal.slice(-8).slice(0, 5)
                        dateTimeOriginal = date + ' ' + time
                    }
                }

                // Add buffer to array
                photoBuffers.push(buffer)
            }

            // iNaturalist post body object
            const postObj = {
                observation: {
                    species_guess: requestData.species as string,
                    latitude: requestData.latitude as number,
                    longitude: requestData.longitude as number,
                    observed_on_string: dateTimeOriginal ? dateTimeOriginal : new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5)
                }
            }

            // iNaturalist observation post
            const postObservation = await fetch('https://api.inaturalist.org/v1/observations', {
                method: 'POST',
                headers: {
                    'Authorization': iNatToken as string
                },
                body: JSON.stringify(postObj)
            })
                .then(res => res.json())
                .then(json => json)
                .catch((e) => {
                    console.error(e.message)
                    throw new Error("Error posting observation")
                })

            // iNaturalist sends a 200 status code with error keys on bad request
            if (Object.keys(postObservation).includes('error')) { throw Error(postObservation.error.original.error ?? 'error') }

            // Set observation ID in formdata (so iNaturalist knows what observation the photos belong to)
            data.set('observation_photo[observation_id]', postObservation.id)

            // Iterate through photoBuffers, pushing photo post promise onto the promises array each iteration
            for (let i = 0; i < photoBuffers.length; i++) {

                // Convert buffer to blob
                const uint8Array = new Uint8Array(photoBuffers[i])
                const blob = new Blob([uint8Array])
                data.set(`file`, blob)

                // Push photo post promise to array
                promises.push((fetch('https://api.inaturalist.org/v1/observation_photos', {
                    method: 'POST',
                    headers: {
                        'Authorization': iNatToken as string
                    },
                    body: data
                })
                    .then(res => res.json())
                    .then(json => json)
                ))
            }

            // Await photo posts
            results = await Promise.all(promises).catch((e) => {
                console.error(e.message)
                throw new Error("Error posting observation photo")
            })

            // iNaturalist sends a 200 status code with error keys on bad request
            for (let i = 0; i < results.length; i++) { if (Object.keys(results[i]).includes('error')) { throw Error('Error posting photo to observation') } }

            await updateCommunityId(requestData.confirmation, postObservation.id)
        }

        // Finally, mark the 3D model as approved in the database
        const approved = await approveModel(requestData.confirmation).catch((e) => {
            console.error(e.message)
            throw new Error("Error approving 3D model")
        })

        // Typical success response
        return Response.json({ data: '3D Model Approved', response: approved })
    }

    // Typical fail response
    catch (e: any) { return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message }) }
}