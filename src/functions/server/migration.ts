/**
 * @file src/functions/server/manager.ts
 * 
 * @fileoverview these are the migration functions that are sequentially executed in a transaction to migrate annotated models to the next stage of development
 */

import prisma from "@/utils/prisma"

// Species migration (species table to be deprecated eventually)
export const speciesMigration = (localDb: string, targetDb: string) => prisma.$queryRaw`insert into ${targetDb}.species(
select d.*
from ${localDb}.species as d
left join ${targetDb}.species as t
on d.spec_name = t.spec_name
where t.spec_name is null);`

// Migrate specimen
export const specimenMigration = (localDb: string, targetDb: string) => prisma.$queryRaw`insert into ${targetDb}.specimen(
select d.*
from ${localDb}.specimen as d
left join ${targetDb}.specimen as t
on d.spec_acquis_date = t.spec_acquis_date and d.spec_name = t.spec_name
where t.spec_name is null);`

// Migrate 3D models marked as annotated that are in the local db, but not the target db
export const annotatedModelMigration = (localDb: string, targetDb: string) => prisma.$queryRaw`insert into ${targetDb}.model(
select d.* 
from ${localDb}.model as d
left join ${targetDb}.model as t
on d.uid = t.uid
where t.uid is null and d.annotated is true);`

// Migrate image set of those models
export const imageSetMigration = (localDb: string, targetDb: string) => prisma.$queryRaw`insert into ${targetDb}.image_set(
select d.* 
from ${localDb}.image_set as d
left join ${targetDb}.image_set as t
on d.spec_name = t.spec_name and d.spec_acquis_date = t.spec_acquis_date and d.set_no = t.set_no
where t.spec_name is null and d.uid is not null and d.uid in (select uid from ${targetDb}.model));`

// Migrate base annotations of those models
export const annotationMigration = (localDb: string, targetDb: string) => prisma.$queryRaw`insert into ${targetDb}.annotations(
select d.* from ${localDb}.annotations as d
left join ${targetDb}.annotations as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.uid in (select uid from ${targetDb}.model));`

// Migrate photo annotations of those models
export const photoAnnotationMigration = (localDb: string, targetDb: string) => prisma.$queryRaw`insert into ${targetDb}.photo_annotation(
select d.* 
from ${localDb}.photo_annotation as d
left join ${targetDb}.photo_annotation as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.annotation_id in (select annotation_id from ${targetDb}.annotations));`

// Migrate video annotations of those models
export const videoAnnotationMigration = (localDb: string, targetDb: string) => prisma.$queryRaw`insert into ${targetDb}.video_annotation(
select d.* 
from ${localDb}.video_annotation as d
left join ${targetDb}.video_annotation as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.annotation_id in (select annotation_id from ${targetDb}.annotations));`

// Migrate model annotations of those models
export const modelAnnotationMigration = (localDb: string, targetDb: string) => prisma.$queryRaw`insert into ${targetDb}.model_annotation(
select d.* 
from ${localDb}.model_annotation as d
left join ${targetDb}.model_annotation as t
on d.annotation_id = t.annotation_id
where t.annotation_id is null and d.annotation_id in (select annotation_id from ${targetDb}.annotations));`
