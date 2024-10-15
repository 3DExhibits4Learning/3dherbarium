import { prismaClient } from "@/api/queries";
import { ModelUploadResponse } from '@/api/types';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { mkdir, writeFile } from "fs/promises";

const prisma = prismaClient()

export async function POST(request: Request) {

    // Typical auth redirect
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        redirect('/api/auth/signin')
    }

    try {

        // Get request body
        const body = await request.formData()

        // Variable initialization
        var thumbUrl = ''
        const confirmation = body.get('confirmation') as string
        const isMobile = body.get('isMobile') == 'Yes' ? true : false
        const email = session.user.email
        const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${process.env.SKETCHFAB_ORGANIZATION}/models`
        const position = JSON.parse(body.get('position') as string)
        const softwareArr = JSON.parse(body.get('software') as string)
        const tags = JSON.parse(body.get('tags') as string)

        // Write photos to tmp storage
        const path = `public/data/Herbarium/tmp/submittal/${confirmation}`
        const writePhotos = []

        // Function to write ID photos to tmp storage
        const writePhoto = async (file: File) => {

            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const filePath = path + `/${file.name}`
            //@ts-ignore - Typescript thinks writeFile can't write with a buffer
            writeFile(filePath, buffer).catch((e) => {
                console.error(e.message)
                throw new Error("Couldn't write file")
            })
        }

        for (let i = 0; i < parseInt(body.get('numberOfPhotos') as string); i++) {

            if (i === 0) await mkdir(path)
            writePhotos.push(writePhoto(body.get(`photo${i}`) as File))
        }

        await Promise.all(writePhotos)

        // Typescript satisfied header
        const requestHeader: HeadersInit = new Headers()
        requestHeader.set('Authorization', process.env.SKETCHFAB_API_TOKEN as string)

        // Set from data
        const data = new FormData()
        data.set('orgProject', process.env.SKETCHFAB_PROJECT_TEST as string)
        data.set('modelFile', body.get('file') as File)
        data.set('visibility', 'private')
        data.set('options', JSON.stringify({ background: { color: "#000000" } }))

        // Upload 3D Model, setting uploadProgress in the process
        const sketchfabUpload: ModelUploadResponse = await fetch(orgModelUploadEnd, {
            headers: {
                'Authorization': process.env.SKETCHFAB_API_TOKEN as string
            },
            method: 'POST',
            body: data
        }).then(res => res.json()).then(json => json)
            .catch((e) => {
                console.error(e.message)
                throw new Error("Couldn't upload 3D model")
            })

        // Grab the uid, then enter model data into database
        const modelUid = sketchfabUpload.uid

        // Get model thumbnail
        await fetch(`https://api.sketchfab.com/v3/models/${modelUid}`, {
            headers: requestHeader
        })
            .then(res => res.json())
            .then(data => thumbUrl = data.thumbnails.images[0].url)
            .catch((e) => {
                console.error(e.message)
                throw new Error("Couldn't get thumbnail")
            })

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
                lng: position.lng
            }
        }).catch((e) => {
            console.error(e.message)
            throw new Error("Couldn't create database record")
        })

        // Insert model software into database
        for (let software in softwareArr) {
            await prisma.submittalSoftware.create({
                data: {
                    id: confirmation,
                    software: software
                }
            }).catch((e) => {
                console.error(e.message)
                throw new Error("Couldn't create software database record")
            })
        }

        // Insert model tags into database
        for (let tag in tags) {
            await prisma.submittalTags.create({
                data: {
                    id: confirmation,
                    tag: tag
                }
            }).catch((e) => {
                console.error(e.message)
                throw new Error("Couldn't create tag database record")
            })

        }

        return Response.json({ data: 'Model uploaded sucessfully', response: insert })
    }
    catch (e: any) { return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message }) }
}