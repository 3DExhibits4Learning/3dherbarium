'use client'

import { SetStateAction, Dispatch } from "react"
import { useContext } from "react"
import { AnnotationEntryContext } from "../AnnotationEntry"
import { annotationEntryContext } from "@/ts/botanist"

export default function FileInput(props: {setFile?: Dispatch<SetStateAction<File>>}) {

    const context = useContext(AnnotationEntryContext) as annotationEntryContext

    return (
        <>
            <p className="text-xl mb-1">Photo<span className="text-red-600 ml-1">*</span></p>
            <input
                id='formFileInput'
                accept='.jpg,.jpeg,.png,.gif'
                type='file'
                onChange={(e) => {
                    if (e.target.files) {
                        props.setFile ? props.setFile(e.target.files[0]) : context.annotationDispatch({type:'setFile', file: e.target.files[0]})
                    }
                }}
            >
            </input>
        </>
    )
}