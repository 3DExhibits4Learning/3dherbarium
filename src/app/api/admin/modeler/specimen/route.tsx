import { specimenInsertion } from "@/api/types"
import prisma from "@/utils/prisma"
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter"
import markIssueAsDone from "@/utils/Jira/markIssueAsDone"
import createTask from "@/utils/Jira/createTask"

export async function POST(request: Request){
    const specimen = await request.json() as specimenInsertion
    
    try {
        const speciesCheck = await prisma.species.findUnique({
            where: {
                spec_name: specimen.species.toLowerCase()
            }
        })

        if (!speciesCheck) {
            await prisma.species.create({
                data: {
                    spec_name: specimen.species.toLowerCase(),
                    genus: specimen.genus.toLowerCase(),
                    is_local: specimen.isLocal
                }
            })
        }

        const insert = await prisma.specimen.create({
            data: {
                spec_name: specimen.species.toLowerCase(),
                spec_acquis_date: new Date(specimen.acquisitionDate),
                procurer: specimen.procurer
            }
        })

        await markIssueAsDone('HERB-59', `Procure specimen ${new Date().toLocaleDateString()}`).catch() // TODO: Send Email
        const task = await createTask('HERB-59', `Photograph ${toUpperFirstLetter(specimen.species)}`, `Photograph ${toUpperFirstLetter(specimen.species)}`, process.env.HUNTER_JIRA_ID as string) .catch() // TODO: Send Email

        return Response.json({ data: 'Specimen Entered Successfully', response: insert, task })
    }
    catch (e: any) { return Response.json({ data: e.message, response: 'Prisma Error' }, { status: 400, statusText: 'Prisma Error' }) }
}