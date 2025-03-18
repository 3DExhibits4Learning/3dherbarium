import { updateThumbUrl } from "@/functions/server/queries"

export async function GET(request: Request) {

    try {
        
        // Variable initialization
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get('uid') as string
        var thumbUrl: string = ''

        // Obtain thumbnail from sketchfab
        await fetch(`https://api.sketchfab.com/v3/models/${uid}`)
            .then(res => res.json())
            .then(data => thumbUrl = data.thumbnails.images[0].url)
            .catch((e) => {
                console.error('Error getting thumbnail from sketchfab, error message: ', e.message)
                throw Error('Error obtaining thumbnail')
            })

        let updateResponse

        if (searchParams.get('community')) updateResponse = await updateThumbUrl(thumbUrl, uid, true).catch((e) => {
            console.error(e.message)
            throw Error('Error updating community thumbnail in database')
        })

        else updateResponse = await updateThumbUrl(thumbUrl, uid, false).catch((e) => {
            console.error(e.message)
            throw Error('Error updating thumbnail in database')
        })

        // Typical success response
        return Response.json({ data: 'Thumbnail Updated', response: updateResponse })
    }

    // Typical catch response
    catch (e: any) { return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message }) }
}