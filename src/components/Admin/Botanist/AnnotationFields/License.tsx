'use client'

import { SetStateAction, Dispatch } from "react"
import { useContext } from "react"
import { AnnotationEntryContext } from "../AnnotationEntry"
import { annotationEntryContext } from "@/ts/botanist"

export default function License(props: { license: string, setLicense?: Dispatch<SetStateAction<string>> }) {

    const context = useContext(AnnotationEntryContext) as annotationEntryContext

    return (
        <>
            <p className="text-xl mb-1">License<span className="text-red-600 ml-1">*</span></p>
            <select
                className={`w-4/5 min-w-[300px] max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                value={props.license}
                onChange={e =>  props.setLicense ? props.setLicense(e.target.value) : context.annotationDispatch({ type: 'setStringValue', field: 'license', value: e.target.value }) }
            >
                <option value={props.license} disabled hidden>{props.license}</option>
                <option value='CC BY'>CC BY</option>
                <option value='CC BY-SA'>CC BY-SA</option>
                <option value='CC BY-NC'>CC BY-NC</option>
                <option value='CC BY-NC-SA'>CC BY-NC-SA</option>
                <option value='CC BY-ND'>CC BY-ND</option>
                <option value='CC BY-NC-ND'>CC BY-NC-ND</option>
                <option value='Public Domain'>Public Domain</option>
            </select>
        </>
    )
}