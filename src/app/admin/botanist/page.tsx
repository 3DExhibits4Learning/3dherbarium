
/**
 * @file src/app/admin/botanist/page.tsx
 * 
 * @fileoverview botanist admin server page
 */

import { getAllAnnotationModels, getModelsToAnnotate, getAdmin  } from "@/api/queries"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { authed } from "@prisma/client"
import { getIssue } from "@/functions/server/jira"

import Header from "@/components/Header/Header"
import Foot from "@/components/Shared/Foot"
import BotanyClient from "@/components/Admin/Botanist/BotanyClient"

export default async function Page() {

    const session = await getServerSession(authOptions)
    let email = session?.user?.email as string
    const admin = await getAdmin(email) as authed

    if (!['Director', 'Botanist'].includes(admin.role)) {
        return <h1>NOT AUTHORIZED</h1>
    }

    const modelsToAnnotate = await getModelsToAnnotate()
    const annotationModels = await getAllAnnotationModels()
    const epic = await getIssue('SPRIN-1')

    return (
        <>
            <Header pageRoute="collections" headerTitle="Botany Admin" />
            <main className="w-full min-h-[calc(100vh-177px)] h-[calc(100vh-177px)] overflow-y-auto">
                <BotanyClient modelsToAnnotate={modelsToAnnotate} annotationModels={annotationModels} epic={epic}/>
            </main>
            <Foot />
        </>
    )
}