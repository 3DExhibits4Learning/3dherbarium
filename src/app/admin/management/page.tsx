import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import { getAllPendingModels } from "@/api/queries";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { management } from "@/utils/devAuthed"
import ManagerClient from "@/components/Admin/ManagerClient"

export default async function Page() {

    // management AUTH redirect

    const session = await getServerSession(authOptions)
    let email = session?.user?.email as string

    if (!management.includes(email)) {
        return <h1>NOT AUTHORIZED</h1>
    }
    // Model array must be strigified due to the following warning
    // Warning: Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported.
    const pendingModels = await getAllPendingModels()
    const pendingModelsJson = JSON.stringify(pendingModels) 

    return (
        <>
            <Header pageRoute="collections" headerTitle='Management' />
            <section className="flex flex-col !min-h-[calc(100vh-177px)]">
                <ManagerClient pendingModels={pendingModelsJson} katId={process.env.KAT_JIRA_ID as string} hunterId={process.env.hunter_JIRA_ID as string} />
            </section>
            <Foot />
        </>
    )
}