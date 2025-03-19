/**
 * @file src/functions/server/utils/temp.ts
 * 
 * @fileoverview temporary server functions
 */

// SINGLETON
import prisma from "./prisma"

// Typical imports
import { autoWriteBuffer, autoWriteArrayBuffer, getFileExtensionOfBuffer } from "../files"
import { readFile } from "fs/promises"

/**
 * 
 * @param uid model uid 
 */
export const writeAnnotationPhotosToDataStorage = async (uid: string) => {

    const annotations = await prisma.annotations.findMany({ where: { uid: uid }, orderBy: { annotation_no: 'asc' } })

    for (let i in annotations) {

        if (annotations[i].annotation_type === 'photo' && !annotations[i].url.startsWith('/data') && !annotations[i].url.startsWith('../')) {

            console.log(`Updating annotation ${annotations[i].annotation_no}, it's a web annotation`)

            const storageUrl = `/data/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}`
            const dir = `X:/Herbarium/Annotations/${annotations[i].uid}`
            const photoPath = `X:/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}`

            // Fetch photo from the web
            console.log('Fetching photo...')
            var contentType: any
            const photo = await fetch(annotations[i].url).then(res => { contentType = res.headers.get('Content-Type'); return res.arrayBuffer() })
            const extension = contentType ? '.' + contentType.split('/')[1] : ''
            console.log('Photo obtained...')

            // Write photo to data storage
            console.log('Writing photo to data storage container...')
            await autoWriteArrayBuffer(photo, dir, photoPath + extension)
            console.log('Photo written to data storage container...')

            // Anntoation update queries
            const baseAnnotationUpdate = prisma.annotations.update({ where: { annotation_id: annotations[i].annotation_id }, data: { url: storageUrl + extension } })
            const photoAnnotationUpdate = prisma.photo_annotation.update({ where: { annotation_id: annotations[i].annotation_id }, data: { url: storageUrl + extension } })

            // Await transaction
            console.log('Updating annotation URLs...')
            await prisma.$transaction([baseAnnotationUpdate, photoAnnotationUpdate])
            console.log('Annotations updated...')
            console.log(`Annotation ${annotations[i].annotation_id} successfully migrated to data storage`)
        }

        else if (annotations[i].annotation_type === 'photo' && annotations[i].url.startsWith('../../../')) {

            console.log(`Updating annotation ${annotations[i].annotation_no}, it's an annotation in the public folder`)
            const storageUrl = `/data/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}`
            const dir = `X:/Herbarium/Annotations/${annotations[i].uid}`
            const photoPath = `X:/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}`
            const photo = await readFile(annotations[i].url.replace('../../..', 'public'))
            const extension = getFileExtensionOfBuffer(photo)

            // Write photo to data storage
            console.log('Writing photo to data storage container...')
            await autoWriteBuffer(photo, dir, photoPath + extension)
            console.log('Photo written to data storage container...')

            // Anntoation update queries
            const baseAnnotationUpdate = prisma.annotations.update({ where: { annotation_id: annotations[i].annotation_id }, data: { url: storageUrl + extension } })
            const photoAnnotationUpdate = prisma.photo_annotation.update({ where: { annotation_id: annotations[i].annotation_id }, data: { url: storageUrl + extension } })

            // Await transaction
            console.log('Updating annotation URLs...')
            await prisma.$transaction([baseAnnotationUpdate, photoAnnotationUpdate])
            console.log('Annotations updated...')
            console.log(`Annotation ${annotations[i].annotation_id} successfully migrated to data storage`)
        }

        else if (annotations[i].annotation_type === 'photo' && annotations[i].url.startsWith('/data')) console.log(`The photo for annotation ${annotations[i].annotation_no} is in data storage`)
    }
}

/**
 * 
 */
export const cacheThumbnails = async () => {
    const dir = 'X:/Herbarium/thumbnails'
    const cloudDir = '/data/Herbarium/thumbnails'
    const models = await prisma.model.findMany({ where: { site_ready: true } }).then(models => models.filter(model => !model.thumbnail.includes('/data/Herbarium') && model.thumbnail))

    for (let i in models) {
        const thumbnail = await fetch(models[i].thumbnail).then(res => {
            if (res.ok) return res.arrayBuffer()
            return null
        })

        if (thumbnail) autoWriteArrayBuffer(thumbnail, dir, `${dir}/${models[i].uid}.jpeg`)
        await prisma.model.update({ where: { uid: models[i].uid }, data: { thumbnail: `${cloudDir}/${models[i].uid}.jpeg` } })

        console.log(`Thumbnail for ${models[i].spec_name} saved to storage`)
    }
}