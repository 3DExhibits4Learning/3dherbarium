/**
 * @deprecated
 */

import { readFile } from "fs/promises"

export async function GET(request: Request) {

    try {
        const { searchParams } = new URL(request.url)
        const fileBuffer = await readFile(searchParams.get('path') as string).catch((e) => {
            console.error(e.message)
            throw Error("Can't read annotation photo")
        })

        return new Response(fileBuffer, { status: 200 })
    }
    catch (e: any) {
        if (process.env.LOCAL_ENV) console.error(e.message)
        return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message })
    }
}