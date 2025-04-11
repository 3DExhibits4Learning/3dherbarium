'use server'

// Typical imports
import { model, model_annotation, specimen } from "@prisma/client"

// Default imports
import prisma from "./utils/prisma"

export const getAnnotationModel = async (uid: string) => await prisma.model_annotation.findUnique({ where: { uid: uid } })  