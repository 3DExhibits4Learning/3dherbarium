import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import { getAllPendingModels } from "@/api/queries";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { management } from "@/utils/devAuthed"
import ManagerClient from "@/components/Admin/ManagerClient"
import nodemailer from 'nodemailer'


export default async function Page() {

    // management AUTH redirect

    const session = await getServerSession(authOptions)
    let email = session?.user?.email as string

    if (!management.includes(email)) {
        return <h1>NOT AUTHORIZED</h1>
    }

    const pendingModels = await getAllPendingModels()

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

    // const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: parseInt(process.env.EMAIL_SERVER_PORT as string),
    //     secure: true,
    //     auth: {
    //         user: process.env.EMAIL_SERVER_USER,
    //         pass: process.env.EMAIL_SERVER_PASSWORD
    //     }
    // })

    // await transporter.sendMail({
    //     from: process.env.EMAIL_FROM,
    //     to: 'ab632@humboldt.edu',
    //     subject: 'Notification',
    //     text: 'This is a notification',
    //     html: 'This is an <b>IMPORTANT</b> notification'
    // }).catch((e: any) => console.log(e.message))



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