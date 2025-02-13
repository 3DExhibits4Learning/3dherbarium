/**
 * @file src/app/api/admin/manager/migrate/route.tsx
 * 
 * @fileoverview annotated model data migration route handler
 */

// SINGLETON
import prisma from "@/functions/server/utils/prisma"

// Migration file import
import * as migrate from '@/functions/server/migration'

// Typical imports
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"

// PATH
const path = 'src/app/api/admin/manager/migrate/route.tsx'

/**
 * 
 * @returns string message of result of operation
 */
export async function POST() {

    try {
        
        // Environment (thus database) determinations
        const local = process.env.LOCAL_ENV
        const db = local === 'development' ? 'Development' : 'Test'
        const target = local === 'development' ? 'Test' : 'Production'

        // Array of data migrations for transaction (d => t)
        const modelMigrationArray = [
            migrate.speciesMigration,
            migrate.specimenMigration,
            migrate.annotatedModelMigration,
            migrate.annotationModelMigration,
            migrate.imageSetMigration,
            migrate.annotationMigration,
            migrate.photoAnnotationMigration,
            migrate.videoAnnotationMigration,
            migrate.modelAnnotationMigration,
        ]

        // Array of data migrations for transaction (t => p)
        const productionModelMigrationArray = [
            migrate.productionSpeciesMigration,
            migrate.productionSpecimenMigration,
            migrate.productionModelMigration,
            migrate.ProductionAnnotationModelMigration,
            migrate.productionImageSetMigration,
            migrate.productionAnnotationMigration,
            migrate.productionPhotoAnnotationMigration,
            migrate.productionVideoAnnotationMigration,
            migrate.productionModelAnnotationMigration,
        ]

        // Transaction 
        await prisma.$transaction(db === "Development" ? modelMigrationArray : productionModelMigrationArray).catch(e => routeHandlerErrorHandler(path, e.message, 'prisma.$transaction()', "Couldn't migrate annotated 3D models"))

        // Basic response
        return new Response(`Annotated 3D models from ${db} database have been migrated to ${target} database`)
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}