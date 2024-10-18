// Retrieve photos from NFS data storage container

import { readFile } from "fs/promises"

export async function GET(request: Request) {

    try {
        
        const { searchParams } = new URL(request.url)
        
        const fileBuffer = await readFile(searchParams.get('path') as string).catch((e) => {
            console.error(e.message)
            throw Error("Can't read photo")
        })

        return new Response(fileBuffer, { status: 200 })
    }
    catch (e: any) {return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message })}
}