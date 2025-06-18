import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Foot from "@/components/Shared/Foot"
import { getPendingModels } from "@/functions/server/queries"
import { getPublishedModels } from "@/functions/server/queries"
import { redirect } from "next/navigation"
import { updateThumbUrl } from "@/functions/server/queries"
import { ModelsWithTagsAndSoftware } from "@/ts/types"
import dynamic from 'next/dynamic'
import { getAccountProviders } from "@/functions/server/queries"
import { Account } from "@prisma/client"
import { getSubmittalSoftware } from "@/functions/server/queries"
import { getSubmittalTags } from "@/functions/server/queries"
const DashboardClient = dynamic(() => import('@/components/Dashboard/DashboardClient'))
const Header = dynamic(() => import('@/components/Header/Header'))

export default async function Page() {

    // Typical AUTH redirect

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        redirect('/api/auth/signin')
    }

    // Variable initialization

    let model: ModelsWithTagsAndSoftware
    let thumbUrl: string = ''
    let latestPublishedModelUid: string = ''
    let userId: string | undefined
    let providers: Account[] = []
    let iNatProvider: boolean = false
    let iNatId: string = ''
    let iNatTokenExpiration: number = 0

    // Sastifying header typescript

    const requestHeader: HeadersInit = new Headers()
    requestHeader.set('Authorization', process.env.SKETCHFAB_API_TOKEN as string)

    // Get user pending models

    const pendingModels: any = await getPendingModels(session.user.email as string)
    const numberOfPendingModels = pendingModels.length
    const anyPendingModels = numberOfPendingModels ? true : false

    for (let model in pendingModels) {
        let software = await getSubmittalSoftware(pendingModels[model].confirmation)
        pendingModels[model].software = software

        let tags = await getSubmittalTags(pendingModels[model].confirmation)
        let tagString: string = ''
        for (let tag in tags) {
            tagString += tags[tag] + ','
        }
        tagString = tagString.slice(0, -1)
        pendingModels[model].tags = tags
    }


    // Get user Published models

    const publishedModels: any = await getPublishedModels(session.user.email as string)
    const numberOfPublishedModels = publishedModels.length
    const anyPublishedModels = numberOfPublishedModels ? true : false
    latestPublishedModelUid = anyPublishedModels ? publishedModels[0].modeluid : ''

    for (let model in publishedModels) {
        let software = await getSubmittalSoftware(publishedModels[model].confirmation)
        publishedModels[model].software = software

        let tags = await getSubmittalTags(publishedModels[model].confirmation)
        let tagString: string = ''
        for (let tag in tags) {
            tagString += tags[tag] + ','
        }
        tagString = tagString.slice(0, -1)
        publishedModels[model].tags = tags
    }

    // Get/Set the name of the species active in the model viewer, or an empty string if none

    const anyModels = anyPendingModels || anyPublishedModels ? true : false
    let activeSpeciesName: string = ''
    if (anyModels) { activeSpeciesName = anyPublishedModels ? publishedModels[0].speciesName : pendingModels[0].speciesName }

    // This loop checks for updated model thumbnails. When models are first uploaded, the API
    // returns a default thumbnail. It can take 10 minutes or more for the actual thumbail (and url) to appear
    // after an admin has saved a thumbnail for a model. The updated url will contain the word 'models.'

    for (let i = 0; i < publishedModels.length; i++) {
        model = publishedModels[i]
        if (!(model.thumbnail.includes('models'))) {
            await fetch(`https://api.sketchfab.com/v3/models/${model.modeluid}`)
                .then(res => res.json())
                .then(data => thumbUrl = data.thumbnails.images[0].url)

            updateThumbUrl(thumbUrl, model.confirmation)
        }
    }

    // Check if user has linked/signed in with iNaturalist account and if so, when token expires

    if (session.user.email) {
        userId = session.user.id
        providers = await getAccountProviders(userId as string)
        for (let provider in providers) {
            if (providers[provider].provider == 'inaturalist') {
                iNatProvider = true
                iNatTokenExpiration = providers[provider].expires_at as number
                iNatId = providers[provider].providerAccountId as string
            }
            else continue
        }
    }

    return (
        <>
            <Header headerTitle="Dashboard" pageRoute="collections" />
            <DashboardClient 
                pendingModels={JSON.stringify(pendingModels)}
                publishedModels={JSON.stringify(publishedModels)}
                anyPendingModels={anyPendingModels}
                anyPublishedModels={anyPublishedModels}
                latestPublishedModelUid={latestPublishedModelUid}
                iNatAccountLinked={iNatProvider}
                tokenExpiration={iNatTokenExpiration}
                iNatUid={iNatId}
                activeSpeciesName={activeSpeciesName}
            />
            <Foot />
        </>
    )
}