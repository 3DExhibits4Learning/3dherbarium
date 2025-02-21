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

/**
 * 
 * @param buffer 
 * @param dir 
 * @param path 
 */
export const autoWriteBuffer = async (buffer: Buffer, dir: string, path: string) => {
    await mkdir(dir, { recursive: true })
    await writeFile(path, buffer)
}

/**
 * 
 * @param buffer 
 * @returns 
 */
export const getFileExtensionOfBuffer = (buffer: Buffer) => {
    // Convert the first 4 bytes of the buffer to a hex string
    const hex = buffer.slice(0, 4).toString('hex').toUpperCase()
  
    // Mapping of magic numbers to file extensions
    const signatures: any = {
      '89504E47': 'png',
      'FFD8FFE0': 'jpg', // JPEG
      'FFD8FFE1': 'jpg', // JPEG EXIF
      'FFD8FFE2': 'jpg', // JPEG EXIF
      '47494638': 'gif',
      '49492A00': 'tiff',
      '4D4D002A': 'tiff',
      '52494646': 'webp',
      '25504446': 'pdf'
    }
  
    return '.' + signatures[hex] || ''
  }
  