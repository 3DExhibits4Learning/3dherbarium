// TODO: Split if-else statement to mulitple route handlers
// TODO: Condense sequential awaits to Promise.all()

import { prismaClient } from "@/functions/server/queries"
import { imageInsertion, modelInsertion, specimenInsertion } from "@/ts/types"
const prisma = prismaClient()

export async function POST(request: Request) {
    const data = await request.json()

    // Specimen insertion into DB
    // Only indexed species can have a specimen inserted, hence the speciesCheck

    if (data.requestType == 'specimenEntry') {
        const specimen = data as specimenInsertion
        try {
            const speciesCheck = await prisma.species.findUnique({
                where: {
                    spec_name: specimen.species.toLowerCase()
                }
            })

            if (!speciesCheck) {
                await prisma.species.create({
                    data: {
                        spec_name: specimen.species.toLowerCase(),
                        genus: specimen.genus.toLowerCase(),
                        is_local: specimen.isLocal
                    }
                })
            }

            const insert = await prisma.specimen.create({
                data: {
                    spec_name: specimen.species.toLowerCase(),
                    spec_acquis_date: new Date(specimen.acquisitionDate),
                    procurer: specimen.procurer
                }
            })
            return Response.json({ data: 'Specimen Entered Successfully', response: insert })
        }
        catch (e: any) { return Response.json({ data: e.message, response: 'Prisma Error' }, { status: 400, statusText: 'Prisma Error' }) }
    }

    // Image Set insertion into DB

    else if (data.requestType == 'imageEntry') {
        const images = data as imageInsertion
        try {
            const insert = await prisma.image_set.create({
                data: {
                    spec_name: images.species.toLowerCase(),
                    spec_acquis_date: new Date(images.acquisitionDate),
                    set_no: 1,
                    imaged_by: images.imagedBy,
                    imaged_date: new Date(images.imagedDate),
                    no_of_images: parseInt(images.numberOfImages)
                }
            })
            return Response.json({ data: 'Image Data Entered Successfully', response: insert })
        }
        catch (e: any) { return Response.json({ data: e.message, response: 'Prisma Error' }, { status: 400, statusText: 'Prisma Error' }) }
    }

    // 3D model data insertion into DB

    else if (data.requestType == 'modelEntry') {
        const model = data as modelInsertion

        // Ensure that image_set data has been entered first; exception will be thrown if no result is found
        try {
            await prisma.image_set.findUnique({
                where: {
                    spec_name_spec_acquis_date_set_no: {
                        spec_name: model.species,
                        spec_acquis_date: new Date(model.acquisitionDate),
                        set_no: 1
                    }
                },
            })
        }
        catch (e: any) { return Response.json({ data: e.message, response: 'Image Set Not Found' }, { status: 400, statusText: 'Image Set Not Found' }) }

        try {

            const thumbUrl = await fetch(`https://api.sketchfab.com/v3/models/${model.uid}`)
                .then(res => res.json())
                .then(data => data.thumbnails?.images[0]?.url ?? '')

            const insert = await prisma.model.create({
                data: {
                    spec_name: model.species.toLowerCase(),
                    spec_acquis_date: new Date(model.acquisitionDate),
                    pref_comm_name: model.commonName.toLowerCase(),
                    uid: model.uid,
                    modeled_by: data.modeler,
                    site_ready: !!parseInt(data.isViable),
                    base_model: !!parseInt(data.isBase),
                    thumbnail: thumbUrl
                }
            })

            const update = await prisma.image_set.update({
                where: {
                    spec_name_spec_acquis_date_set_no: {
                        spec_name: model.species.toLowerCase(),
                        spec_acquis_date: new Date(model.acquisitionDate),
                        set_no: 1
                    }
                },
                data: {
                    uid: model.uid
                }
            })

            const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')
    
            const createAnnotateTask = await fetch('https://3dteam.atlassian.net/rest/api/3/issue', {
                method: 'POST',
                //@ts-ignore -- without the first two headers, data is not returned in English
                headers: {
                    'X-Force-Accept-Language': true,
                    'Accept-Language': 'en',
                    'Authorization': `Basic ${base64}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json()).then(json => json)

            return Response.json({ data: 'Model Data Entered Successfully', response: insert, update, })
        }
        catch (e: any) { return Response.json({ data: e.message, response: 'Prisma Error' }, { status: 400, statusText: 'Prisma Error' }) }
    }
    // Return with bad requestType error if this else statement is reached 
    else { return Response.json({ data: 'Invalid requestType', response: 'Invalid requestType' }, { status: 400, statusText: 'requestType Error' }) }
}