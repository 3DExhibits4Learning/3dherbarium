
/**
 * @file src/app/admin/botanist/page.tsx
 * 
 * @fileoverview botanist admin server page
 * 
 * @todo promise.all initial awaits
 */

// Typical imports
import { getAllAnnotationModels, getModelsToAnnotate, getAdmin, getAllSiteReadyModels } from "@/functions/server/queries"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { authed } from "@prisma/client"
import { getIssue } from "@/functions/server/jira"

// Default imports
import BotanyClientWrapper from "@/components/Admin/Botanist/ClientWrapper"

// Main JSX
export default async function Page() {

    const session = await getServerSession(authOptions)
    let email = session?.user?.email as string
    const admin = await getAdmin(email) as authed

    if (!['Director', 'Botanist'].includes(admin.role)) { return <h1>NOT AUTHORIZED</h1> }

    const modelsToAnnotate = await getModelsToAnnotate()
    const annotationModels = await getAllAnnotationModels()
    const allModels = await getAllSiteReadyModels(false)
    const epic = await getIssue('SPRIN-1')

    const annotationModelSpeciesNames = new Set()
    annotationModels.forEach(model => annotationModelSpeciesNames.add(model.spec_name.toLowerCase()))
    const baseModelsForAnnotationModels = allModels.filter(model => annotationModelSpeciesNames.has(model.spec_name.toLowerCase()))

    return <BotanyClientWrapper modelsToAnnotate={modelsToAnnotate} annotationModels={annotationModels} epic={epic} baseModelsForAnnotationModels={baseModelsForAnnotationModels} />

}