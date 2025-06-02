'use client'

import { SetStateAction, Dispatch } from "react"
import { model } from "@prisma/client"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { useContext } from "react"
import { AnnotationEntryContext } from "../AnnotationEntry"
import { annotationEntryContext } from "@/ts/botanist"

export default function ModelAnnotationSelect(props: { value: string, setValue?: Dispatch<SetStateAction<string>>, modelAnnotations: model[] }) {

    const context = useContext(AnnotationEntryContext) as annotationEntryContext

    return (
        <>
            <p className="text-2xl mb-1">Annotation Model
                <span className="text-red-600 ml-1">*</span>
            </p>
            <select
                onChange={(e) => props.setValue ? props.setValue(e.target.value) : context.annotationDispatch({type:'setStringValue', field:'modelAnnotationUid', value: e.target.value})}
                className={`w-4/5 min-w-[300px] max-w-[500px] rounded-xl mb-4 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                value={props.value}
            >
                <option hidden key={Math.random()} value='select'>Select a 3D Model</option>
                {
                    props.modelAnnotations.map((model, index) => {
                        return (
                            <option key={index} value={model.uid}>{`${toUpperFirstLetter(model.spec_name)}`}</option>
                        )
                    })
                }
            </select>
        </>
    )
}