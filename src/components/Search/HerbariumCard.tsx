/**
 * @file src/components/Search/HerbariumCard.tsx
 * 
 * @fileoverview herbarium model 'card' displayed in the SearchPageModelList
 */

'use client'

// Typical imports
import { handleImgError } from "@/functions/client/utils/imageHandler"
import { model } from "@prisma/client"
import { SyntheticEvent, useEffect, useState } from "react"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { Chip, Skeleton } from "@heroui/react"
import { configureNfsUrl } from "@/functions/client/utils"
import { isMobileOrTablet } from "@/functions/client/utils/isMobile"

// Default imports
import Link from "next/link"
import noImage from "../../../public/noImage.png"
import MobileAnnotationModelModal from "@/components/Search/MobileAnnotationModel"

// Main JSX
export default function HerbariumCard(props: { model: model }) {

    // Props => variables
    const model = props.model

    // Determine hyperlink URL based on whether or not the model is a base model; determine thumbnail path
    const href = model.base_model ? `/collections/${model.spec_name}` : `/collections/${model.spec_name}?annotation=${model.annotation_number}`
    const thumbnailPath = model.thumbnail.includes('/data/Herbarium/thumbnails') ? configureNfsUrl(model.thumbnail) : model.thumbnail

    // Mobile annotation modal state
    const [mobileAnnotationModalOpen, setMobileAnnotationModalOpen] = useState(false)
    const [src, setSrc] = useState('')

    const setPhotoSrc = async () => {
        await fetch(thumbnailPath)
            .then(res => {
                if (!res.ok) setSrc('/noImage.png')
                else return res.blob()
            })
            .then(blob => setSrc(URL.createObjectURL(blob as Blob)))
    }

    useEffect(() => { setPhotoSrc() }, [])

    return <>
        <div className='noselect'>
            {!model.base_model && mobileAnnotationModalOpen && <MobileAnnotationModelModal isOpen={mobileAnnotationModalOpen} model={model} setIsOpen={setMobileAnnotationModalOpen} />}

            <article className='rounded-md overflow-hidden mx-1'>

                {!model.base_model && <Chip size='lg' className='z-[1] absolute ml-4 mt-2 text-white bg-[#004C46]'>Annotation</Chip>}

                {
                    !src &&
                    <section className='rounded shadow-md mx-auto'>
                        <Skeleton className="w-full h-[calc(100vh-275px)] min-h-[25rem] max-h-[30rem]" />
                    </section>
                }

                {
                    (!isMobileOrTablet() || isMobileOrTablet() && model.base_model) && src &&
                    <section className='rounded shadow-md mx-auto'>
                        <Link href={href} tabIndex={-1} aria-label={`Go to a 3D Model for ${model.spec_name}, also known as ${model.pref_comm_name}`}>
                            <img
                                alt={'Image of ' + model.spec_name}
                                role='button'
                                src={thumbnailPath}
                                className='w-full h-[calc(100vh-275px)] min-h-[25rem] max-h-[30rem] object-cover relative z-5 rounded-t-md'
                                onError={(e: SyntheticEvent<HTMLImageElement, Event>) => { handleImgError(e.currentTarget, noImage) }} />
                        </Link>
                    </section>
                }

                {
                    isMobileOrTablet() && !model.base_model && src &&
                    <section className='rounded shadow-md mx-auto'>
                        <img
                            alt={'Image of ' + model.spec_name}
                            role='button'
                            src={thumbnailPath}
                            className='w-full h-[calc(100vh-275px)] min-h-[25rem] max-h-[30rem] object-cover relative z-5 rounded-t-md'
                            onClick={() => setMobileAnnotationModalOpen(true)}
                            onError={(e: SyntheticEvent<HTMLImageElement, Event>) => { handleImgError(e.currentTarget, noImage) }} />
                    </section>
                }

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
    </>
}