'use client'

import { SetStateAction, Dispatch } from "react"

export default function AnnotationReposition(props:{repositionEnabled: boolean, setRepositionEnabled: Dispatch<SetStateAction<boolean>>, setPosition3D: Dispatch<SetStateAction<string | undefined>>}) {
    return (
        <>
            <div className="flex items-center">
                <input type='checkbox'
                    className="ml-12"
                    checked={props.repositionEnabled}
                    onChange={() => {
                        props.setRepositionEnabled(!props.repositionEnabled)
                        if (props.setPosition3D)
                            props.setPosition3D(undefined)
                    }}
                >
                </input>
                <p className="ml-2">Annotation Reposition</p>
            </div>
        </>
    )
}