import fs from 'fs'
import { ReadStream } from 'fs'

export async function POST(request: Request){
    const data = await request.formData()
    const stream = data.get('file') as unknown as ReadStream
    const writable = fs.createWriteStream('X:/Herbarium/models/streamedModel')
    stream.pipe(writable)
    writable.on('finish', () => console.log('written'))
}