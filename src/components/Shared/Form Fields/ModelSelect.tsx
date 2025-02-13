'use client'

import { SetStateAction, Dispatch } from "react"
import { model } from "@prisma/client"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"

export default function Select(props: { value: string, setValue: Dispatch<SetStateAction<string>>, models: model[], title?: string, required?: string }) {
    return (
        <>
            {
                props.title &&
                <p className="text-xl mb-1 font-medium">{props.title}
                    {
                        props.required &&
                        <span className="text-red-600 ml-1">*</span>
                    }
                </p>
            }
            <select
                onChange={(e) => props.setValue(e.target.value)}
                className={`w-4/5 min-w-[300px] max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                value={props.value}
            >
                <option hidden key={Math.random()} value='select'>Select a 3D Model</option>
                {
                    props.models.map((model, index) => {
                        return (
                            <option key={index} value={model.uid}>{`${toUpperFirstLetter(model.spec_name)}`}</option>
                        )
                    })
                }
            </select>
        </>
    )
}