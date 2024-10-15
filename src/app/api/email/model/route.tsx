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
            if (process.env.LOCAL_ENV === 'development') { console.error('Email or confirmation missing when trying to send confirmation email') }
            throw new Error("Missing email or confirmation")
        }

        // Send confirmation email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: '3D Model Submitted',
            html: `Thank you for contributing to the 3D Herbarium!
            <br><br>
            You can view the model in your dashboard under "Pending Models" and it should be published in a business day or two.
            <br><br>
            Confirmation: ${confirmation}
            <br>
            Status: Pending`
        }).catch((e: any) => {
            if (process.env.LOCAL_ENV === 'development') { console.error(e.message) }
            throw Error("Couldn't send email")
        })

        // Typical success return
        return Response.json({ data: 'Email Sent', response: "Email Sent" })
    }
    // Typical fail return
    catch (e: any) { return Response.json({ data: e.message, response: e.message }) }
}