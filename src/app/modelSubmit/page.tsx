import ModelSubmitForm from "@/components/ModelSubmit/Form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Header from '@/components/Header/Header'
import Foot from "@/components/Shared/Foot"

export default async function Page() {
    
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        redirect('/api/auth/signin')
    }

    return (
        <>
            <Header headerTitle='Submit a 3D Model' pageRoute='modelSubmit' />
            <ModelSubmitForm />
            <Foot />
        </>
    )
}