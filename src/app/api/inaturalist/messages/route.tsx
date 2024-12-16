// Imports
import { getAccount } from "@/api/queries";
import { Account } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error";
import { routeHandlerTypicalResponse } from "@/functions/server/response";
import { Message } from "@/ts/inaturalist";

// Path
const path = 'src/app/api/inat/route.tsx'

/**
 * 
 * @param request 
 * @returns typical response object containing userID
 */
export async function GET(request: Request) {

    try {

        // Get params
        const { searchParams } = new URL(request.url)

        // Get uid based on username
        const userId = await fetch(`https://api.inaturalist.org/v1/users/autocomplete?q=${searchParams.get('username')}`)
            .then(res => res.json())
            .then(json => json.results[0].id)
            .catch(e => routeHandlerErrorHandler(path, e.message, "fetch()", "Couldn't get iNaturalist user id", 'GET'))

        // Response w/ userID
        if (userId) return new Response(JSON.stringify({ userId }), { status: 200 })
        else throw Error("User ID not found")
    }

    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}

/**
 * 
 * @param request HTTP request
 * @returns success message and inat response or error message
 */
export async function POST(request: Request) {
        //todo check if user has 3 observations or three identifications, or they are trying to send a message to themselves first.
        try {

            // Get data, set variables
            const data = await request.json().catch(e => routeHandlerErrorHandler(path, e.message, "request.json()", "No JSON", 'POST'))
            const session = await getServerSession(authOptions).catch(e => routeHandlerErrorHandler(path, e.message, "getServerSession()", "Coundn't get session", 'POST'))
            const account = await getAccount(session.user.id, 'inaturalist').catch(e => routeHandlerErrorHandler(path, e.message, "getAccount()", "Coundn't get account", 'POST')) as Account
            const iNatToken = account.access_token

            // Message object
            const messageObj : Message = {
                message: {
                    to_user_id: data.id,
                    subject: data.subject,
                    body: data.body
                }
            }
            // Send message
            const sendMessage = await fetch('https://api.inaturalist.org/v1/messages', {
                method: 'POST',
                headers: { 'Authorization': iNatToken as string },
                body: JSON.stringify(messageObj)
            })
                .then(res => res.json())
                .then(json => json)
                .catch(e => routeHandlerErrorHandler(path, e.message, "sendMessage()", "Coundn't send message", 'POST'))
                
            // iNaturalist sends a 200 response with 'error' as an object key if there is in fact an error
            if (Object.keys(sendMessage).includes('error')) {
                console.error("iNaturalist API Error:", sendMessage);
                console.log(sendMessage.error.original.errors)

                return Response.json({ data: "Error, couldn't send message", response: sendMessage.error.original.error ?? 'error' }, { status: 400, statusText: "Error, couldn't send message" })
            }

            // Affirmation and inat response sent for potential debugging
            return routeHandlerTypicalResponse('Message sent', sendMessage)
        }

        // Typical catch
        catch (e: any) { routeHandlerTypicalCatch(e.message) }
    }