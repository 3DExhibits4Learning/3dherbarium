import { updateThumbUrl } from "@/api/queries"

export async function GET(request: Request) {

    try {
        const { searchParams } = new URL(request.url)
        const uid = searchParams.get('uid') as string
        var thumbUrl: string = ''

        await fetch(`https://api.sketchfab.com/v3/models/${uid}`)
            .then(res => res.json())
            .then(data => thumbUrl = data.thumbnails.images[0].url)

        console.log(searchParams.get('uid'))
        console.log(searchParams.get('nonCommunity'))

        let updateResponse
        if(searchParams.get('nonCommunity')) updateResponse = await updateThumbUrl(thumbUrl, undefined, uid, true)
        else updateResponse = await updateThumbUrl(thumbUrl, undefined, uid)
        return Response.json({data:'Thumbnail Updated', response: updateResponse})
    }
    catch (e: any) { return Response.json({data: 'Error updating Thumbnail', response:e.message}, {status:400, statusText:'Error Updating Thumbnail'}) }
}