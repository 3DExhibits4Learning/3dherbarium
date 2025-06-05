/**
 * @file src/functions/client/modelSubmit.ts
 * 
 * @fileoverview client side model submission logic
 */

'use client'

// Typical imports
import { isZipFile } from './utils/zip'
import { getBackupPath, getTmpPath } from '../server/modelSubmit'

// Default imports
import JSZip from 'jszip'

/**
 * 
 * @param zip 
 * @param tmpId 
 */
export const chunkFileToDisk = async (file: File, id: string, dir: 'backup' | 'tmp') => {
    // Declare chunk size and offset
    const chunkSize = 4 * 1024 * 1024 // 4 MB chunks
    var offset = 0

    // Fetch chunks until file upload is complete
    while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize)
        offset += chunkSize
        const extension = file.name.split('.').pop()

        // Set form data
        const data = new FormData()
        data.set('chunk', chunk)
        data.set('path', dir === 'tmp' ? await getTmpPath(id, extension as string): await getBackupPath(id, extension as string))

        // Await fetch
        const res = await fetch('/api/modelSubmit/tmp', { method: 'POST', body: data })
        if (!res.ok) throw Error("Couldn't write file to disk")
    }
    return
}

export const zipFileIfNeeded = async (file: File, fileName: string) => {
    // Return file if it's already zipped
    if (await isZipFile(file)) return file

    // Return zipped file
    const zip = new JSZip()
    zip.file(fileName, file)
    return await zip.generateAsync({ type: 'blob' })
}