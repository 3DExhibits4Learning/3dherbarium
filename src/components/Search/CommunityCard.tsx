/**
 * @file C:\Users\ab632\Documents\Code\3DExhibits4Learning\herbarium\src\components\Search\CommunityCard.tsx
 * 
 * @fileoverview community model 'card' displayed in the SearchPageModelList 
 * 
 * @todo add skeleton loader
 */

'use client'

// Typical imports
import { Chip } from "@heroui/react"
import { fullUserSubmittal } from "@/ts/types"
import { handleImgError } from "@/functions/client/utils/imageHandler"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { SyntheticEvent } from "react"

// Default imports
import noImage from '../../../public/noImage.png'
import Link from "next/link"

export default function CommunityCard(props: { model: fullUserSubmittal}) {

    // Props => variables
    const model = props.model

    return <div className='noselect'>
        
        <article className='rounded-md overflow-hidden mx-1'>
            
            <Chip size='lg' className='z-[1] absolute ml-4 mt-2 text-white bg-[#004C46]'>Community</Chip>
            
            <section className='rounded shadow-md mx-auto'>
                <Link href={"/collections/" + model.speciesName + `?communityId=${model.modeluid}`} tabIndex={-1} aria-label={`Go to a 3D model of ${model.speciesName} uploaded by a community member`}>
                    <img
                        alt={'Image of ' + model.speciesName}
                        role='button'
                        className='w-full h-[calc(100vh-275px)] min-h-[25rem] max-h-[30rem] object-cover relative z-5 rounded-t-md'
                        src={model.thumbnail ?? ''}
                        onError={(e: SyntheticEvent<HTMLImageElement, Event>) => handleImgError(e.currentTarget, noImage)}/>
                </Link>
            </section>
            
            <section className='bg-[#CDDAD5] dark:bg-[#3d3d3d] h-[5rem] max-h-[calc(100vh-300px)*0.2] opacity-[0.99] px-5 py-3 rounded-b-md text-center relative z-10 flex flex-col justify-center items-center space-y-1.5 mt-[-1px]'>
                
                <section className='flex items-center space-x-0.5rem'>
                    <Link
                        href={"/collections/" + model.speciesName}
                        rel='noopener noreferrer'
                        className='text-[#004C46] dark:text-[#C3D5D1] text-xl'>
                        <i className='font-medium'>{model.speciesName.charAt(0).toUpperCase() + model.speciesName.slice(1)}</i>
                    </Link>
                </section>
                
                <section className='text-md font-medium text-black dark:text-white'>{toUpperFirstLetter(model.commonName)}</section>
            
            </section>
        
        </article>
    
    </div >
}