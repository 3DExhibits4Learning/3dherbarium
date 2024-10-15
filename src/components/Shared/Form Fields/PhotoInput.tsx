'use client'

import { SetStateAction, Dispatch } from "react"

export default function PhotoInput(props: { setFile: Dispatch<SetStateAction<FileList>>, required?: boolean, title?: string, leftMargin?: string, topMargin?: string, bottomMargin?: string }) {
    return (
        <>
            {
                props.title && 
                <p className={`text-2xl mb-2 ${props.leftMargin} ${props.topMargin}`}>{props.title}
                    {
                        props.required &&
                        <span className="text-red-600 ml-1">*</span>
                    }
                </p>
            }
            <input
                id='formFileInput'
                accept='.jpg,.jpeg,.png'
                type='file'
                multiple
                className={`${props.leftMargin} ${props.bottomMargin}`}
                onChange={(e) => {
                    if (e.target.files) {
                        props.setFile(e.target.files)
                    }
                }}
            >
            </input>
        </>
    )
}