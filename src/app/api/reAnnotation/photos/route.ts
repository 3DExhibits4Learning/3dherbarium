/**
 * @file src/app/api/reAnnotation/photos/route.ts
 * 
 * @fileoverview temporary route handler for data storage of legacy annotation photos
 */

// SINGLETON
import prisma from "@/functions/server/utils/prisma"

// PATH
const path = 'src/app/api/reAnnotation/photos/route.ts'

/**
 * 
 * @param request HTTP request
 */
// export async function PATCH(request: Request){

//     // Get form data
//     const formData = await request.formData()

//     // Variable declarations
//     const photo = formData.get('photo') as File
//     const annotationId = formData.get('annotationId') as string
//     const url = formData.get('url') as string
//     const dir = formData.get('directory') as string
//     const path = formData.get('path') as string

//     const baseAnnotationUpdate = prisma.annotations.update({where:{annotation_id: annotationId}, data:{}})
// }