'use client'

import { useContext } from "react"
import { AnnotationEntryContext } from "../AnnotationEntry"
import { annotationEntryContext } from "@/ts/botanist"

export default function RadioButtons() {

    const context = useContext(AnnotationEntryContext) as annotationEntryContext
    const state = context.annotationState
    const dispatch = context.annotationDispatch

    return <>
        <div className="grid grid-cols-6 items-center justify-center">
            <p>Photo</p>
            <div>
                <input
                    type='radio'
                    value='photo'
                    name='typeOfAnnotation'
                    onChange={() => dispatch({ type: 'photoRadioButtonSelected' })}
                    checked={state.photoChecked}
                >
                </input>
            </div>
            <p className="mr-2">Video</p>
            <div>
                <input
                    type='radio'
                    value='video'
                    name='typeOfAnnotation'
                    onChange={() => dispatch({ type: 'videoRadioButtonSelected' })}
                    checked={state.videoChecked}
                >
                </input>
            </div>
            <p className="mr-4">Model</p>
            <div>
                <input
                    type='radio'
                    value='model'
                    name='typeOfAnnotation'
                    onChange={() => dispatch({ type: 'modelRadioButtonSelected' })}
                    checked={state.modelChecked}
                >
                </input>
            </div>
            {
                state.annotationType === 'photo' &&
                <>
                    <p>URL</p>
                    <div>
                        <input
                            type='radio'
                            value='url'
                            name='typeOfPhoto'
                            onChange={() => dispatch({ type: 'urlRadioButtonSelected' })}
                            checked={state.urlChecked}
                        >
                        </input>
                    </div>
                    <p className="mr-4">Upload</p>
                    <div>
                        <input
                            type='radio'
                            value='upload'
                            name='typeOfPhoto'
                            onChange={() => dispatch({ type: 'uploadRadioButtonSelected' })}
                            checked={state.uploadChecked}
                        >
                        </input>
                    </div>
                </>
            }

        </div>
    </>
}