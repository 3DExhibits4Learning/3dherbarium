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

    const pendingModels = await getAllPendingModels()

    return (
        <>
            <Header pageRoute="collections" headerTitle='Management' />
            <section className="flex flex-col !min-h-[calc(100vh-177px)]">
                <ManagerClient pendingModels={pendingModels} katId={process.env.KAT_JIRA_ID as string} hunterId={process.env.hunter_JIRA_ID as string} />
            </section>
            <Foot />
        </>
    )
}
//const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

// await fetch(`https://3dteam.atlassian.net/rest/api/3/issue/HERB-74/transitions`, {
//     method: 'POST',
//     //@ts-ignore -- without the first two headers, data is not returned in English
//     headers: {
//         'X-Force-Accept-Language': true,
//         'Accept-Language': 'en',
//         'Authorization': `Basic ${base64}`,
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(transitionData)
// })
//     .then(res => res.json())
//     .then(json => {
//         console.log(json)
//     })
//     .catch((e: any) => { console.log(e.message) })

// const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

//console.log(new Date().toLocaleDateString())