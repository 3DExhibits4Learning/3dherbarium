'use client'

import { SetStateAction, Dispatch } from "react"

export default function FileInput(props: {setFile: Dispatch<SetStateAction<File>>}) {
    return (
        <>
            <p className="text-xl mb-1">Photo<span className="text-red-600 ml-1">*</span></p>
            <input
                id='formFileInput'
                accept='.jpg,.jpeg,.png,.gif'
                type='file'
                onChange={(e) => {
                    if (e.target.files) {
                        props.setFile(e.target.files[0])
                    }
                }}
            >
            </input>
        </>
    )
}