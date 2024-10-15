/**
 * @file /api/email/model.tsx
 * @fileoverview Route handler that sends a confirmation email upon successful community model upload
 */

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { transporter } from '@/utils/Email/transporter'

export async function POST(request: Request) {

    try {

        // Get email and confirmation
        const session = await getServerSession(authOptions)
        const email = session.user.email
        const { searchParams } = new URL(request.url)
        const confirmation = searchParams.get('confirmation')

        // Throw error if either is missing
        if (!email || !confirmation) {
            console.error('Email or confirmation missing when trying to send confirmation email')
            throw new Error("Missing email or confirmation")
        }

        // Send confirmation email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: 'ab632@humboldt.edu',
            subject: '3D Model Submitted',
            html: `User Email: ${email}
            <br><br>
            Confirmation: ${confirmation}`
        }).catch((e: any) => {
            console.error(e.message)
            throw Error("Couldn't send email")
        })

        // Typical success return
        return Response.json({ data: 'Email Sent', response: "Email Sent" })
    }
    // Typical fail return
    catch (e: any) { return Response.json({ data: e.message, response: e.message }, {status:400, statusText: e.message}) }
}