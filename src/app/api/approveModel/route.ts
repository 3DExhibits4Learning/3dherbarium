/**
 * @file src/app/api/approveModel
 *
 * @fileoverview route handler for approving 3D model submissions (and posting to inaturalist for community ID)
 * 
 * @todo exif reader logic needs to be moved to the model submit form
 * @todo entire if block should be its own function (with loops/fetches as stand alone functions)
 * @todo delete iNat post photos from tmp storage
 */

// Typical imports
import { approveModel, getAccount } from "@/functions/server/queries"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { Account } from "@prisma/client"
import { readFile } from "fs/promises"
import { ApproveModelObject, GbifResponse } from "@/ts/types"
import { fetchSpecimenGbifInfo } from "@/functions/server/fetchFunctions"
import { updateCommunityId } from "@/functions/server/queries"
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"
import { sendHTMLEmail } from "@/functions/server/email"
import { routeHandlerError } from "@/functions/server/error"

// Default imports
import ExifReader from "exifreader"

// Path
const path = 'src/app/api/approveModel'

// POST route handler
export async function POST(request: Request) {

    try {

        // Variable initialization
        const data = new FormData()
        var dateTimeOriginal = ''
        const photoBuffers = []
        let promises = []
        let results: any = []
        const re = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/

        // Grab request data; see if we can identify the specimen with GBIF
        const requestData: ApproveModelObject = await request.json().catch(e => routeHandlerErrorHandler(path, e.message, "request.json()", "Coudn't get json"))
        const gMatch = await fetchSpecimenGbifInfo(requestData.species).catch(e => routeHandlerErrorHandler(path, e.message, "fetchSpecimenGbifInfo()", "Coudn't get GBIF data")) as { hasInfo: boolean; data?: GbifResponse }

        // If so, we make an iNaturalist post with submitted image(s) for community id of the specimen (if the specimen is marked/approved as wild)
        if (gMatch.hasInfo && requestData.wild) {

            // Get account from session, get token from account
            const session = await getServerSession(authOptions).catch(e => routeHandlerErrorHandler(path, e.message, "getServerSession()", "Coudn't get session"))
            const account = await getAccount(session.user.id, 'inaturalist').catch(e => routeHandlerErrorHandler(path, e.message, "getAccount()", "Coudn't get iNat account")) as Account
            const iNatToken = account.access_token

            // Get photo buffers and extract the date of the photos if available
            for (let i = 0; i < (requestData.files as string[]).length; i++) {

                // Get buffer
                const buffer = await readFile(`public/data/Herbarium/tmp/submittal/${requestData.confirmation}/${requestData.files[i]}`).catch(e => routeHandlerErrorHandler(path, e.message, "readFile()", "Coudn't read photo")) as Buffer

                // Update dateTimeOriginal if data is available
                if (!dateTimeOriginal) {

                    // Load buffer into exif reader
                    const tags = ExifReader.load(buffer)

                    // Format and add dateTimeOriginal if available from exif data
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
                    observed_on_string: dateTimeOriginal && re.test(dateTimeOriginal) ? dateTimeOriginal : new Date().toISOString().slice(0, 10) + ' ' + new Date().toTimeString().slice(0, 5)
                }
            }

            // iNaturalist observation post
            const postObservation = await fetch('https://api.inaturalist.org/v1/observations', {
                method: 'POST',
                headers: { 'Authorization': iNatToken as string },
                body: JSON.stringify(postObj)
            })
                .then(res => res.json())
                .then(json => json)
                .catch(e => routeHandlerErrorHandler(path, e.message, "postObservation", "Coudn't post observation"))

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
                    headers: { 'Authorization': iNatToken as string },
                    body: data
                })
                    .then(res => res.json())
                    .then(json => json)
                ))
            }

            // Await photo posts, check for error keys in reply (iNat sends a 200 response with 'error' as an object key in case of error)
            results = await Promise.all(promises).catch(e => routeHandlerErrorHandler(path, e.message, "Promise.all(promises)", "Couldn't add photos to observation"))
            for (let i = 0; i < results.length; i++) { if (Object.keys(results[i]).includes('error')) { throw Error('Error posting photo to observation') } }

            // Update community (inat) ID
            await updateCommunityId(requestData.confirmation, postObservation.id).catch(e => routeHandlerErrorHandler(path, e.message, "updateCommunityId()", "Coudn't update iNat post id"))
        }

        // Finally, mark the 3D model as approved in the database and email the contributor
        const approved = await approveModel(requestData.confirmation).catch(e => routeHandlerErrorHandler(path, e.message, "approveModel()", "Coudn't approve model"))

        // Contributor email HTML
        const contributorEmailHtml = `Congratulations, your model has been published on the 3D Herbarium!
            <br><br>
            You can see your model at 3dherbarium.org/collections/${requestData.species}/?communityId=${requestData.uid}
            <br><br>
            Thank you for your contribution!`

        // Note that this is a nonFatal error catch
        await sendHTMLEmail(requestData.email, "3D Model Published", contributorEmailHtml).catch(e => console.error(routeHandlerError(path, e.message, "sendHTMLEmail()", 'POST', true)))

        // Typical success response
        return routeHandlerTypicalResponse('3D Model Approved', approved)
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}