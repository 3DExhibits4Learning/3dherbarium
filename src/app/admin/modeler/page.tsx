/**
 * @file src\app\admin\modeler\page.tsx
 * 
 * @fileoverview server component for 3D modeler admin
 */

import { getSpecimenWithoutPhotos, getSpecimenToModel } from "@/api/queries";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAdmin } from "@/api/queries";
import { authed } from "@prisma/client";

import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import ModelerDash from "@/components/Admin/Modeler/ModelerDash";

export default async function Page() {

    // management/modeler AUTH redirect

    const session = await getServerSession(authOptions)
    let email = session?.user?.email as string
    const admin = await getAdmin(email) as authed
    
    if (!['Director', '3D Modeler'].includes(admin.role)) {
        return <h1>NOT AUTHORIZED</h1>
    }

    const specimenToImage: any = await getSpecimenWithoutPhotos()
    const specimenToModel: any = await getSpecimenToModel()

    return (
        <>
            <Header pageRoute="/collections" headerTitle='3D Model Admin' />
            <section className="flex min-h-[calc(100vh-177px)]">
                <ModelerDash unphotographedSpecimen={specimenToImage} unModeledSpecimen={specimenToModel} />
            </section>
            <Foot />
        </>
    )
}