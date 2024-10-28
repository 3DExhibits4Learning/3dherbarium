import { readFile, writeFile, mkdir } from "fs/promises"

export async function POST(request: Request){

    try{

        const json = await request.json().catch((e) => {
            console.error(new Date().toDateString, 'Route: /api/tmp/writeAnnotation,  Fn: request.json(), Error: ', e.message)
            throw Error("Couln't get json data")
        })
        
        const dir = json.dir
        const paramPath = json.path
        const readPath = process.env.WINDOWS_NFS ? `X:${paramPath.slice(5)}` : `public${paramPath}`
        const tmpId = json.id
        const tmpDir = dir.replace('data', `tmp/${tmpId}`)
        const tmpPath = 'public' + paramPath.replace('data', `tmp/${tmpId}`)
        
        const file = await readFile(readPath).catch((e) => {
            console.error(new Date().toDateString(), 'Route: /api/tmp/writeAnnotation,  Fn: readFile, Error: ', e.message)
            throw Error("Couln't read annotation photo file")
        })
        
        await mkdir(tmpDir, {recursive: true}).catch((e) => {
            console.error(new Date().toDateString(), 'Route: /api/tmp/writeAnnotation, Fn: mkDir, Error: ', e.message)
            throw Error("Couln't make annotation photo directory")
        })
        
        //@ts-ignore - Typescript thinks writeFile can't write with a buffer
        await writeFile(tmpPath, file).catch((e) => {
            console.error(new Date().toDateString(), 'Route: /api/tmp/writeAnnotation, Fn: writeFile, Error: ', e.message)
            throw Error("Couln't write annotation photo file")
        })

        return Response.json({data:"Success", response:tmpId})
    }
    catch(e: any){return Response.json({data: e.message, response:e.message}, {status:400, statusText:e.message})}
}