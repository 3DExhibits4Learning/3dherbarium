import { getAccount } from "@/api/queries";
import { Account } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);

    if (searchParams.get('requestType') == 'getId') {

        try {
            const userId = await fetch(`https://api.inaturalist.org/v1/users/autocomplete?q=${searchParams.get('username')}`)
                .then(res => res.json()).then(json => json.results[0].id)

            return Response.json({ data: 'userId Found', response: userId })
        }
        catch (e: any) { Response.json({ data: 'Error, user not found', response: e.message }, { status: 400, statusText: 'Error, User Not Found' }) }
    }

    else return Response.json({ data: 'invalid request type', response: 'invalid request type' }, { status: 400, statusText: 'invalid request type' })
}

export async function POST(request: Request) {

    const data = await request.json()
    const session = await getServerSession(authOptions)
    //@ts-ignore
    const account = await getAccount(session.user.id, 'inaturalist') as Account
    const iNatToken = account.access_token

    if (data.requestType == 'sendMessage') {

        try {

            const messageObj = {
                message: {
                    to_user_id: data.id,
                    subject: data.subject,
                    body: data.body
                }
            }

            const sendMessage = await fetch('https://api.inaturalist.org/v1/messages', {
                method: 'POST',
                headers: {
                    'Authorization': iNatToken as string
                },
                body: JSON.stringify(messageObj)
            })
                .then(res => res.json())
                .then(json => json)

            if(Object.keys(sendMessage).includes('error')){
                return Response.json({ data: "Error, couldn't send message", response: sendMessage.error.original.error ?? 'error' }, { status: 400, statusText: "Error, couldn't send message" })
            }

            return Response.json({ data: 'Message sent', response: sendMessage })
        }
        catch (e: any) { Response.json({ data: "Error, couldn't send message", response: e.message }, { status: 400, statusText: "Error, couldn't send message" }) }
    }
}