'use client'

import { SetStateAction, Dispatch } from "react"
import { ChangeEvent } from "react"
import { Button } from "@heroui/react"

export default function ProcurementTask(props:{taskee: string, setTaskee: Dispatch<SetStateAction<string>>, procurementTaskHandler: Function}) {
    return (
        <div className="h-full w-1/3 flex flex-col items-center border border-[#004C46]">
            <label className='text-2xl block mb-2'>Create Procurement Task</label>
            <select
                className={`w-3/5 max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                value={props.taskee}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => props.setTaskee(e.target.value)}
            >
                <option value="Hunter">Hunter</option>
                <option value="Kat">Kat</option>
            </select>
            <Button
                className="w-1/2 text-white bg-[#004C46]"
                onClick={() => props.procurementTaskHandler(props.taskee)}
            >
                Create Task
            </Button>
        </div>
    )
}