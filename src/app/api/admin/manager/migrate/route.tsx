/**
 * @file src/app/api/admin/manager/migrate/route.tsx
 * 
 * @fileoverview annotated model data migration route handler
 */

// Imports
import prisma from "@/utils/prisma"
import * as migrate from '@/functions/server/migration'
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"

// PATH
const path = 'src/app/api/admin/manager/migrate/route.tsx'

/**
 * 
 * @returns 
 */
export async function POST() {

    try {
        // Environment (thus database) determinations
        const local = process.env.LOCAL_ENV
        const db = local === 'development' ? 'Development' : 'Test'
        const target = local === 'development' ? 'Test' : 'Production'

        // Array of data migrations for transaction
        const modelMigrationArray = [
            migrate.speciesMigration(db, target),
            migrate.specimenMigration(db, target),
            migrate.annotatedModelMigration(db, target),
            migrate.imageSetMigration(db, target),
            migrate.annotationMigration(db, target),
            migrate.photoAnnotationMigration(db, target),
            migrate.videoAnnotationMigration(db, target),
            migrate.modelAnnotationMigration(db, target),
        ]

        // Transaction 
        await prisma.$transaction(modelMigrationArray).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction()', "Couldn't migrate annotated 3D models"))

        // Basic response
        return new Response(`Annotated 3D models from ${db} database have been migrated to ${target} database`)
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}