/**
 * @file src/functions/server/utils/temp.ts
 * 
 * @fileoverview temporary server functions
 */

// SINGLETON
import prisma from "./prisma"

import { autoWriteArrayBuffer } from "../files"

/**
 * 
 * @param uid model uid 
 */
export const writeAnnotationPhotosToDataStorage = async(uid: string) => {
    
    const annotations = await prisma.annotations.findMany({ where: { uid: '709cd4b1e7c54157b0c1ebe25eb37f22' }, orderBy: { annotation_no: 'asc' } })

    for (let i in annotations) {

        if (annotations[i].annotation_type === 'photo' && !annotations[i].url.startsWith('/data') && !annotations[i].url.startsWith('../')) {

            console.log(`Updating annotation ${annotations[i].annotation_no}`)

            const storageUrl = `/data/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}/Annotation ${annotations[i].annotation_no}`
            const dir = `X:/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}`
            const photoPath = `X:/Herbarium/Annotations/${annotations[i].uid}/${annotations[i].annotation_id}/Annotation ${annotations[i].annotation_no}`

            // Fetch photo from the web
            console.log('Fetching photo...')
            const photo = await fetch(annotations[i].url).then(res => res.arrayBuffer())
            console.log('Photo obtained...')

            // Write photo to data storage
            console.log('Writing photo to data storage container...')
            await autoWriteArrayBuffer(photo, dir, photoPath)
            console.log('Photo written to data storage container...')

            // Anntoation update queries
            const baseAnnotationUpdate = prisma.annotations.update({ where: { annotation_id: annotations[i].annotation_id }, data: { url: storageUrl } })
            const photoAnnotationUpdate = prisma.photo_annotation.update({ where: { annotation_id: annotations[i].annotation_id }, data: { url: storageUrl } })

            // Await transaction
            console.log('Updating annotation URLs...')
            await prisma.$transaction([baseAnnotationUpdate, photoAnnotationUpdate])
            console.log('Annotations updated...')
        }
    }
}