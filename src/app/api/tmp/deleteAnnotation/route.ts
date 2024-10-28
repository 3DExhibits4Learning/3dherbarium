import { unlink } from "fs/promises";

export async function DELETE(request: Request) {

    try {
        const { searchParams } = new URL(request.url)
        const path = searchParams.get('path') as string

        await unlink(path).catch((e) => {
            console.error(new Date().toDateString(), 'Route: /api/tmp/deleteAnnotation,  Fn: unlink, Error: ', e.message)
            throw Error("Couln't delete tmp annotation photo")
        })

        return Response.json({data:"Photo deleted from tmp", response: "Photo deleted from tmp"})
    }
    catch (e: any) { return Response.json({data: e.message, response: e.message}, {status:400, statusText:e.message}) }
}