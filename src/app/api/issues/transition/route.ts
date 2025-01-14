/**
 * @file src/app/api/issues/transition/route.ts
 * 
 * @fileoverview route handler allowing issues to be transitioned from the client
 */

// Imports
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error";
import { transitionIssue } from "@/functions/server/jira";

// Path
const path = 'src/app/api/issues/transition/route.ts'

export async function POST(request: Request) {

    try {
        // Get JSON
        const json = await request.json().catch(e => routeHandlerErrorHandler(path, e.message, 'request.json()', "Couldn't get JSON"))

        // Initialize and check for variables
        const issueKey = json.issueKey
        const transitionId = json.transitionId
        if (!(issueKey || transitionId)) { throw Error('Missing input data') }

        // Transition issue status
        await transitionIssue(transitionId, issueKey).catch(e => routeHandlerErrorHandler(path, e.message, 'transitionIssue()', "Couldn't transition issue")) as Response

        // Respond
        return new Response("Status updated")
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}