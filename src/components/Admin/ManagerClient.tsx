'use client'

import { userSubmittal } from "@prisma/client";
import { useRef, LegacyRef, useState } from "react";
import PendingModelsAdmin from "@/components/Admin/PendingModels";
import { Button } from "@nextui-org/react";
import DataTransferModal from "../Shared/DataTransferModal";

export default function ManagerClient(props: { pendingModels: userSubmittal[] }) {

    const uid = useRef<HTMLInputElement>()

    const [openModal, setOpenModal] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')

    const updateThumbnail = async (uid: string) => {

        setOpenModal(true)
        setTransferring(true)

        const res = await fetch(`/api/sketchfab/thumbnail?uid=${uid}&nonCommunity=true`)
            .then(res => res.json())
            .then(res => {
                console.log(res.response)
                setResult(res.data)
                setTransferring(false)
            })
    }

    return (
        <>
            <DataTransferModal open={openModal} setOpen={setOpenModal} transferring={transferring} loadingLabel="Updating Thumbnail" result={result} />
            <div className="flex h-48 w-full">
                <div className="h-full w-1/3 flex flex-col items-center">
                    <label className='text-2xl block mb-2'>Model UID</label>
                    <input
                        ref={uid as LegacyRef<HTMLInputElement>} type='text'
                        className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                    >
                    </input>
                    <Button
                        className="w-1/2 text-white"
                        onClick={() => updateThumbnail((uid.current as HTMLInputElement).value)}
                    >
                        Update User Thumbnail
                    </Button>
                </div>
            </div>
            {
                props.pendingModels &&
                //@ts-ignore - Typescript thinks decimal isn't assignable to number (it seems to be)
                <PendingModelsAdmin pendingModels={props.pendingModels} />
            }
        </>
    )
}