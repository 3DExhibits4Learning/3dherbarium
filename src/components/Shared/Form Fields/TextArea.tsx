'use client'

import { SetStateAction, Dispatch } from "react"

export default function TextArea(props: { value: string, setValue: Dispatch<SetStateAction<string>>, title?: string, required?: boolean, maxwidth?: string}) {
    return (
        <>
            {
                props.title &&
                <p className="text-2xl mb-1">{props.title}
                    {
                        props.required &&
                        <span className="text-red-600 ml-1">*</span>
                    }
                </p>
            }
            <textarea
                className={`w-[95%] min-w-[100px] min-h-[200px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] p-4 text-[14px] outline-[#004C46]`}
                value={props.value}
                onChange={e => props.setValue(e.target.value)}
            >
            </textarea>
        </>
    )
}