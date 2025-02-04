/**
 * @file src/components/Search/HerbariumCard.tsx
 * 
 * @fileoverview herbarium model 'card' displayed in the SearchPageModelList
 */

'use client'

// Typical imports
import { handleImgError } from "@/utils/imageHandler"
import { model } from "@prisma/client"
import { SyntheticEvent } from "react"
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter"

// Default imports
import Link from "next/link"
import noImage from "../../../public/noImage.png"

export default function HerbariumCard(props: { index: number, model: model }) {

    // Props => variables
    const index = props.index
    const model = props.model

    // Determine hyperlink URL based on whether or not the model is a base model
    const href = model.base_model ? `/collections/${model.spec_name}` : `/collections/${model.spec_name}?annotation=${model.annotation_number}`

    return <div key={index} className='noselect'>

        <article className='rounded-md overflow-hidden mx-1'>

            <section className='rounded shadow-md mx-auto'>
                <Link href={href} tabIndex={-1}>
                    <img
                        alt={'Image of ' + model.spec_name}
                        role='button'
                        src={model.thumbnail ?? ''}
                        className='w-full h-[calc(100vh-275px)] min-h-[25rem] max-h-[30rem] object-cover relative z-5 rounded-t-md'
                        onError={(e: SyntheticEvent<HTMLImageElement, Event>) => { handleImgError(e.currentTarget, noImage); }} />
                </Link>
            </section>

            <section className='bg-[#CDDAD5] dark:bg-[#3d3d3d] h-[5rem] max-h-[calc(100vh-300px)*0.2] opacity-[0.99] px-5 py-3 rounded-b-md text-center relative z-10 flex flex-col justify-center items-center space-y-1.5 mt-[-1px]'>

                <section className='flex items-center space-x-0.5rem'>
                    <Link href={"/collections/" + model.spec_name} rel='noopener noreferrer' className='text-[#004C46] dark:text-[#C3D5D1] text-xl'>
                        <i className='font-medium'>{model.spec_name.charAt(0).toUpperCase() + model.spec_name.slice(1)}</i>
                    </Link>
                </section>

                <section className='text-md font-medium text-black dark:text-white'>{toUpperFirstLetter(model.pref_comm_name)}</section>

            </section>

        </article>

    </div>
}