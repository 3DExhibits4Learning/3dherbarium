/**
 * @file src/app/modelSubmit/page.tsx
 * 
 * @fileoverview server modelSubmit page
 */

// Typical imports
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

// Default imports
import Header from '@/components/Header/Header'
import Foot from "@/components/Shared/Foot"
import ModelSubmitForm from "@/components/ModelSubmit/Form"
import FullPageError from "@/components/Error/FullPageError"
import { serverErrorHandler } from "@/functions/server/error"

// Path
const path = 'src/app/modelSubmit/page.tsx'

/**
 * 
 * @returns header, modelSubmitForm, footer
 */
export default async function Page() {

    try {
        
        // await session, redirect if there isn't a session
        const session = await getServerSession(authOptions).catch(e => serverErrorHandler(path, e.message, "Couldn't get session", "getServerSession()", false))
        if (!session || !session.user) redirect('/api/auth/signin')
        
        // Note there is no client wrapper; just header => form => footer
        return (
            <>
                <Header headerTitle='Submit a 3D Model' pageRoute='modelSubmit' />
                <ModelSubmitForm />
                <Foot />
            </>
        )
    }
    // Typical catch
    catch(e: any){return <FullPageError clientErrorMessage={e.message}/>}
}