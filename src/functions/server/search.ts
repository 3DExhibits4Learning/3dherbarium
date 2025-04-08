'use server'

// Typical imports
import { model, model_annotation, specimen } from "@prisma/client"

// Default imports
import prisma from "./utils/prisma"

export const getAnnotationModelData = async (model: model): Promise<{annotation: model_annotation, specimen: specimen}> => {
    // Get base annotation from annotation id
    const modelAnnotation = await prisma.model_annotation.findUnique({ where: { uid: model.uid } }) as model_annotation

    // Get specimen from sid
    const specimen = await prisma.model.findUnique({ where: { uid: model.uid } }).then(model => model?.sid).then(sid => prisma.specimen.findUnique({ where: { sid: sid } })) as specimen

    // Return object
    return {annotation: modelAnnotation, specimen: specimen}
}   