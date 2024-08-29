import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import ModelerDash from "@/components/Admin/ModelerDash";
import { getSpecimenWithoutPhotos, getSpecimenToModel } from "@/api/queries";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { management, modeler } from "@/utils/devAuthed"

export default async function Page() {

    // management/modeler AUTH redirect

    const session = await getServerSession(authOptions)
    let email = session?.user?.email as string
    if (!management.includes(email) && !modeler.includes(email)) {
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