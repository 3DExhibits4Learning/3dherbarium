'use client'

import { fullUserSubmittal } from "@/ts/types"
import { model } from "@prisma/client"

import HerbariumCard from "@/components/Search/HerbariumCard"
import CommunityCard from "@/components/Search/CommunityCard"

export default function ThumbnailSection(props: { filteredModels: model[] | fullUserSubmittal[] }) {
    return <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  gap-4 mx-5'>
        {props.filteredModels && props.filteredModels.map((model: model | fullUserSubmittal, index: number) => {
            return <>
                {Object.keys(model).includes('spec_name') && <HerbariumCard index={index} model={model as model} />}
                {Object.keys(model).includes('speciesName') && <CommunityCard index={index} model={model as fullUserSubmittal} />}
            </>
        })}
    </section >
} 