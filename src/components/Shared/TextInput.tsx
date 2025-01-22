'use client'

import { SetStateAction, Dispatch } from "react"
import { useContext } from "react"
import { AnnotationEntryContext } from "../Admin/Botanist/AnnotationEntry"
import { annotationEntryContext } from "@/ts/botanist"

export default function TextInput(props: { value: string, setValue?: Dispatch<SetStateAction<string>>, title: string, required?: boolean, leftMargin?: string, field?: string }) {

    const context = useContext(AnnotationEntryContext) as annotationEntryContext

    return (
        <>
            <p className={`text-2xl mb-1 ${props.leftMargin}`}>{props.title}
                {
                    props.required &&
                    <span className="text-red-600 ml-1">*</span>
                }
            </p>
            <input
                className={`w-4/5 min-w-[300px] max-w-[500px] rounded-xl mb-8 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46] ${props.leftMargin}`}
                type='text'
                onChange={e => props.setValue ? props.setValue(e.target.value) : context.annotationDispatch({type:'setStringValue', field: props.field as string, value: e.target.value })}
                value={props.value}
            >
            </input>
        </>
    )
}