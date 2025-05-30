'use server'

// Default imports
import prisma from "@/functions/server/utils/prisma"

// Typical imports
import { fullAnnotation } from "@/ts/types"
import { model_annotation, photo_annotation, video_annotation } from "@prisma/client"

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