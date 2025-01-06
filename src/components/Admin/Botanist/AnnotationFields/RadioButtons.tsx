'use client'

import { SetStateAction, Dispatch } from "react"

export default function RadioButtons(props: {
    setAnnotationType: Dispatch<SetStateAction<string>>
    setPhotoChecked: Dispatch<SetStateAction<boolean>>
    setVideoChecked: Dispatch<SetStateAction<boolean>>
    setMediaType: Dispatch<SetStateAction<string>>
    setUploadChecked: Dispatch<SetStateAction<boolean>>
    setUrlChecked: Dispatch<SetStateAction<boolean>>
    setModelChecked: Dispatch<SetStateAction<boolean>>
    photoChecked: boolean
    videoChecked: boolean
    modelChecked: boolean
    annotationType: string
    uploadChecked: boolean
    urlChecked: boolean
}) {

    return (
        <>
            <div className="grid grid-cols-6 items-center justify-center">
                <p>Photo</p>
                <div>
                    <input
                        type='radio'
                        value='photo'
                        name='typeOfAnnotation'
                        onChange={(e) => {
                            props.setAnnotationType(e.target.value)
                            props.setPhotoChecked(true)
                            props.setVideoChecked(false)
                            props.setModelChecked(false)
                        }}
                        checked={props.photoChecked}
                    >
                    </input>
                </div>
                <p className="mr-2">Video</p>
                <div>
                    <input
                        type='radio'
                        value='video'
                        name='typeOfAnnotation'
                        onChange={(e) => {
                            props.setAnnotationType(e.target.value)
                            props.setPhotoChecked(false)
                            props.setVideoChecked(true)
                            props.setModelChecked(false)
                            props.setUploadChecked(false)
                            props.setUrlChecked(true)
                            props.setMediaType('url')
                        }}
                        checked={props.videoChecked}
                    >
                    </input>
                </div>
                <p className="mr-4">Model</p>
                <div>
                    <input
                        type='radio'
                        value='model'
                        name='typeOfAnnotation'
                        onChange={(e) => {
                            props.setAnnotationType(e.target.value)
                            props.setPhotoChecked(false)
                            props.setVideoChecked(false)
                            props.setModelChecked(true)
                            props.setUrlChecked(false)
                            props.setUploadChecked(false)
                            props.setMediaType('model')
                        }}
                        checked={props.modelChecked}
                    >
                    </input>
                </div>
                {
                    props.annotationType === 'photo' &&
                    <>
                        <p>URL</p>
                        <div>
                            <input
                                type='radio'
                                value='url'
                                name='typeOfPhoto'
                                onChange={(e) => {
                                    props.setMediaType(e.target.value)
                                    props.setUploadChecked(false)
                                    props.setUrlChecked(true)
                                }}
                                checked={props.urlChecked}
                            >
                            </input>
                        </div>
                        <p className="mr-4">Upload</p>
                        <div>
                            <input
                                type='radio'
                                value='upload'
                                name='typeOfPhoto'
                                onChange={(e) => {
                                    props.setMediaType(e.target.value)
                                    props.setUploadChecked(true)
                                    props.setUrlChecked(false)
                                    props.setMediaType('upload')
                                }}
                                checked={props.uploadChecked}
                            >
                            </input>
                        </div>
                    </>
                }

            </div>
        </>
    )
}