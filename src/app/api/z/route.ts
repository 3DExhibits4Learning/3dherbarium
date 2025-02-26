import fs, { ReadStream } from 'fs'
import { routeHandlerTypicalCatch } from '@/functions/server/error'
import { routeHandlerTypicalResponse } from '@/functions/server/response'

export async function POST(request: Request) {

    try {
        const data = await request.formData()
        console.log(data)
        // const stream = data.get('file') as unknown as ReadStream
        // const writable = fs.createWriteStream('X:/Herbarium/models/streamedModel')
        // stream.pipe(writable)
        // writable.on('finish', () => console.log('written'))
        // writable.on('error', e => { throw Error(e.message) })
        return routeHandlerTypicalResponse('Success', 'Success')
    }

    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}