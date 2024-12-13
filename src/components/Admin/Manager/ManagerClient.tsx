/**
 * @file src/components/Admin/ManagerClient.tsx
 * 
 * @fileoverview 
 * 
 * @todo move ID props from env or add NEXT_PUBLIC; they are not sensitive data
 */

'use client'

// Logic file import
import * as fn from "@/functions/client/admin/manager"

// Typical imports
import { userSubmittal } from "@prisma/client";
import { useRef, LegacyRef, useState, ChangeEvent} from "react";
import { Button } from "@nextui-org/react";

// Default imports
import DataTransferModal from "../../Shared/DataTransferModal";
import PendingModelsAdmin from "@/components/Admin/PendingModels";
import initializeDataTransfer from "@/functions/client/dataTransfer/initializeDataTransfer";
import terminateDataTransfer from "@/functions/client/dataTransfer/terminateDataTransfer";
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler";
import ProcurementTask from "./ProcurementTask";

// Main JSX
export default function ManagerClient(props: { pendingModels: string, katId: string, hunterId: string }) {

    // First we parse the strigified pending models and recreate the Date objects; finally declare/type pendingModels
    const models = JSON.parse(props.pendingModels)
    for (let model in models) {const time = Date.parse(models[model].dateTime); models[model].dateTime = new Date(time)}
    const pendingModels: userSubmittal[] = models

    // Refs
    const uid = useRef<HTMLInputElement>()
    const communityUid = useRef<HTMLInputElement>()

    // States
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>('')
    const [taskee, setTaskee] = useState<string>('Hunter')

    // Initialize/terminate data transfer handlers
    const initializeDataTransferHandler = (loadingLabel: string) => initializeDataTransfer(setOpenModal, setTransferring, setLoadingLabel, loadingLabel)
    const terminateDataTransferHandler = (result: string) => terminateDataTransfer(setResult, setTransferring, result)
    
    // Task handlers
    const thumbnailHandler = (uid: string, community: boolean) => dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, fn.updateThumbnail, [uid, community], "Updating thumbnail")
    const procurementTaskHandler = (assignee: string) => dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, fn.createProcurementTask, [assignee, props.katId, props.hunterId], "Creating task")

    return (
        <>
            <DataTransferModal open={openModal} setOpen={setOpenModal} transferring={transferring} loadingLabel={loadingLabel} result={result} />

            <div className="flex h-48 w-full mt-8">
                <ProcurementTask taskee={taskee} setTaskee={setTaskee} procurementTaskHandler={procurementTaskHandler}/>

                <div className="h-full w-1/3 flex flex-col items-center border border-[#004C46]">
                    <label className='text-2xl block mb-2'>Update Model Thumbnail</label>
                    <input
                        ref={uid as LegacyRef<HTMLInputElement>}
                        type='text'
                        className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                        placeholder="Enter UID"
                    >
                    </input>
                    <Button
                        className="w-1/2 text-white bg-[#004C46]"
                        onClick={() => thumbnailHandler((uid.current as HTMLInputElement).value, false)}
                    >
                        Update
                    </Button>
                </div>

                <div className="h-full w-1/3 flex flex-col items-center border border-[#004C46]">
                    <label className='text-2xl block mb-2'>Update Community Thumbnail</label>
                    <input
                        ref={communityUid as LegacyRef<HTMLInputElement>}
                        type='text'
                        className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                        placeholder="Enter UID"
                    >
                    </input>
                    <Button
                        className="w-1/2 text-white bg-[#004C46]"
                        onClick={() => thumbnailHandler((communityUid.current as HTMLInputElement).value, true)}
                    >
                        Update
                    </Button>
                </div>

            </div>
            {
                pendingModels &&
                //@ts-ignore - Typescript thinks decimal isn't assignable to number (it seems to be)
                <PendingModelsAdmin pendingModels={pendingModels} />
            }
        </>
    )
}