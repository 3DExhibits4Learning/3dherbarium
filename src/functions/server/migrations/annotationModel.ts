import prisma from "../utils/prisma"

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateAnnotationModelData = (uid: string, d1: string, d2: string) => prisma.$queryRawUnsafe(`update ${d2}.model as t
    join ${d1}.model as d
    on t.uid = d.uid
    set t.thumbnail = d.thumbnail, t.annotation_number = d.annotation_number, t.max_zoom_in = d.max_zoom_in, t.max_zoom_out = d.max_zoom_out
    where t.uid = '${uid}';`)

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateAnnotationNumbers = (uid: string, d1: string, d2: string) => prisma.$queryRawUnsafe(`update ${d2}.annotations as t
    join ${d1}.annotations as d
    on d.annotation_id = t.annotation_id
    set t.annotation_no = d.annotation_no
    where t.uid = '${uid}';`)

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateBaseAnnotation = (annotationId: string, d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.annotations(select * from ${d1}.annotations where uid = '${annotationId}';`)

/**
 * 
 * @param uid 
 * @returns 
 */
export const migrateModelAnnotation = (annotationId: string, d1: string, d2: string) => prisma.$queryRawUnsafe(`insert into ${d2}.model_annotation(select * from ${d1}.model_annotation where uid = '${annotationId}';`)

