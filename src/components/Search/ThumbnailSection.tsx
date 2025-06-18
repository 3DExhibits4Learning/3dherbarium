/**
 * @file src/components/Search/ThumbnailSection.tsx
 * 
 * @fileoverview Section of thumbnails (12)
 */

'use client'

// Typical imports
import { fullUserSubmittal } from "@/ts/types"
import { model, userSubmittal } from "@prisma/client"
import { Fragment } from "react"

// Default imports
import HerbariumCard from "@/components/Search/HerbariumCard"
import CommunityCard from "@/components/Search/CommunityCard"

// Main JSX
export default function ThumbnailSection(props: { filteredModels: (model | fullUserSubmittal)[] }) {
    return <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mx-5 mb-4'>
        {
            props.filteredModels && props.filteredModels.map((model: model | fullUserSubmittal) => <Fragment key={(model as model).uid ?? (model as userSubmittal).confirmation}>
                {Object.keys(model).includes('spec_name') && <HerbariumCard model={model as model} />}
                {Object.keys(model).includes('speciesName') && <CommunityCard model={model as fullUserSubmittal} />}
            </Fragment>)
        }
    </section >
} 