import { mkdir, writeFile } from "fs/promises"

/**
 * 
 * @param file 
 * @param dir 
 * @param path 
 */
export const autoWrite = async (file: File, dir: string, path: string) => {
    const bytes = await file.arrayBuffer()
    const photoBuffer = Buffer.from(bytes)
    await mkdir(dir, { recursive: true })
    await writeFile(path, photoBuffer)
}

/**
 * 
 * @param file 
 * @param dir 
 * @param path 
 */
export const autoWriteArrayBuffer = async (arrayBuffer: ArrayBuffer, dir: string, path: string) => {
    const photoBuffer = Buffer.from(arrayBuffer)
    await mkdir(dir, { recursive: true })
    await writeFile(path, photoBuffer)
}