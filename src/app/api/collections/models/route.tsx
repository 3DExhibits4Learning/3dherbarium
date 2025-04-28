/**
 * @file src/app/api/collections/models/route.tsx
 * 
 * @fileoverview obtains all site ready 3d models, primarily used for collections/search thumbnail display
 */

// Imports
import { routeHandlerTypicalCatch, routeHandlerErrorHandler } from "@/functions/server/error"
import { routeHandlerTypicalResponse } from "@/functions/server/response"
import { model } from "@prisma/client"

// SINGLETON
import prisma from "@/functions/server/utils/prisma"

// Force dynamic results
export const dynamic = 'force-dynamic'

/**
 * @returns site ready 3D models (or error message onError)
 */
export async function GET() {

  try {
    // Route
    const route = 'src/app/api/collections/models/route.tsx'
    
    // Get Models
    const models = await prisma.model.findMany({ where: { site_ready: true }, orderBy: { spec_acquis_date: 'desc' } }).catch(e => routeHandlerErrorHandler(route, e.message, 'prisma.model.findMany()', "Couldn't get 3D models")) as model[]
    
    // Filter models based on development or production/test environments
    const filteredModels = process.env.LOCAL_ENV === 'development' || process.env.LOCAL_ENV === 'admin' ? models.filter(model => model.site_ready && (model.base_model || model.annotation_number)) :
      models.filter(model => (model.site_ready && model.annotation_number) || (model.site_ready && model.base_model && model.annotator && model.annotated))

    // Typical return
    return routeHandlerTypicalResponse("Models obtained", filteredModels)
  }
  // Typical catch
  catch (e: any) { return routeHandlerTypicalCatch(e.message) }
}