/**
 * @file src/components/Admin/ManagerClient.tsx
 * 
 * @fileoverview management client
 * 
 * @todo move ID props from env or add NEXT_PUBLIC; they are not sensitive data
 * @todo consolidate update thumbnail components into one with a checkbox for community flag
 */

'use client'

// Logic file import
import * as fn from "@/functions/client/admin/manager"

// Typical imports
import { userSubmittal } from "@prisma/client"
import { useState } from "react"
import { Button } from "@heroui/react"
import { Models } from "@/ts/types"
import { migrateAnnotatedAndAnnotationModels, migrateModelAnnotationToAnnotatedModel, updateThumbnail } from "@/functions/server/manager"

// Default imports
import DataTransferModal from "../../Shared/DataTransferModal"
import PendingModelsAdmin from "@/components/Admin/Manager/PendingModels"
import initializeDataTransfer from "@/functions/client/dataTransfer/initializeDataTransfer"
import terminateDataTransfer from "@/functions/client/dataTransfer/terminateDataTransfer"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"

// Main JSX
export default function ManagerClient(props: { pendingModels: string, katId: string, hunterId: string }) {

    // First we parse the strigified pending models and recreate the Date objects; finally declare/type pendingModels
    const models = JSON.parse(props.pendingModels)
    for (let model in models) { const time = Date.parse(models[model].dateTime); models[model].dateTime = new Date(time) }
    const pendingModels: userSubmittal[] = models

    // Task field states
    const [uid, setUid] = useState('')
    const [communityUid, setCommunityUid] = useState('')
    const [annotationModelUid, setAnnotationModelUid] = useState('')

    // Data transfer states
    const [openModal, setOpenModal] = useState(false)
    const [transferring, setTransferring] = useState(false)
    const [result, setResult] = useState('')
    const [loadingLabel, setLoadingLabel] = useState('')

    // Initialize/terminate data transfer handlers
    const initializeDataTransferHandler = (loadingLabel: string) => initializeDataTransfer(setOpenModal, setTransferring, setLoadingLabel, loadingLabel)
    const terminateDataTransferHandler = (result: string) => terminateDataTransfer(setResult, setTransferring, result)

    // Task handlers
    const thumbnailHandler = (uid: string, community: boolean) => dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, updateThumbnail, [uid, community], "Updating thumbnail")
    const approveWrapper = (args: any[]) => dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, fn.approveCommunityModel, args, "Approving Community Model")
    const migrateWrapper = () => dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, migrateAnnotatedAndAnnotationModels, [], 'Migrating annotated 3D models')
    const migrateModelAnnotationWrapper = () => dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, migrateModelAnnotationToAnnotatedModel, [annotationModelUid], "Migrating model annotation")

    return <>
        <DataTransferModal open={openModal} setOpen={setOpenModal} transferring={transferring} loadingLabel={loadingLabel} result={result} />
        <div className="flex h-48 w-full">

            <div className="h-full w-1/3 flex flex-col items-center border border-[#004C46]">
                <label className='text-2xl block mb-2'>Update Model Thumbnail</label>
                <input
                    onChange={e => setUid(e.target.value)}
                    type='text'
                    className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                    placeholder="Enter UID">
                </input>
                <Button
                    className="w-1/2 text-white bg-[#004C46]"
                    onClick={() => thumbnailHandler(uid, false)}>
                    Update
                </Button>
            </div>

            <div className="h-full w-1/3 flex flex-col items-center border border-[#004C46]">
                <label className='text-2xl block mb-2'>Update Community Thumbnail</label>
                <input
                    onChange={e => setCommunityUid(e.target.value)}
                    type='text'
                    className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                    placeholder="Enter UID">
                </input>
                <Button
                    className="w-1/2 text-white bg-[#004C46]"
                    onClick={() => thumbnailHandler(communityUid, true)}>
                    Update
                </Button>
            </div>

            <div className="h-full w-1/3 flex flex-col items-center border border-[#004C46]">
                <label className='text-2xl block mb-2'>Annotated Model Migration</label>
                <Button className="bg-[#004C46] mt-14" onPress={migrateWrapper}>Migrate annotated 3D models</Button>
            </div>

            <div className="h-full w-1/3 flex flex-col items-center border border-[#004C46]">
                <label className='text-2xl block mb-2'>Add model annotation to existing model</label>
                <input
                    onChange={e => setAnnotationModelUid(e.target.value)}
                    type='text'
                    className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                    placeholder="Enter Model Annotation Uid">
                </input>
                <Button className="bg-[#004C46]" onPress={migrateModelAnnotationWrapper} isDisabled={annotationModelUid ? false : true}>Migrate annotated 3D models</Button>
            </div>
        </div>
        {pendingModels && <PendingModelsAdmin pendingModels={pendingModels as unknown as Models[]} approveWrapper={approveWrapper} />}
    </>
}