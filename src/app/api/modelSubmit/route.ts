import { uid } from 'uid'
import { prismaClient } from "@/api/queries";
import { ModelUploadBody } from '@/api/types';

const prisma = prismaClient()

export async function POST(request: Request) {

    try {
        // Get request body
        const body: ModelUploadBody = await request.json()

        // Variable initializtion
        const isMobile = body.isMobile == 'Yes' ? true : false
        var thumbUrl: string = ''
        const modelUid = body.uid as string
        const confirmation = uid()

        // Typescript satisfied header
        const requestHeader: HeadersInit = new Headers()
        requestHeader.set('Authorization', process.env.SKETCHFAB_API_TOKEN as string)

        // Get model thumbnail
        await fetch(`https://api.sketchfab.com/v3/models/${modelUid}`, {
            headers: requestHeader
        })
            .then(res => res.json())
            .then(data => thumbUrl = data.thumbnails.images[0].url)
            .catch((e) => {
                if (process.env.NODE_ENV === 'development') console.error(e.message)
                throw new Error("Couldn't get thumbnail")
            })

        // Insert model data into database
        const insert = await prisma.userSubmittal.create({
            data: {
                confirmation: confirmation,
                email: body.email as string,
                artistName: body.artist as string,
                speciesName: body.species as string,
                createdWithMobile: isMobile,
                methodology: body.methodology as string,
                modeluid: modelUid,
                status: 'Pending',
                thumbnail: thumbUrl,
                lat: body.position.lat,
                lng: body.position.lng
            }
        }).catch((e) => {
            if (process.env.NODE_ENV === 'development') console.error(e.message)
            throw new Error("Couldn't create database record")
        })

        // Insert model software into database
        for (let software in body.software) {
            await prisma.submittalSoftware.create({
                data: {
                    id: confirmation,
                    software: software
                }
            }).catch((e) => {
                if (process.env.NODE_ENV === 'development') console.error(e.message)
                throw new Error("Couldn't create software database record")
            })
        }

        // Insert model tags into database
        for (let tag in body.tags) {
            await prisma.submittalTags.create({
                data: {
                    id: confirmation,
                    tag: tag
                }
            }).catch((e) => {
                if (process.env.NODE_ENV === 'development') console.error(e.message)
                throw new Error("Couldn't create tag database record")
            })
    
        }
        
        return Response.json({ data: 'Model uploaded sucessfully', response: insert })
    }
    catch (e: any) { return Response.json({ data: 'error', response: e.message }, { status: 400, statusText: 'Error' }) }
}