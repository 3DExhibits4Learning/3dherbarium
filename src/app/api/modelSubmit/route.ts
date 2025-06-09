/**
 * @file src/app/api/modelSubmit/route.ts
 * 
 * @fileoverview route handler for 3D model submission
 * 
 * @todo get chunked file from tmp
 */

// Imports
import { prismaClient } from "@/functions/server/queries"
import { ModelUploadResponse } from '@/ts/types'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { mkdir, readFile, writeFile } from "fs/promises"
import { routeHandlerError, routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"
import { sendHTMLEmail } from "@/functions/server/email"

// Singleton prisma client, path
const prisma = prismaClient()
const path = 'src/app/api/modelSubmit/route.ts'

/**
 * 
 * @param request HTTP request
 * @returns affirmation message and model insert response or error message
 */
export async function POST(request: Request) {

    // Typical auth redirect
    const session = await getServerSession(authOptions)

    if (!session || !session.user) redirect('/api/auth/signin')

    try {

        // Get request body
        const body = await request.formData()

        // Variable initialization
        var thumbUrl = ''
        const confirmation = body.get('confirmation') as string
        const position = JSON.parse(body.get('position') as string)
        const softwareArr = JSON.parse(body.get('software') as string)
        const tags = JSON.parse(body.get('tags') as string)
        const isMobile = body.get('isMobile') == 'Yes' ? true : false
        const email = session.user.email
        const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`
        const modelPath = body.get('modelPath') as string
        const fileName = body.get('fileName') as string

        // Function to write ID photos to tmp storage
        const writePhotos = async () => {

            // Variables
            const writePromises = []
            const path = `public/data/Herbarium/tmp/submittal/${confirmation}`

            // Iterator
            for (let i = 0; i < parseInt(body.get('numberOfPhotos') as string); i++) {

                // Make the directory if this is the first photo; get file and create arrayBuffer
                if (i === 0) await mkdir(path, { recursive: true }).catch(e => routeHandlerErrorHandler(path, e.message, "mkdir()", "Coulnd't make directory"))
                const file = body.get(`photo${i}`) as File
                const bytes = await file.arrayBuffer().catch(e => routeHandlerErrorHandler(path, e.message, "file.arrayBuffer()", "Couldn't create arrayBuffer")) as ArrayBuffer

                // Create buffer and filepath then push promise onto array
                const buffer = Buffer.from(bytes)
                const filePath = path + `/${file.name}`
                writePromises.push(writeFile(filePath, buffer))
            }

            // Await all the file writings
            await Promise.all(writePromises).catch(e => routeHandlerErrorHandler(path, e.message, "Promise.all(writePromises)", "Coulnd't write photo file"))
        }

        // Write ID photos to tmp storage
        await writePhotos().catch(e => routeHandlerErrorHandler(path, e.message, "writePhotos()", "Coulnd't write photo files"))

        // Typescript satisfied header
        const requestHeader: HeadersInit = new Headers()
        requestHeader.set('Authorization', process.env.SKETCHFAB_API_TOKEN as string)

        // Read file from tmp
        const buffer = await readFile(modelPath)
        const typedArray = new Uint8Array(buffer)
        const blob = new Blob([typedArray])

        // Set from data
        const data = new FormData()
        data.set('orgProject', process.env.SKETCHFAB_PROJECT_COMMUNITY as string)
        data.set('modelFile', blob, fileName)
        data.set('visibility', 'private')
        data.set('options', JSON.stringify({ background: { color: "#000000" } }))

        // Upload 3D Model, setting uploadProgress in the process
        const sketchfabUpload: ModelUploadResponse = await fetch(orgModelUploadEnd, {
            headers: { 'Authorization': process.env.SKETCHFAB_API_TOKEN as string },
            method: 'POST',
            body: data
        })
            .then(res => { if (!res.ok) routeHandlerErrorHandler(path, res.statusText, "fetch(orgModelUploadEnd)", "Bad Sketchfab Request"); return res.json() })
            .then(json => json)
            .catch(e => routeHandlerErrorHandler(path, e.message, "fetch(orgModelUploadEnd)", "Coulnd't upload to Sketchfab"))

        // Grab the uid and thumbnail, then enter model data into database
        const modelUid = sketchfabUpload.uid

        await fetch(`https://api.sketchfab.com/v3/models/${modelUid}`, { headers: requestHeader })
            .then(res => res.json())
            .then(data => thumbUrl = data.thumbnails.images[0].url)
            .catch(e => routeHandlerErrorHandler(path, e.message, `fetch(https://api.sketchfab.com/v3/models/${modelUid})`, "Coulnd't get model thumbmnail"))

        // Insert model data into database
        const insert = await prisma.userSubmittal.create({
            data: {
                confirmation: confirmation,
                email: email,
                artistName: body.get('artist') as string,
                speciesName: body.get('species') as string,
                createdWithMobile: isMobile,
                methodology: body.get('methodology') as string,
                modeluid: modelUid,
                status: 'Pending',
                thumbnail: thumbUrl,
                lat: position.lat,
                lng: position.lng,
                wild: body.get('wildOrCultivated') === 'wild' ? true : false,
            }
        }).catch(e => routeHandlerErrorHandler(path, e.message, "prisma.userSubmitaal.create()", "Coulnd't insert model into the database"))

        // Insert model software into database
        for (let software in softwareArr) {
            await prisma.submittalSoftware.create({
                data: {
                    id: confirmation,
                    software: softwareArr[software]
                }
            }).catch(e => routeHandlerErrorHandler(path, e.message, "prisma.submittalSoftware.create()", "Coulnd't insert software into the database"))
        }

        // Insert model tags into database
        for (let tag in tags) {
            await prisma.submittalTags.create({
                data: {
                    id: confirmation,
                    tag: tags[tag]
                }
            }).catch(e => routeHandlerErrorHandler(path, e.message, "prisma.submittalTags.create()", "Coulnd't insert tags into the database"))

        }

        // Finally, send confirmation emails
        const clientEmailHtml = `Thank you for contributing to the 3D Herbarium!
            <br><br>
            You can view the model in your dashboard under "Pending Models" and it should be published in a business day or two.
            <br><br>
            Confirmation: ${confirmation}
            <br>
            Status: Pending`

        const adminEmailHtml = `User Email: ${email}
            <br><br>
            Confirmation: ${confirmation}`

        // Note that this is a nonFatal error catch
        await Promise.all([sendHTMLEmail(email, "3D Model Submitted", clientEmailHtml), sendHTMLEmail('ab632@humboldt.edu', "3D Model Submitted", adminEmailHtml)])
            .catch(e => console.error(routeHandlerError(path, e.message, "sendHTMLEmail()", 'POST', true)))

        // Typical success response
        return routeHandlerTypicalResponse('Model uploaded sucessfully', insert)
    }

    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}