/**
 * @file src/components/Admin/PendingModels.tsx
 * 
 * @fileoverview displays pending community model submissions
 */

'use client'

// Logic file import
import * as fn from "@/functions/client/admin/manager"

// Typical imports
import { Models } from "@/ts/types"
import { Accordion, AccordionItem } from "@heroui/react";
import { Button } from "@heroui/react";
import { useState, useEffect, SetStateAction, Dispatch } from "react";

// Default imports
import dynamic from "next/dynamic";

// Dynamic imports
const ModelViewer = dynamic(() => import('../../Shared/ModelViewer'), { ssr: false })

// Main JSX
export default function PendingModelsAdmin(props: { pendingModels: Models[], approveWrapper: Function }) {

    // Presence of the following term in the thumbnail indicates that it is a non default thumbnail
    const approvable = props.pendingModels[0]?.thumbnail.includes('models')
    
    // States
    const [approvalDisabled, setApprovalDisabled] = useState<boolean>(!approvable)
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set(["0"]))
    const [photoFiles, setPhotoFiles] = useState<string[]>()

    // Get photo files of first community submission if there are any
    useEffect(() => { if (props.pendingModels.length) fn.getPhotoFiles(props.pendingModels[0].confirmation, setPhotoFiles as Dispatch<SetStateAction<string[]>>) }, [])

    return (
        <>
            <h1 className="text-3xl mt-4 border-b-1 border-[#004C46] pb-4 mb-4">Pending Models</h1>
            <Accordion selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys} isCompact={true} fullWidth={false} title="Pending Models">
                {
                    props.pendingModels.map((model, index) =>
                        <AccordionItem className='font-medium'
                            key={index}
                            aria-label={model.speciesName}
                            title={model.speciesName}
                            classNames={{ title: 'italic' }}
                            onPress={() => {
                                fn.updateAccordionItemState(index, props.pendingModels, setApprovalDisabled)
                                fn.getPhotoFiles(model.confirmation, setPhotoFiles as Dispatch<SetStateAction<string[]>>)
                            }}
                        >
                            <div className="flex flex-col">
                                <section className="flex justify-around items-center">
                                    <div className="w-1/3 flex text-center flex-col">
                                        <p>Confirmation Number: {model.confirmation}</p>
                                        <p>Artist: {model.artistName}</p>
                                        <p>Submitted: {model.dateTime.toDateString()}</p>
                                    </div>
                                    <div className="w-1/3 h-[300px] mb-4">
                                        <ModelViewer uid={model.modeluid} />
                                    </div>
                                    <div className="w-1/3 flex justify-center items-center flex-col">
                                        <div className="mb-12">
                                            <Button isDisabled={approvalDisabled} className="text-white font-medium" onPress={() => props.approveWrapper([props.pendingModels[index], false, photoFiles as string[]])}>Approve</Button>
                                        </div>
                                        <div className="mb-12">
                                            <Button isDisabled={approvalDisabled} className="text-white font-medium" onPress={() => props.approveWrapper([props.pendingModels[index], true, photoFiles as string[]])}>Approve Wild</Button>
                                        </div>
                                        <div>
                                            <Button color='danger' variant='light' className="font-medium" onPress={() => props.approveWrapper([props.pendingModels[index], false, photoFiles as string[]])}>Quick Approve</Button>
                                        </div>
                                    </div>
                                </section>
                                <section className="w-full h-[300px] flex">
                                    {
                                        photoFiles && !!photoFiles.length &&
                                        photoFiles.map((fileName) =>
                                            <div key={Math.random()} className="w-[18%] h-[300px] mx-[1%]">
                                                <img className='w-full h-full' key={Math.random()} src={`/api/nfs?path=public/data/Herbarium/tmp/submittal/${model.confirmation}/${fileName}`}></img>
                                            </div>
                                        )
                                    }
                                </section>
                            </div>
                        </AccordionItem>
                    )}
            </Accordion>
        </>
    )
}