/**
 * @file src/app/api/issues/create/route.tsx
 * 
 * @fileoverview route handler for creating jira issues
 */

// Typical imports
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"

// Default imports
import sendErrorEmail from "@/functions/server/Jira/sendErrorEmail"

// PATH
const path = 'src/app/api/issues/create/route.tsx'

/**
 * 
 * @param request HTTP request
 * @returns typical response
 */
export async function POST(request: Request) {

    try{

        // Get request JSON
        const data = await request.json().catch(e => routeHandlerErrorHandler(path, e.message, "request.json()", "Couldn't get request JSON"))
        
        // API key buffer
        const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')
        
        // Atlassian fetch
        const response = await fetch('https://3dteam.atlassian.net/rest/api/3/issue', {
            method: 'POST',
            //@ts-ignore -- without the first two headers, data is not returned in English
            headers: {
                'X-Force-Accept-Language': true,
                'Accept-Language': 'en',
                'Authorization': `Basic ${base64}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(json => json).catch((e: any) => sendErrorEmail(e.message, `Create task Procure ${new Date().toLocaleDateString()}`))
        
        // Typical response
        return routeHandlerTypicalResponse("Success", response)
    }
    // Typical catch
    catch(e:any){return routeHandlerTypicalCatch(e.message)}
}