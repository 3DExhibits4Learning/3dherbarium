import { getAccount } from "@/api/queries";
import { Account } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {

    const session = await getServerSession(authOptions)
    //@ts-ignore
    const account = await getAccount(session.user.id, 'inaturalist') as Account
    const iNatToken = account.access_token
    const requestData = await request.formData()
    const data = new FormData()

    try {
        const postObj = {
            observation: {
                species_guess: requestData.get('species') as string,
                latitude: parseFloat(requestData.get('latitude') as string),
                longitude: parseFloat(requestData.get('longitude') as string),
                observed_on_string: requestData.get('observed_on') as string
            }
        }

        const postObservation = await fetch('https://api.inaturalist.org/v1/observations', {
            method: 'POST',
            headers: {
                'Authorization': iNatToken as string
            },
            body: JSON.stringify(postObj)
        })
            .then(res => res.json())
            .then(json => json)

        if (Object.keys(postObservation).includes('error')) {
            return Response.json({ data: "Error, couldn't send message", response: postObservation.error.original.error ?? 'error' }, { status: 400, statusText: "Error, couldn't send message" })
        }

        let promises = []
        let results: any = []

        data.set('observation_photo[observation_id]', postObservation.id)

        for (let i = 0; i < parseInt(requestData.get('numberOfImages') as string); i++) {
            data.set(`file`, requestData.get(`file${i}`) as Blob)

            promises.push((fetch('https://api.inaturalist.org/v1/observation_photos', {
                method: 'POST',
                headers: {
                    'Authorization': iNatToken as string
                },
                body: data
            })
                .then(res => res.json()).then(json => json)
            ))
        }

        results = await Promise.all(promises)

        for (let i = 0; i < results.length; i++) {
            if (Object.keys(results[i]).includes('error')) {
                return Response.json({ data: "Error, couldn't post a photo to the observation", response: results }, { status: 400, statusText: "Error, couldn't post a photo to the observation" })
            }
        }

        return Response.json({ data: 'Observation Posted!', response: results })

    }
    catch (e: any) { return Response.json({ data: 'error', response: e.message }, { status: 400, statusText: 'Error' }) }
}
