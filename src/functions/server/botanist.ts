'use server'

// Typical imports
import { fullAnnotation } from "@/ts/types"
import { model_annotation, photo_annotation, video_annotation } from "@prisma/client"
import { v4 as uuidv4 } from 'uuid'
import { AnnotationNumbers } from "@/components/Admin/Botanist/AnnotationSubcomponents/AnnotationNumber"

// Default imports
import prisma from "@/functions/server/utils/prisma"

/**
 * 
 * @param uid 
 * @returns 
 */
export const getFullAnnotations = async (uid: string) => {
    try {
        // Get base annotations, initialize media annotation array
        const fullAnnotations = await prisma.annotations.findMany({ where: { uid: uid } }) as fullAnnotation[]
        const mediaAnnotations = []

        // Iterate annotations, pushing prisma query onto array each iteration
        for (let i in fullAnnotations) {
            switch (fullAnnotations[i].annotation_type) {
                case 'model': mediaAnnotations.push(prisma.model_annotation.findUnique({ where: { annotation_id: fullAnnotations[i].annotation_id } }))
                case 'video': mediaAnnotations.push(prisma.video_annotation.findUnique({ where: { annotation_id: fullAnnotations[i].annotation_id } }))
                case 'photo': mediaAnnotations.push(prisma.photo_annotation.findUnique({ where: { annotation_id: fullAnnotations[i].annotation_id } }))
            }
        }

        // Await media annotations, add results to base annotations
        await Promise.all(mediaAnnotations)
        for (let i in fullAnnotations) fullAnnotations[i].annotation = mediaAnnotations[i] as unknown as photo_annotation | video_annotation | model_annotation


        // Return full annotations for uid
        return fullAnnotations
    }
    // Error return
    catch (e: any) { return `Error: ${e.message}` }
}

/**
 * 
 * @param annotationModelUid 
 * @param baseModelUid 
 * @param title 
 * @param position 
 * @param annotation 
 * @returns 
 */
export const enterNewModelAnnotationIntoDb = async (annotationModelUid: string, baseModelUid: string, title: string, position: string, annotation: string) => {
    try {
        // Create annotation id and annotation number
        const annotationId = uuidv4()
        const number = await prisma.annotations.count({ where: { uid: baseModelUid } }) + 2

        // Base annotation method
        const createBaseAnnotation = prisma.annotations.create({
            data: {
                annotation_id: annotationId,
                annotation_no: number,
                url: '',
                uid: baseModelUid,
                annotation_type: 'model',
                title: title,
                position: position
            }
        })

        // Model annotation method
        const createModelAnnotation = prisma.model_annotation.create({
            data: {
                modeler: 'Hunter Phillips',
                license: "CC-BY-NC-SA",
                annotator: 'Jazzlyn Strebel',
                annotation: annotation,
                annotation_id: annotationId,
                uid: annotationModelUid
            }
        })

        // Annotation model number update method
        const updateAnnotationModelNumber = prisma.model.update({
            where: { uid: annotationModelUid },
            data: { annotation_number: number }
        })

        // Await transaction of methods
        await prisma.$transaction([createBaseAnnotation, createModelAnnotation, updateAnnotationModelNumber])

        // Return success string
        return 'Model annotation added'
    }
    // Return error message on error
    catch (e: any) { return `Error: ${e.message}` }
}

/**
 * 
 * @param annotationNumbers 
 * @returns 
 */
export const renumberAnnotationsServer = async (annotationNumbers: AnnotationNumbers[]) => {
    try {
        // Temporary annotation number starting index
        var tempAnnotationNumber = 100

        // Temporary annotation number and new annotation number tx arrays
        const temporaryAnnotationNumberTransactionArr = []
        const newAnnotationNumberTransactionArr = []

        // Iterate, pushing respective update queries to each array
        for (let i in annotationNumbers) {
            temporaryAnnotationNumberTransactionArr.push(prisma.annotations.update({
                where: { annotation_id: annotationNumbers[i].id },
                data: { annotation_no: tempAnnotationNumber }
            }))

            newAnnotationNumberTransactionArr.push(prisma.annotations.update({
                where: { annotation_id: annotationNumbers[i].id },
                data: { annotation_no: parseInt(annotationNumbers[i].no) }
            }))

            // Increment tempAnnotationNumber each iteration
            tempAnnotationNumber++
        }

        // Await update tx
        const transactionArr = [...temporaryAnnotationNumberTransactionArr, ...newAnnotationNumberTransactionArr]
        await prisma.$transaction(transactionArr)

        // Success return
        return 'Annotation numbers updated'
    }
    // Error return
    catch (e: any) { return `Error: ${e.message}` }
}
