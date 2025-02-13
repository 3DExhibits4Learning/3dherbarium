import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Header from "@/components/Header/Header"
import Foot from "@/components/Shared/Foot"
import { userIsAdmin } from "@/functions/server/queries"

export default async function Page() {

    // admin AUTH redirect

    const session = await getServerSession(authOptions)

    const email = session?.user?.email as string; var isAdmin
    if (email) isAdmin = await userIsAdmin(email)
    

    if (!isAdmin) {
        return <h1>NOT AUTHORIZED</h1>
    }
    
    return (
        <>
            <Header headerTitle="admin" pageRoute="admin" />
            <div className='flex min-h-[calc(100vh-177px)] justify-center items-center text-3xl'>
                <ul>
                    <li className="mb-8 hover:underline"><a href='/admin/management'>Management</a></li>
                    <li className="mb-8 hover:underline"><a href='/admin/modeler'>3D Modeler</a></li>
                    <li className="hover:underline"><a href='/admin/botanist'>Botanist</a></li>
                </ul>
            </div>
            <Foot />
        </>
    )
}