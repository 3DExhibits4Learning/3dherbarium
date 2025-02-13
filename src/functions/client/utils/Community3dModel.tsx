'use client'

import { GbifImageResponse, GbifResponse } from "@/ts/types";
import { userSubmittal } from "@prisma/client";

export default class CommunityHerbarium {

    software: string[]
    tags: string[]
    gMatch: { hasInfo: boolean; data?: GbifResponse }
    summary: any
    images: GbifImageResponse[]
    commonNames: string[]
    profile: any
    model: userSubmittal
    imageTitle: string

    private constructor(software: string[], tags: string[], gMatch: { hasInfo: boolean; data?: GbifResponse }, summary: any, images: GbifImageResponse[], commonNames: string[], profile: any, model: userSubmittal, imageTitle: string) {
        this.software = software
        this.tags = tags
        this.gMatch = gMatch
        this.summary = summary
        this.images = images
        this.commonNames = commonNames
        this.profile = profile
        this.model = model
        this.imageTitle = imageTitle
    }

    static async model(model: userSubmittal, gMatch: {hasInfo: boolean, data?:GbifResponse}, images: GbifImageResponse[], imageTitle: string) {

        const data = await fetch(`/api/collections/communityHerbarium?confirmation=${model.confirmation}&usageKey=${gMatch.data?.usageKey}&specimenName=${model.speciesName}`)
        .then(res => res.json())
        .then(json => json.response)

        return new CommunityHerbarium(data[0], data[1], gMatch, data[2], images, data[3], data[4], model, imageTitle)
    }

}