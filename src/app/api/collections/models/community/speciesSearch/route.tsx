/**
 * @file src/app/api/collections/models/community/speciesSearch/route.tsx
 * 
 * @fileoverview route handler to get published user submittals
 */

// Dynamic route
export const dynamic = 'force-dynamic'

// Imports
import { getPublishedUserSubmittalsBySpecies } from "@/functions/server/queries";
import { routeHandlerErrorHandler, routeHandlerTypicalCatch } from "@/functions/server/error";
import { routeHandlerTypicalResponse } from "@/functions/server/response";

// Path
const path = 'src/app/api/collections/models/community/speciesSearch/route.tsx'

/**
 * 
 * @param request HTTP request
 * @returns response with affirmation message and database response object or response with error message
 */
export async function GET(request: Request) {

    try {
        // Get species name from params
        const { searchParams } = new URL(request.url); const speciesName = searchParams.get('species')

        // Await community models
        const communityModels = await getPublishedUserSubmittalsBySpecies(speciesName as string)
            .catch(e => routeHandlerErrorHandler(path, e.message, "getPublishedSubmittals()", "Counln't get models"))

        // Typical response
        return routeHandlerTypicalResponse('Success', communityModels)
    }
    // Typical catch
    catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}