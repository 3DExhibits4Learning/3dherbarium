'use client'

import { userSubmittal } from "@prisma/client";
import { useRef, LegacyRef, useState, ChangeEvent } from "react";
import PendingModelsAdmin from "@/components/Admin/PendingModels";
import { Button } from "@nextui-org/react";
import DataTransferModal from "../Shared/DataTransferModal";

export default function ManagerClient(props: { pendingModels: userSubmittal[], katId: string, hunterId: string }) {

    const uid = useRef<HTMLInputElement>()
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [taskee, setTaskee] = useState<string>('Hunter')

    const updateThumbnail = async (uid: string) => {

        setOpenModal(true)
        setTransferring(true)

        await fetch(`/api/sketchfab/thumbnail?uid=${uid}&nonCommunity=true`)
            .then(res => res.json())
            .then(res => {
                console.log(res.response)
                setResult(res.data)
                setTransferring(false)
            })
    }

    const createProcurementTask = async (assignee: string) => {

        const assigneeId = assignee === 'Hunter' ? props.hunterId : props.katId

        const data = {
            fields: {
                project: {
                    key: 'HERB',
                },
                parent: {
                    key: 'HERB-59'
                },
                summary: `Procure ${new Date().toLocaleDateString}`,
                description: {
                    type: 'doc',
                    version: 1,
                    content: [
                        {
                            type: 'paragraph',
                            content: [
                                {
                                    type: 'text',
                                    text: `Procure ${new Date().toLocaleDateString}`,
                                },
                            ],
                        },
                    ],
                },
                issuetype: {
                    name: 'Task',
                },
                assignee: {
                    id: assigneeId
                }
            },
        }

        setOpenModal(true)
        setTransferring(true)

        await fetch('/api/issues/create', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(res => res.json()).then(json => {
            console.log(json.response)
            setResult(json.data)
            setTransferring(false)
        })
    }

    return (
        <>
            <DataTransferModal open={openModal} setOpen={setOpenModal} transferring={transferring} loadingLabel="Updating Thumbnail" result={result} />
            <div className="flex h-48 w-full">
                <div className="h-full w-1/3 flex flex-col items-center border">
                    <label className='text-2xl block mb-2'>Update Model Thumbnail</label>
                    <input
                        ref={uid as LegacyRef<HTMLInputElement>}
                        type='text'
                        className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                        placeholder="Enter UID"
                    >
                    </input>
                    <Button
                        className="w-1/2 text-white"
                        onClick={() => updateThumbnail((uid.current as HTMLInputElement).value)}
                    >
                        Update
                    </Button>
                </div>
                <div className="h-full w-1/3 flex flex-col items-center border">
                    <label className='text-2xl block mb-2'>Create Procurement Task</label>
                    <select
                        className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                        value={taskee}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setTaskee(e.target.value)}
                    >
                        <option value="Hunter">Hunter</option>
                        <option value="Kat">Kat</option>
                    </select>
                    <Button
                        className="w-1/2 text-white"
                        onClick={() => createProcurementTask(taskee)}
                    >
                        Create Task
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