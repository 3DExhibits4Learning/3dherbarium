/**
 * @file src/functions/server/migrations/annotatedAndAnnotation.ts
 * 
 * @fileoverview migration functions for site ready annotated and annotation models
 */

// SINGLETON
import prisma from "@/functions/server/utils/prisma"

// Species migration (species table to be deprecated eventually)
export const speciesMigration = (d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.species(
    select d.*
    from ${d1}.species as d
    left join ${d2}.species as t
    on d.spec_name = t.spec_name
    where t.spec_name is null);`)

// Migrate specimen
export const specimenMigration = (d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.specimen(
    select d.*
    from ${d1}.specimen as d
    left join ${d2}.specimen as t
    on d.spec_acquis_date = t.spec_acquis_date and d.spec_name = t.spec_name
    where t.spec_name is null);`)

// Migrate 3D models marked as annotated that are in the local db, but not the target db
export const annotatedModelMigration = (d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.model(
    select d.* 
    from ${d1}.model as d
    left join ${d2}.model as t
    on d.uid = t.uid
    where t.uid is null and d.annotated is true);`)

// Migrate annotation 3D models
export const annotationModelMigration = (d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.model(
    select d.* 
    from ${d1}.model as d
    left join ${d2}.model as t
    on d.uid = t.uid
    where t.uid is null and d.base_model is false and d.annotation_number is not null);`)

// Migrate image sets of those models
export const imageSetMigration = (d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.image_set(
    select d.* 
    from ${d1}.image_set as d
    left join ${d2}.image_set as t
    on d.spec_name = t.spec_name and d.spec_acquis_date = t.spec_acquis_date and d.set_no = t.set_no
    where t.spec_name is null and d.uid is not null and d.uid in (select uid from ${d2}.model));`)

// Migrate software of those models
export const softwareMigration = (d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.software(
    select d.*
    from ${d1}.software as d
    left join ${d2}.software as t
    on d.software = t.software and d.uid = t.uid
    where t.software is null and d.uid in (select uid from ${d2}.model));`)

// Migrate base annotations of those models
export const annotationMigration = (d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.annotations(
    select d.* from ${d1}.annotations as d
    left join ${d2}.annotations as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.uid in (select uid from ${d2}.model));`)

// Migrate photo annotations of those models
export const photoAnnotationMigration = (d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.photo_annotation(
    select d.* 
    from ${d1}.photo_annotation as d
    left join ${d2}.photo_annotation as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.annotation_id in (select annotation_id from ${d2}.annotations));`)

// Migrate video annotations of those models
export const videoAnnotationMigration = (d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.video_annotation(
    select d.* 
    from ${d1}.video_annotation as d
    left join ${d2}.video_annotation as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.annotation_id in (select annotation_id from ${d2}.annotations));`)

// Migrate model annotations of those models
export const modelAnnotationMigration = (d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.model_annotation(
    select d.* 
    from ${d1}.model_annotation as d
    left join ${d2}.model_annotation as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.annotation_id in (select annotation_id from ${d2}.annotations));`)

export const getAnnotatedAndAnnotationModelsMigrationArray = (d1: string, d2: string) => [
    speciesMigration(d1, d2),
    specimenMigration(d1, d2),
    annotatedModelMigration(d1, d2),
    annotationModelMigration(d1, d2),
    imageSetMigration(d1, d2),
    softwareMigration(d1, d2),
    annotationMigration(d1, d2),
    photoAnnotationMigration(d1, d2),
    videoAnnotationMigration(d1, d2),
    modelAnnotationMigration(d1, d2)
]

