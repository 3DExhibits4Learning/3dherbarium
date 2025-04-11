/**
 * @file src\functions\server\admin\modelSubmit.ts
 * 
 * @fileoverview server side model submission logic
 */

'use server'

const path = 'src/functions/server/admin/modelSubmit.ts'

/**
 * 
 * @param tmpId 
 * @returns 
 * @detail this function behaves asynchronously even when async is not added to the function; hence async's addidtion as to not aggravate the IDE
 */
export const getTmpPath = async (tmpId: string) => process.env.LOCAL_ENV === 'development' ? `X:/Herbarium/tmp/models/${tmpId}` : `public/data/Herbarium/tmp/models/${tmpId}`

/**
 * 
 * @param speciesAndUid 
 * @returns 
 */
export const getBackupPath = async (speciesAndSidSlice: string) => process.env.LOCAL_ENV === 'development' ? `X:/Herbarium/backup/models/${speciesAndSidSlice}` : `public/data/Herbarium/backup/models/${speciesAndSidSlice}`