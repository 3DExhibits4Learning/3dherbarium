'use client'

import { Accordion, AccordionItem } from "@heroui/react";
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter";
import { PublishedModelProps, ModelsWithTagsAndSoftware } from "@/ts/types";
import EditModal from "./EditModal";
import { useState } from "react";
import ModelViewer from "../Shared/ModelViewer";
import Image from 'next/image'

export default function PublishedModels(props: PublishedModelProps) {

    const [editModel, setEditModel] = useState<ModelsWithTagsAndSoftware>(props.models[0])
    
    // Data transfer states
    const [open, setOpen] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [success, setSuccess] = useState<boolean | null>(null)

    return (
        <>
            <EditModal model={editModel} open={open} setOpen={setOpen} />
            <Accordion className='mb-24' selectedKeys={props.selectedKeys} onSelectionChange={props.setSelectedKeys} isCompact={true} fullWidth={false}>
                {
                    props.models.map((model, index) => {
                        return (
                            <AccordionItem className='font-medium' key={index} aria-label={model.speciesName} title={model.speciesName} classNames={{ title: 'italic' }}

                                // onPress would randomly require two presses for the callback function to fire about half the time
                                // onClick is 'deprecated,' but it appears to function properly here whereas onPress does not

                                onClick={() => {
                                    props.setViewerUid(model.modeluid)
                                    props.setPendingSelectedKeys(new Set(['']))
                                    props.setActiveSpeciesName(props.models[index].speciesName)
                                    setEditModel(props.models[index])
                                }}>

                                <div className="mb-2 hidden lg:flex w-full h-[400px] justify-center ">
                                    <div className="flex w-[70%] h-full relative"><Image src={model.thumbnail} alt={'Thumbnail for ' + model.speciesName} fill></Image></div>
                                </div>

                                <div className="flex justify-center mb-8">
                                    <div className="lg:hidden w-4/5 max-w-[650px] h-[300px]">
                                        <ModelViewer uid={model.modeluid} />
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 text-center'>

                                    <p className="border-b">Artist</p> <p className="border-b">{model.artistName}</p>
                                    {/*@ts-ignore - ts thinks dateTime is a Date object*/}
                                    <p className="border-b">Submitted</p> <p className="border-b"> {model.dateTime.slice(0, 10)}</p>
                                    <p className="border-b">Build Method</p> <p className="border-b"> {toUpperFirstLetter(model.methodology)}</p>

                                    {
                                        Boolean(model.createdWithMobile) &&
                                        <>
                                            <p className="border-b">Created with Mobile App</p>
                                            <p className="border-b">Yes</p>
                                        </>
                                    }

                                    {
                                        !Boolean(model.createdWithMobile) &&
                                        <>
                                            <p className="border-b">Created with Mobile App</p>
                                            <p className="border-b">No</p>
                                        </>
                                    }
                                    <p className="border-b">Model ID</p> <p className="border-b">{model.confirmation}</p>

                                    {
                                        model.software?.map((software, index) => {
                                            return (
                                                <>
                                                    <p key={index + 1000} className="border-b">Software {index + 1}</p> <p key={index + 2000} className="border-b">{software}</p>
                                                </>
                                            )
                                        })
                                    }

                                </div>

                                <p className="border-b text-center mt-1 pb-1">
                                    <button
                                        className='text-white text-[14px] bg-[#00856A] w-[70px] h-[23px] rounded-lg'
                                        onClick={() => setOpen(true)}
                                    >
                                        EDIT
                                    </button>
                                </p>
                            </AccordionItem>
                        )
                    })}
            </Accordion>
        </>
    )
}