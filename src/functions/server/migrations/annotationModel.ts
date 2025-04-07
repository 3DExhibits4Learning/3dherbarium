import prisma from "../utils/prisma"

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateAnnotationModelData = (uid: string) => prisma.$queryRaw`update Test.model as t
    join Development.model as d
    on t.uid = d.uid
    set t.thumbnail = d.thumbnail, t.annotation_number = d.annotation_number, t.max_zoom_in = d.max_zoom_in, t.max_zoom_out = d.max_zoom_out
    where t.uid = '${uid}';`

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateAnnotationNumbers = (uid: string) => prisma.$queryRaw`update Test.annotations as t
    join Development.annotations as d
    on d.annotation_id = t.annotation_id
    set t.annotation_no = d.annotation_no
    where t.uid = '${uid}';`

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateBaseAnnotation = (annotationId: string) => prisma.$queryRaw`insert into Test.annotations(select * from Development.annotations where uid = '${annotationId}';`

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateModelAnnotation = (annotationId: string) => prisma.$queryRaw`insert into Test.model_annotation(select * from Development.model_annotation where uid = '${annotationId}';`

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateAnnotationModelDataT = (uid: string, d1: string, d2: string) => prisma.$queryRaw`update ${d2}.model as t
    join ${d1}.model as d
    on t.uid = d.uid
    set t.thumbnail = d.thumbnail, t.annotation_number = d.annotation_number, t.max_zoom_in = d.max_zoom_in, t.max_zoom_out = d.max_zoom_out
    where t.uid = '${uid}';`

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateAnnotationNumbersT = (uid: string, d1: string, d2: string) => prisma.$queryRaw`update ${d2}.annotations as t
    join ${d1}.annotations as d
    on d.annotation_id = t.annotation_id
    set t.annotation_no = d.annotation_no
    where t.uid = '${uid}';`

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateBaseAnnotationT = (annotationId: string, d1: string, d2: string) => prisma.$queryRaw`insert into ${d2}.annotations(select * from ${d1}.annotations where uid = '${annotationId}';`

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateModelAnnotationT = (annotationId: string, d1: string, d2: string) => prisma.$queryRaw`insert into ${d2}.model_annotation(select * from ${d1}.model_annotation where uid = '${annotationId}';`