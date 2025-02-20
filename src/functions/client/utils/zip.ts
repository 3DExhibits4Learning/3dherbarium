/**
 * @file C:\Users\ab632\Documents\Code\3DExhibits4Learning\herbarium\src\functions\client\utils\zip.ts
 * 
 * @fileoverview zip related functions
 */


/**
 * 
 * @param file File 
 * @returns boolean indicating whether a file is zip by its file extension
 */
export const isZipByExtension = (file: File) => file.name.toLowerCase().endsWith('.zip')

/**
 * 
 * @param file File
 * @returns boolean indicating whether a file is zip by its mime type
 */
export const isZipByMimeType = (file: File) => file.type === 'application/zip'

/**
 * 
 * @param file File
 * @returns boolean indicating whether or not the first few bytes of the file contain the signature of a zip file
 */
export async function isZipByMagicNumber(file: File) {

    // Reader, first 4 bytes of the file
    const reader = new FileReader()
    const blob = file.slice(0, 4)

    // Return promise with boolean resolution
    return new Promise(resolve => {
        reader.onloadend = () => {
            const arr = new Uint8Array(reader.result as ArrayBuffer)
            const signature = arr.slice(0, 4).join(' ')
            resolve(signature === '80 75 3 4' || signature === '80 75 5 6' || signature === '80 75 7 8')
        }
        reader.readAsArrayBuffer(blob)
    })
}

/**
 * 
 * @param file File
 * @returns 
 */
export const isZipFile = async (file: File) => isZipByExtension(file) || isZipByMimeType(file) || await isZipByMagicNumber(file)

