import prisma from "@/utils/prisma"
import * as migrate from '@/functions/server/migration'

export async function POST(request: Request) {

    // Environment (thus database) determination
    const local = process.env.LOCAL
    const db = local === 'Development' ? 'Development' : 'Test'
    const target = local === 'Development' ? 'Test' : 'Production'

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

    const migrationArray = [
        prisma.$queryRaw`insert into ${target}.species(
            select d.*
            from ${db}.species as d
            left join ${target}.species as t
            on d.spec_name = t.spec_name
            where t.spec_name is null)`,
        prisma.$queryRaw`insert into ${target}.model(
                select d.* 
                from ${db}.model as d
                left join ${target}.model as t
                on d.uid = t.uid
                where t.uid is null and d.annotated is true)`
    ]

    //await prisma.$transaction([migrationArray])
}