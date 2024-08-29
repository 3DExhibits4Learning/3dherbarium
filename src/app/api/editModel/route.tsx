import { prismaClient } from "@/api/queries";

const prisma = prismaClient()

export async function POST(request: Request) {
    let update: any = ''

    // Get request JSON
    const body = await request.json()

    // Delete any existing software/tags associated with the updated metadata
    try {
        await prisma.submittalTags.deleteMany({
            where: {
                id: body.confirmation
            }
        })
    }
    catch (e) {
        return Response.json({ data: 'Tag Deletion Error' }, {status: 400, statusText: 'Tag Deletion Error'})
    }

    try {
        await prisma.submittalSoftware.deleteMany({
            where: {
                id: body.confirmation
            }
        })
    }
    catch (e) {
        return Response.json({ data: 'Software Deletion Error' }, {status: 400, statusText: 'Software Deletion Error'})
    }

    // This if statement only runs for updates
    if (body.type != 'delete') {

        // Convert 'isMobile' from string to boolean
        const isMobile = body.isMobile == 'Yes' ? true : false

        // Update all relevant data fields in the userSubmittal table
        try {
            update = await prisma.userSubmittal.update({
                where: {
                    confirmation: body.confirmation
                },
                data: {
                    artistName: body.artist as string,
                    speciesName: body.species as string,
                    createdWithMobile: isMobile,
                    methodology: body.methodology as string,
                    lat: body.position.lat,
                    lng: body.position.lng
                }
            })
        }
        catch (e) {
            return Response.json({ data: 'Prisma Update Error' }, {status: 400, statusText: 'Prisma Update Error'})
        }

        // Create new records for both tags and software
        try {
            for (let software in body.software) {
                await prisma.submittalSoftware.create({
                    data: {
                        id: body.confirmation,
                        software: body.software[software]
                    }
                })
            }

        }
        catch (e) {
            return Response.json({ data: 'Tag Insertion Error'}, {status: 400, statusText: 'Tag Insertion Error'})
        }

        try {
            for (let tag in body.tags) {
                await prisma.submittalTags.create({
                    data: {
                        id: body.confirmation,
                        tag: body.tags[tag].value
                    }
                })
            }
        }
        catch (e) {
            return Response.json({ data: 'Software Insertion Error' }, {status: 400, statusText: 'Software Insertion Error'})
        }

        return Response.json({ data: 'Update Successful', update: update })
    }
    else {

        // Or else Delete
        // First we delete the 3D Model from sketchfab

        // Typescript satisfied header
        const requestHeader: HeadersInit = new Headers()
        requestHeader.set('Authorization', process.env.SKETCHFAB_API_TOKEN as string)

        // Fetch delete
        const deleteModelResult = await fetch(`https://api.sketchfab.com/v3/orgs/0974c639b9364864bc9af2160fefbc1c/models/${body.modelUid}`, {
            headers: requestHeader,
            method: 'DELETE',

        })

        // Return error message if it exists
        if (!deleteModelResult.ok) {
            const deleteModelError = await deleteModelResult.text()
            return Response.json({ data: 'Unable to delete 3D model from server' }, {status: 400, statusText: deleteModelError})
        }

        // If deletion of the 3D Model is successful, delete the 3D model data from the database
        try {
            await prisma.userSubmittal.delete({
                where: {
                    confirmation: body.confirmation
                }
            })
        }
        catch (e) {
            return Response.json({ data: e }, {status: 400, statusText: 'Unable to delete 3D Model Data'})
        }

        // Successful return

        return Response.json({ data: 'Model Successfully Deleted'})
    }

}