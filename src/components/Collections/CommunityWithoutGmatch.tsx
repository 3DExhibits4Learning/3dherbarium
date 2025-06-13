'use client'

import { fullUserSubmittal } from "@/ts/types"
import { Divider } from "@heroui/react"
import { userSubmittal } from "@prisma/client"
import dynamic from "next/dynamic"
const ModelViewer = dynamic(() => import('@/components/Shared/ModelViewer'), {ssr: false})
const CommunityModalMap = dynamic(() => import('@/components/Map/CommunityModalMap'), {ssr: false})
import Image from "next/image"
import { useEffect, useState } from "react"

export default function CommunityModelWithoutGmatch(props: { communityModel: userSubmittal }) {

    const [model, setModel] = useState<userSubmittal | fullUserSubmittal>(props.communityModel)

    useEffect(() => {

        const getFullUserSubmittal = async () => {

            const tagsAndSoftware = await fetch(`/api/collections/communityHerbarium?confirmation=${props.communityModel.confirmation}&specimenName=${props.communityModel.speciesName}`)
                .then(res => res.json())
                .then(json => json.response)

            setModel({ ...props.communityModel, software: tagsAndSoftware[0], tags: tagsAndSoftware[1] })
        }
        
        getFullUserSubmittal()

    }, [])

return (
    <>
        <div className="bg-black flex h-[calc(100vh-177px)] w-full">

            <section className="w-full lg:w-3/5 h-full">
                <ModelViewer uid={model.modeluid} />
            </section>

            <section className="hidden lg:w-2/5 text-[#F5F3E7] h-full lg:flex lg:flex-col items-center">

                <div className="w-full h-1/3 mb-4">
                    <CommunityModalMap position={{ lat: model.lat as any, lng: model.lng as any }} />
                </div>

                <Divider />

                <section className="flex flex-col w-full">
                    <p className="lg:text-lg my-2">Species: <span className='text-[#FFC72C]'>{model.speciesName}</span></p>
                    <Divider />
                    <p className="lg:text-lg my-2">Artist: {model.artistName}</p>
                    <Divider />
                    {/*@ts-ignore - ts thinks dateTime is a Date object*/}
                    <p className="lg:text-lg my-2">Date: {model.dateTime.slice(0,10)}</p>
                    <Divider />
                    <p className="lg:text-lg my-2">Method: {model.methodology}</p>
                    <Divider />

                    {
                        model.createdWithMobile &&
                        <>
                            <div className="flex items-center">
                                <div className='relative h-[24px] w-[24px] inline-block my-2'>
                                    <Image src='../../../cellPhone.svg' alt='Mobile Device Icon' fill></Image>
                                </div>
                                <span className="ml-1">Made with mobile app</span>
                            </div>
                            <Divider />
                        </>
                    }

                    {
                        (model as fullUserSubmittal)?.tags?.length > 0 &&
                        <div className="flex items-center h-fit mt-1">
                            <div className='relative h-[24px] w-[24px] mr-2 mt-2'>
                                <Image src='../../../tagSvg.svg' alt='Tag Icon' fill></Image>
                            </div>
                            {
                                ((model as fullUserSubmittal)).tags.map((tag: string, i: number) => {
                                    return (
                                        <p key={i} className="bg-[#004C46] dark:bg-[#E5E5E5] text-white dark:text-black mx-[3px] px-[8px] py-[4px] rounded-[3px] mt-[1%] border border-[#00856A] dark:border-none">{tag}</p>
                                    )
                                })

                            }

                        </div>
                    }

                    {
                        (model as fullUserSubmittal)?.software?.length > 0 &&
                        <div className="flex items-center h-fit mt-1">
                            <div className='relative h-[24px] w-[24px] mr-2 mt-1'>
                                <Image src='../../../desktopSvg.svg' alt='Computer Icon' fill></Image>
                            </div>
                            {
                                (model as fullUserSubmittal)?.software?.map((software: string, i: number) => {
                                    return (
                                        <p key={i} className="bg-[#004C46] dark:bg-[#E5E5E5] text-white dark:text-black mx-[3px] px-[8px] py-[4px] rounded-[3px] mt-[1%] border border-[#00856A] dark:border-none">{software}</p>
                                    )
                                })
                            }
                        </div>
                    }
                </section>
            </section>
        </div>
    </>
)
}