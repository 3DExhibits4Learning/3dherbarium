import { getAccount } from "@/functions/server/queries";
import { Account } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {

    try {

        const data = new FormData()

        const session = await getServerSession(authOptions).catch((e) => {
            console.error(e.message)
            throw new Error("Couldn't get session")
        })
        
        const account = await getAccount(session.user.id, 'inaturalist').catch((e) => {
            console.error(e.message)
            throw new Error("Couldn't get account")
        }) as Account

        const iNatToken = account.access_token

        const requestData = await request.formData().catch((e) => {
            console.error(e.message)
            throw new Error("No form data")
        })

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
            .catch((e) => {
                console.error(e.message)
                throw new Error("Error posting observation")
            })


        if (Object.keys(postObservation).includes('error')) { throw Error(postObservation.error.original.error ?? 'error') }

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
                .then(res => res.json())
                .then(json => json)
            ))
        }

        results = await Promise.all(promises).catch((e) => {
            console.error(e.message)
            throw new Error("Error posting observation photo")
        })


        for (let i = 0; i < results.length; i++) {
            if (Object.keys(results[i]).includes('error')) { throw Error('Error posting photo to observation') }
        }

        return Response.json({ data: 'Observation Posted!', response: results })

    }
    catch (e: any) { return Response.json({ data: e.message, response: e.message }, { status: 400, statusText: e.message }) }
}
