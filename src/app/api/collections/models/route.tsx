/**
 * @file src/app/api/collections/models/route.tsx
 * 
 * @fileoverview obtains all site ready 3d models, primarily used for collections/search thumbnail display
 */

// Imports
import { getAllSiteReadyModels } from "@/api/queries"
import { routeHandlerTypicalCatch, routeHandlerErrorHandler } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"

// Force dynamic results
export const dynamic = 'force-dynamic'

/**
 * @returns site ready 3D models (or error message onError)
 */
export async function GET() { 
  try{
        // Route
        const route = 'src/app/api/collections/models/route.tsx'
        // Get Models
        const models = await getAllSiteReadyModels(process.env.LOCAL_ENV === 'development').catch(e => routeHandlerErrorHandler(route, e.message, 'getAllSiteReadyModels()', "Couldn't get 3D models"))
        // Typical return
        return routeHandlerTypicalResponse("Models obtained", models)
      }
      // Typical catch
      catch(e: any) {return routeHandlerTypicalCatch(e.message)}
    }