'use server'

// Default imports
import prisma from "@/functions/server/utils/prisma"

// Typical imports
import { fullAnnotation } from "@/ts/types"
import { model_annotation, photo_annotation, video_annotation } from "@prisma/client"
import { v4 as uuidv4 } from 'uuid'

/**
 * 
 * @param uid 
 * @returns 
 */
export const getFullAnnotations = async(uid: string) => {
    const annotations = await prisma.annotations.findMany({where: {uid: uid}}) as fullAnnotation[]

    for(let i in annotations){
        switch(annotations[i].annotation_type){
            case 'model': annotations[i].annotation = await prisma.model_annotation.findUnique({where: {annotation_id: annotations[i].annotation_id}}) as model_annotation
            case 'video': annotations[i].annotation = await prisma.video_annotation.findUnique({where: {annotation_id: annotations[i].annotation_id}}) as video_annotation
            case 'photo': annotations[i].annotation = await prisma.photo_annotation.findUnique({where: {annotation_id: annotations[i].annotation_id}}) as photo_annotation
        }
    }

    return annotations
}

/**
 * 
 * @param annotationModelUid 
 * @param baseModelUid 
 * @param title 
 * @param position 
 * @param annotation 
 * @param number 
 */
export const enterNewModelAnnotationIntoDb = async(annotationModelUid: string, baseModelUid: string, title: string, position: string, annotation: string) => {
    // Create annotation id and annotation number
    const annotationId = uuidv4()
    const number = await prisma.annotations.count({where: {uid: baseModelUid}}) + 2

    // Base annotation method
    const createBaseAnnotation = prisma.annotations.create({
        data:{
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
        data:{
            modeler: 'Hunter Phillips',
            license: "CC-BY-NC-SA",
            annotator: 'Kat Lim',
            annotation: annotation,
            annotation_id: annotationId,
            uid: annotationModelUid
        }
    })

    // Await annotation transaction
    await prisma.$transaction([createBaseAnnotation, createModelAnnotation])
}