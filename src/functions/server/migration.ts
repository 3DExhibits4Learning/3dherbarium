/**
 * @file src/functions/server/manager.ts
 * 
 * @fileoverview these are the migration functions that are sequentially executed in a transaction to migrate annotated models to the next stage of development
 * Because these are raw queries, the schemas don't appear to be able to be referenced by variable (hence seperate functions for d => t and t => p, respectively)
 */

// SINGLETON
import prisma from "@/functions/server/utils/prisma"

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateAnnotationNumbers = (uid: string) => prisma.$queryRaw`update Test.annotations as t
    join Development.annotations as d
    on d.annotation_id = t.annotation_id
    set t.annotation_no = d.annotation_no
    where t.uid = ${uid};`

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateBaseAnnotation = (annotationId: string) => prisma.$queryRaw`insert into Test.annotations(select * from Development.annotations where uid = ${annotationId};`

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateModelAnnotation = (annotationId: string) => prisma.$queryRaw`insert into Test.model_annotation(select * from Development.model_annotation where uid = ${annotationId};`

// Species migration (species table to be deprecated eventually)
export const speciesMigration = prisma.$queryRaw`insert into Test.species(
    select d.*
    from Development.species as d
    left join Test.species as t
    on d.spec_name = t.spec_name
    where t.spec_name is null);`

// Migrate specimen
export const specimenMigration = prisma.$queryRaw`insert into Test.specimen(
    select d.*
    from Development.specimen as d
    left join Test.specimen as t
    on d.spec_acquis_date = t.spec_acquis_date and d.spec_name = t.spec_name
    where t.spec_name is null);`

// Migrate 3D models marked as annotated that are in the local db, but not the target db
export const annotatedModelMigration = prisma.$queryRaw`insert into Test.model(
    select d.* 
    from Development.model as d
    left join Test.model as t
    on d.uid = t.uid
    where t.uid is null and d.annotated is true);`

// Migrate annotation 3D models
export const annotationModelMigration = prisma.$queryRaw`insert into Test.model(
    select d.* 
    from Development.model as d
    left join Test.model as t
    on d.uid = t.uid
    where t.uid is null and d.base_model is false);`

// Migrate image sets of those models
export const imageSetMigration = prisma.$queryRaw`insert into Test.image_set(
    select d.* 
    from Development.image_set as d
    left join Test.image_set as t
    on d.spec_name = t.spec_name and d.spec_acquis_date = t.spec_acquis_date and d.set_no = t.set_no
    where t.spec_name is null and d.uid is not null and d.uid in (select uid from Test.model));`

// Migrate software of those models
export const softwareMigration = prisma.$queryRaw`insert into Test.software(
    select d.*
    from Development.software as d
    left join Test.software as t
    on d.software = t.software and d.uid = t.uid
    where t.software is null and d.uid in (select uid from Test.model));`

// Migrate base annotations of those models
export const annotationMigration = prisma.$queryRaw`insert into Test.annotations(
    select d.* from Development.annotations as d
    left join Test.annotations as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.uid in (select uid from Test.model));`

// Migrate photo annotations of those models
export const photoAnnotationMigration = prisma.$queryRaw`insert into Test.photo_annotation(
    select d.* 
    from Development.photo_annotation as d
    left join Test.photo_annotation as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.annotation_id in (select annotation_id from Test.annotations));`

// Migrate video annotations of those models
export const videoAnnotationMigration = prisma.$queryRaw`insert into Test.video_annotation(
    select d.* 
    from Development.video_annotation as d
    left join Test.video_annotation as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.annotation_id in (select annotation_id from Test.annotations));`

// Migrate model annotations of those models
export const modelAnnotationMigration = prisma.$queryRaw`insert into Test.model_annotation(
    select d.* 
    from Development.model_annotation as d
    left join Test.model_annotation as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.annotation_id in (select annotation_id from Test.annotations));`

// Species migration (species table to be deprecated eventually)
export const productionSpeciesMigration = prisma.$queryRaw`insert into Production.species(
    select d.*
    from Test.species as d
    left join Production.species as t
    on d.spec_name = t.spec_name
    where t.spec_name is null);`

// Migrate specimen
export const productionSpecimenMigration = prisma.$queryRaw`insert into Production.specimen(
    select d.*
    from Test.specimen as d
    left join Production.specimen as t
    on d.spec_acquis_date = t.spec_acquis_date and d.spec_name = t.spec_name
    where t.spec_name is null);`

// Migrate 3D models marked as annotated that are in the local db, but not the target db
export const productionModelMigration = prisma.$queryRaw`insert into Production.model(
    select d.* 
    from Test.model as d
    left join Production.model as t
    on d.uid = t.uid
    where t.uid is null and d.annotated is true);`

// Migrate annotation 3D models
export const ProductionAnnotationModelMigration = prisma.$queryRaw`insert into Production.model(
    select d.* 
    from Test.model as d
    left join Production.model as t
    on d.uid = t.uid
    where t.uid is null and d.base_model is false);`

// Migrate image set of those models
export const productionImageSetMigration = prisma.$queryRaw`insert into Production.image_set(
    select d.* 
    from Test.image_set as d
    left join Production.image_set as t
    on d.spec_name = t.spec_name and d.spec_acquis_date = t.spec_acquis_date and d.set_no = t.set_no
    where t.spec_name is null and d.uid is not null and d.uid in (select uid from Production.model));`

// Migrate software of those models
export const productionSoftwareMigration = prisma.$queryRaw`insert into Production.software(
    select d.*
    from Test.software as d
    left join Production.software as t
    on d.software = t.software and d.uid = t.uid
    where t.software is null and t.uid in (select uid from Production.model));`

// Migrate base annotations of those models
export const productionAnnotationMigration = prisma.$queryRaw`insert into Production.annotations(
    select d.* from Test.annotations as d
    left join Production.annotations as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.uid in (select uid from Production.model));`

// Migrate photo annotations of those models
export const productionPhotoAnnotationMigration = prisma.$queryRaw`insert into Production.photo_annotation(
    select d.* 
    from Test.photo_annotation as d
    left join Production.photo_annotation as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.annotation_id in (select annotation_id from Production.annotations));`

// Migrate video annotations of those models
export const productionVideoAnnotationMigration = prisma.$queryRaw`insert into Production.video_annotation(
    select d.* 
    from Test.video_annotation as d
    left join Production.video_annotation as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.annotation_id in (select annotation_id from Production.annotations));`

// Migrate model annotations of those models
export const productionModelAnnotationMigration = prisma.$queryRaw`insert into Production.model_annotation(
    select d.* 
    from Test.model_annotation as d
    left join Production.model_annotation as t
    on d.annotation_id = t.annotation_id
    where t.annotation_id is null and d.annotation_id in (select annotation_id from Production.annotations));`

