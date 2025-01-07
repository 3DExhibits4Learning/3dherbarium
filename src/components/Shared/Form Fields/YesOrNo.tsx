'use client'

import { SetStateAction, Dispatch } from "react"

export default function YesOrNo(props:{value: boolean | undefined, setValue: Dispatch<SetStateAction<boolean | undefined>>, title: string, required?: boolean, topMargin?: string}) {
    return (
        <div className={`${props.topMargin}`}>
            <label className='text-2xl block mb-2'>{props.title}</label>
            <select className='dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 rounded-xl outline-[#004C46] mb-8' onChange={(e) => props.setValue(e.target.value ? true : false)}>
                <option value={1}>Yes</option>
                <option value={0}>No</option>
            </select>
        </div>
    )
}