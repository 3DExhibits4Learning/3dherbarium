/**
 * @file src/app/admin/management/page.tsx
 * 
 * @fileoverview server page for management client
 */

// Typical imports
import { getAllPendingModels } from "@/functions/server/queries";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAdmin } from "@/functions/server/queries";
import { authed } from "@prisma/client";
import { serverErrorHandler } from "@/functions/server/error";

// Default imports
import ManagerClient from "@/components/Admin/Manager/ManagerClient"
import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import FullPageError from "@/components/Error/FullPageError";

// Path
const path = 'src/app/admin/management/page.tsx'

// Main JSX
export default async function Page() {

    try {

        // Get email from session
        const session = await getServerSession(authOptions).catch(e => serverErrorHandler(path, e.message, "Couldn't get session", "getServerSession()", false))
        const email = session?.user?.email as string

        // Get admin record from db
        const admin = await getAdmin(email).catch(e => serverErrorHandler(path, e.message, "Couldn't get db record", "getAdmin()", false)) as authed
        if (admin.role !== 'Director') { return <h1>NOT AUTHORIZED</h1> }

        // Get and stringify pending models (decimals can't be passed directly from server to client)
        const pendingModels = await getAllPendingModels().catch(e => serverErrorHandler(path, e.message, "Couldn't get pending models", "getAllPendingModels", false))
        const pendingModelsJson = JSON.stringify(pendingModels)

        // Return Header, ManagerClient in a wrapper, Footer
        return <>
            <Header pageRoute="collections" headerTitle='Management' />
            <section className="flex flex-col !min-h-[calc(100vh-177px)]">
                <ManagerClient pendingModels={pendingModelsJson} katId={process.env.KAT_JIRA_ID as string} hunterId={process.env.hunter_JIRA_ID as string} />
            </section>
            <Foot />
        </>
    }
    // Typical catch
    catch (e: any) { return <FullPageError clientErrorMessage={e.message} /> }
}