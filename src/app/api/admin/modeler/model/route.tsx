import { prismaClient } from "@/api/queries"
import { modelInsertion } from "@/api/types"
const prisma = prismaClient()

export async function POST(request: Request) {

    // Variable initialization
    const data = await request.json()
    const model = data as modelInsertion

    var thumbUrl, insert, update, createAnnotateTask

    // Verify there is an image_set for the 3D_model
    try {

        // Ensure that image_set data has been entered first
        await prisma.image_set.findUnique({
            where: {
                spec_name_spec_acquis_date_set_no: {
                    spec_name: model.species,
                    spec_acquis_date: new Date(model.acquisitionDate),
                    set_no: 1
                }
            },
        }).catch(() => { throw new Error("Couldn't find Image Set") })

        // Get the model thumbnail
        thumbUrl = await fetch(`https://api.sketchfab.com/v3/models/${model.uid}`)
            .then(res => res.json())
            .then(data => data.thumbnails?.images[0]?.url ?? '')
            .catch((e: any) => { 
                if(process.env.NODE_ENV === 'development') console.log(e.message)
                throw new Error("Couldn't get Thumbnail") 
            })

        // Create model database entry
        insert = await prisma.model.create({
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
        }).catch(() => { throw new Error("Couldn't enter model into Database") })

        // Update corresponding image_set UID
        update = await prisma.image_set.update({
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
        }).catch(() => { throw new Error("Couldn't update Image Set UID") })

        // Create Jira task if the model has been marked as viable by the 3D modeler
        if (parseInt(data.isViable)) {

            const data = {
                fields: {
                    project: {
                        key: 'HERB',
                    },
                    parent: {
                        key: 'HERB-47'
                    },
                    summary: 'Annotation Test Issue',
                    description: {
                        type: 'doc',
                        version: 1,
                        content: [
                            {
                                type: 'paragraph',
                                content: [
                                    {
                                        type: 'text',
                                        text: 'This is a test issue created from a test model submission.',
                                    },
                                ],
                            },
                        ],
                    },
                    issuetype: {
                        name: 'Task',
                    },
                    assignee: {
                        id: process.env.AJ_JIRA_ID
                    }
                },
            }

            const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

            createAnnotateTask = await fetch('https://3dteam.atlassian.net/rest/api/3/issue', {
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
                .then(res => res.json())
                .then(json => json)
                .catch(() => { throw new Error("Unable to create Annotation Task") })
        }

        return Response.json({ data: 'Model Data Entered Successfully', response: { insert: insert, update: update, task: createAnnotateTask } })
    }
    catch (e: any) { return Response.json({ data: e.message, response: 'Model Entry Error' }, { status: 400, statusText: 'Model Entry Error' }) }
}