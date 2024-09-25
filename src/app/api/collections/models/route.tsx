import { getAllSiteReadyModels } from "@/api/queries"

// Returns all SiteReadyModels
export async function GET() {
      console.log('TEST: The following should be true: ', !!(process.env.LOCAL_ENV === 'development'))
      try{
        const models = await getAllSiteReadyModels(!!(process.env.LOCAL_ENV === 'development'))
        return Response.json({data: 'models got', response: models})
      }
      catch(e: any) {return Response.json({data:'Error getting models', response: e.message}, {status: 400, statusText: 'Error getting models'})}
    }