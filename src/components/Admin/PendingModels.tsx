'use client'

import { ApproveModelObject, Models } from "@/api/types"
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import checkToken from "@/utils/checkToken";
import DataTransferModal from "../Shared/DataTransferModal";

const ModelViewer = dynamic(() => import('../Shared/ModelViewer'), { ssr: false })

export default function PendingModelsAdmin(props: { pendingModels: Models[] }) {

    const approvable = props.pendingModels[0]?.thumbnail.includes('models')
    const [approvalDisabled, setApprovalDisabled] = useState<boolean>(!approvable)
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set(["0"]))
    const [open, setOpen] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [photoFiles, setPhotoFiles] = useState<string[]>()

    const updateAccordionItemState = (index: number) => {
        const approvable = props.pendingModels[index].thumbnail.includes('models')
        setApprovalDisabled(!approvable)
    }

    const approve = async (index: number, wild: boolean) => {

        try{
            
            await checkToken('inaturalist')
            setTransferring(true)
            setOpen(true)
            const model = props.pendingModels[index]
            
            const approveModelObject: ApproveModelObject = {
                confirmation: model.confirmation,
                species: model.speciesName,
                latitude: model.lat,
                longitude: model.lng,
                files: photoFiles as string[],
                wild: wild
            }
            
            await fetch('/api/approveModel', {
                method: 'POST',
                body: JSON.stringify(approveModelObject)
            })
                .then(res => {
                    if(!res.ok ){ throw Error(res.statusText)}
                    return res.json()
                })
                .then(json => {
                    setResult(json.data)
                    setTransferring(false)
                })
                .catch((e) => {throw Error(e.message)})
        }
        catch(e: any){
            setResult(e.message)
            setTransferring(false)
        }
    }

    const getPhotoFiles = async (confirmation: string) => {

        await fetch(`/api/admin/manager/photoFiles?path=public/data/Herbarium/tmp/submittal/${confirmation}`)
            .then(res => res.json())
            .then(json => setPhotoFiles(json.response))
    }

    useEffect(() => {
        getPhotoFiles(props.pendingModels[0].confirmation)
    }, [])

    return (
        <>
            <DataTransferModal open={open} setOpen={setOpen} transferring={transferring} loadingLabel='Approving 3D Model' result={result}/>
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
                                updateAccordionItemState(index)
                                getPhotoFiles(model.confirmation)
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
                                            <Button isDisabled={approvalDisabled} className="text-white font-medium" onPress={() => approve(index, false)}>Approve</Button>
                                        </div>

                                        <div className="mb-12">
                                            <Button isDisabled={approvalDisabled} className="text-white font-medium" onPress={() => approve(index, true)}>Approve Wild</Button>
                                        </div>

                                        <div>
                                            <Button color='danger' variant='light' className="font-medium" onPress={() => approve(index, true)}>Quick Approve</Button>
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