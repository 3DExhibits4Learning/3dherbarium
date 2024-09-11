import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import { getAllPendingModels } from "@/api/queries";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { management } from "@/utils/devAuthed"
import ManagerClient from "@/components/Admin/ManagerClient";
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter";

export default async function Page() {

    // management AUTH redirect

    const session = await getServerSession(authOptions)
    let email = session?.user?.email as string

    if (!management.includes(email)) {
        return <h1>NOT AUTHORIZED</h1>
    }

    const pendingModels = await getAllPendingModels()

    const data = {
        fields: {
            project: {
                key: 'HERB',
            },
            // parent: {
            //     key: 'HERB-59'
            // },
            summary: `Annotate`,
            description: {
                type: 'doc',
                version: 1,
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: `Annotate`,
                            },
                        ],
                    },
                ],
            },
            issuetype: {
                name: 'Task',
            },
            assignee: {
                id: process.env.KAT_JIRA_ID
            }
        },
    }

    const transitionData = {
        transition: {id: 31}
    } 

    //const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

    // await fetch(`https://3dteam.atlassian.net/rest/api/3/search?jql="parent" = HERB-47`, {
    //     //@ts-ignore -- without the first two headers, data is not returned in English
    //     headers: {
    //         'X-Force-Accept-Language': true,
    //         'Accept-Language': 'en',
    //         'Authorization': `Basic ${base64}`,
    //         'Content-Type': 'application/json',
    //     },
    // })
    //     .then(res => res.json())
    //     .then(json => {
    //         console.log(json.issues[1].fields)
    //     })
    //     .catch((e: any) => { console.log(e.message) })

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

    // const epic = await fetch(`https://3dteam.atlassian.net/rest/api/3/search?jql="parent" = HERB-59`, {
    //     //@ts-ignore -- without the first two headers, data is not returned in English
    //     headers: {
    //         'X-Force-Accept-Language': true,
    //         'Accept-Language': 'en',
    //         'Authorization': `Basic ${base64}`,
    //         'Content-Type': 'application/json',
    //     },
    // })
    //     .then(res => res.json())
    //     .then(json => json)

    // for (let i in epic.issues) {
    //     if (epic.issues[i].fields.summary.includes(`Annotate Linaria purpurea`)) {
    //         console.log('UNIT TEST PASSED')

            // const transitionData = {
            //     transition: { id: 31 }
            // }

        //     await fetch(`https://3dteam.atlassian.net/rest/api/3/issue/${epic.issues[i].key}/transitions`, {
        //         method: 'POST',
        //         //@ts-ignore -- without the first two headers, data is not returned in English
        //         headers: {
        //             'X-Force-Accept-Language': true,
        //             'Accept-Language': 'en',
        //             'Authorization': `Basic ${base64}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(transitionData)
        //     })
        //         .then(res => res.json())
        // }
    //}
//}

    return (
        <>
            <Header pageRoute="collections" headerTitle='Management' />
            <section className="flex flex-col !min-h-[calc(100vh-177px)]">
                <ManagerClient pendingModels={pendingModels} />
            </section>
            <Foot />
        </>
    )
}