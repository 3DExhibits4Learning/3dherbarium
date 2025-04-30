/**
 * @file src/components/Search/ThumbnailSection.tsx
 * 
 * @fileoverview Section of thumbnails (12)
 */

'use client'

// Typical imports
import { fullUserSubmittal } from "@/ts/types"
import { model, userSubmittal } from "@prisma/client"

// Default imports
import HerbariumCard from "@/components/Search/HerbariumCard"
import CommunityCard from "@/components/Search/CommunityCard"

// Main JSX
export default function ThumbnailSection(props: { filteredModels: (model | fullUserSubmittal)[] }) {
    return <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  gap-4 mx-5'>
        {props.filteredModels && props.filteredModels.map((model: model | fullUserSubmittal, index: number) => {
            return <>
                {Object.keys(model).includes('spec_name') && <HerbariumCard key={(model as model).uid} model={model as model} />}
                {Object.keys(model).includes('speciesName') && <CommunityCard key={(model as userSubmittal).confirmation} model={model as fullUserSubmittal} />}
            </>
        })}
    </section >
} 