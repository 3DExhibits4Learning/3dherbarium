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

            const storageUrl = `/data/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}/Annotation ${annotations[i].annotation_no}`
            const dir = `X:/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}`
            const photoPath = `X:/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}/Annotation ${annotations[i].annotation_no}`

            // Fetch photo from the web
            console.log('Fetching photo...')
            var contentType: any
            const photo = await fetch(annotations[i].url).then(res => {contentType = res.headers.get('Content-Type'); return res.arrayBuffer()})
            const extension = contentType ? contentType.split('/')[1] : ''
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
            const storageUrl = `/data/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}/Annotation ${annotations[i].annotation_no}`
            const dir = `X:/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}`
            const photoPath = `X:/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}/Annotation ${annotations[i].annotation_no}`
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

        else if(annotations[i].annotation_type === 'photo' && annotations[i].url.startsWith('/data')) console.log(`The photo for annotation ${annotations[i].annotation_no} is in data storage`)
    }
}