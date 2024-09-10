import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import { getAllPendingModels } from "@/api/queries";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { management } from "@/utils/devAuthed"
import ManagerClient from "@/components/Admin/ManagerClient";

export default async function Page() {

    // management AUTH redirect

    const session = await getServerSession(authOptions)
    let email = session?.user?.email as string

    if (!management.includes(email)) {
        return <h1>NOT AUTHORIZED</h1>
    }

    const pendingModels = await getAllPendingModels()

    // const data = {
    //     fields: {
    //         project: {
    //             key: 'HERB',
    //         },
    //         parent: {
    //             key: 'HERB-59'
    //         },
    //         summary: `Annotate`,
    //         description: {
    //             type: 'doc',
    //             version: 1,
    //             content: [
    //                 {
    //                     type: 'paragraph',
    //                     content: [
    //                         {
    //                             type: 'text',
    //                             text: `Annotate`,
    //                         },
    //                     ],
    //                 },
    //             ],
    //         },
    //         issuetype: {
    //             name: 'Task',
    //         },
    //         assignee: {
    //             id: process.env.KAT_JIRA_ID
    //         }
    //     },
    // }

//     const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

//    await fetch('https://3dteam.atlassian.net/rest/api/3/issue/herb-59?', {
//         //@ts-ignore -- without the first two headers, data is not returned in English
//         headers: {
//             'X-Force-Accept-Language': true,
//             'Accept-Language': 'en',
//             'Authorization': `Basic ${base64}`,
//             'Content-Type': 'application/json',
//         },
//     })
//         .then(res => res.json())
//         .then(json => console.log(json))
//         .catch((e: any) => {console.log(e.message) })

    return (
        <>
            <Header pageRoute="collections" headerTitle='Management' />
            <section className="flex flex-col !min-h-[calc(100vh-177px)]">
                <ManagerClient pendingModels={pendingModels}/>
            </section>
            <Foot />
        </>
    )
}