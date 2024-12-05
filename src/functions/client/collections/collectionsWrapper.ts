'use client'

import { CollectionsWrapperProps } from "@/ts/collections"
import { SetStateAction, Dispatch} from "react"
import { userSubmittal } from "@prisma/client"

export const getCommunityModel = (context: CollectionsWrapperProps, communityId: string | null, setUserModels: Dispatch<SetStateAction<userSubmittal | undefined>>, setIdError: Dispatch<SetStateAction<boolean>>) => {

    switch (communityId) {

        case (null):

            if (!context.model.length) {
                const getCommunityModel = async () => {
                    const userModels = await fetch(`/api/collections/models/community/speciesSearch?species=${context.specimenName}`)
                        .then(res => res.json()).then(json => json.response)

                    if (userModels.length) setUserModels(userModels[0])
                }
                getCommunityModel()
            }

            break

        default:

            const getCommunityModel = async () => {
                const userModel = await fetch(`/api/collections/models/community/uidSearch?uid=${communityId}`)
                    .then(res => res.json()).then(json => json.response)

                if (userModel) setUserModels(userModel)
                else setIdError(true)
            }
            getCommunityModel()

            break
    }
}