import { prismaClient } from "@/functions/server/queries";
import { ModelDeleteObject, ModelUpdateObject } from "@/ts/types";
import { NextRequest } from "next/server";
const prisma = prismaClient()

export async function PATCH(request: Request) {

    // Get request JSON
    const body: ModelUpdateObject = await request.json()

    // Delete any existing software/tags associated with the updated metadata
    try {

        await prisma.submittalTags.deleteMany({
            where: {
                id: body.confirmation
            }
        }).catch((e) => {
            console.error(e.message)
            throw Error("Counldn't delete tags")
        })

        await prisma.submittalSoftware.deleteMany({
            where: {
                id: body.confirmation
            }
        }).catch((e) => {
            console.error(e.message)
            throw Error("Counldn't delete software")
        })

        // Convert 'isMobile' from string to boolean
        const isMobile = body.isMobile == 'Yes' ? true : false

        // Update all relevant data fields in the userSubmittal table
        const update = await prisma.userSubmittal.update({
            where: { confirmation: body.confirmation },
            data: {
                artistName: body.artist as string,
                speciesName: body.species as string,
                createdWithMobile: isMobile,
                methodology: body.methodology as string,
                lat: body.position.lat,
                lng: body.position.lng
            }
        }).catch((e) => {
            console.error(e.message)
            throw Error("Counldn't update model record")
        })

        // Create new records for software
        for (let software in body.software) {
            await prisma.submittalSoftware.create({
                data: {
                    id: body.confirmation,
                    software: body.software[software]
                }
            }).catch((e) => {
                console.error(e.message)
                throw Error("Counldn't insert tags")
            })
        }

        // Create new records for tags
        for (let tag in body.tags) {
            await prisma.submittalTags.create({
                data: {
                    id: body.confirmation,
                    tag: body.tags[tag]
                }
            }).catch((e) => {
                console.error(e.message)
                throw Error("Counldn't insert software")
            })
        }
        // Typical success response
        return Response.json({ data: 'Update Successful', update: update })
    }

    // Typical fail response
    catch (e: any) { return Response.json({ data: e.message }, { status: 400, statusText: e.message }) }
}



export async function DELETE(request: NextRequest) {

    try {

        // Get request JSON
        const body: ModelDeleteObject = await request.json()

        // Typescript satisfied header
        const requestHeader: HeadersInit = new Headers()
        requestHeader.set('Authorization', process.env.SKETCHFAB_API_TOKEN as string)

        // First we delete the 3D Model from sketchfab
        const deleteModelResult = await fetch(`https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models/${body.modelUid}`, {
            headers: requestHeader,
            method: 'DELETE',
        }).catch((e) => {
            console.error('SketchFab: ', e.message)
            throw Error("Counldn't delete 3D model")
        })

        // Throw error and log to the console on bad request
        if (!deleteModelResult.ok) {
            const deleteModelError = await deleteModelResult.text()
            console.error("Bad Request, text() = ", deleteModelError)
            throw Error("Couldn't delete 3D model")
        }

        // If deletion of the 3D Model is successful, delete the 3D model data from the database
        await prisma.userSubmittal.delete({
            where: {
                confirmation: body.confirmation
            }
        }).catch((e) => {
            console.error(e.message)
            throw Error("Counldn't delete 3D model data")
        })

        // Typical success response
        return Response.json({ data: "Model deleted", response: "Model deleted" })
    }

    // Typical fail response
    catch (e: any) { return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message }) }
}