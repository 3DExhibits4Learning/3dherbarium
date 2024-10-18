import { NextRequest } from "next/server"
import { readdir } from "fs/promises"

export async function GET(request: NextRequest){
    
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get('path') as string
    
    if(!path) throw Error("No Path")

    const files = await readdir(path).catch((e) => {
        console.error("Error reading file path, error message: ", e.message)
        throw Error('Error reading file path')
    })
    return Response.json({data: "Filenames obtained", response: files})
}