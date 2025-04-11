/**
 * @file src/functions/server/modelUpload.ts
 * 
 * @fileoverview data migration server actions
 * 
 */

'use server'

import { serverActionErrorHandler } from "./error"
// Typical imports
import { annotationModelMigration, modelAnnotationMigration, selectByUid } from "./migrations/annotatedAndAnnotation"

export const migrateLateAdditionOfModelAnnotation = async () => {

    try {
        const migrationArray = [
            selectByUid('f430e42ff4c54b548eacbccd6ed712be')
        ]

        const test = await prisma?.$transaction(migrationArray).catch(e => serverActionErrorHandler(e.message, 'prisma.$transaction', 'Database transaction error'))
        console.log(test)
    }
    catch(e: any) {console.error(e.message)}
}