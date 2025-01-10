'use client'

import { SetStateAction, Dispatch } from "react"

export default function ModelInput(props: { setFile: Dispatch<SetStateAction<File>>, title?: string, yMargin?: string }) {
    return (
        <>
            <div className={`${props.yMargin ? props.yMargin : 'my-8'}`}>
                {
                    props.title &&
                    <p className='text-2xl mb-6'>{props.title}<span className="text-red-600 ml-1">*</span></p>
                }
                {
                    !props.title &&
                    <p className='text-2xl mb-6'>Select your 3D model file.
                        The supported file formats can be found <a href='https://support.fab.com/s/article/Supported-3D-File-Formats' target='_blank'><u>here</u></a>.
                        If your format requires more than one file, zip the files then upload the folder. Maximum upload size is 500 MB.
                    </p>

                }
                <input onChange={(e) => {
                    if (e.target.files?.[0])
                        props.setFile(e.target.files[0])
                }}
                    type='file'
                    name='file'
                    id='formFileInput'
                    accept=".fbx,.blend,.obj,.dae,.3ds,.ply,.stl,.gltf,.glb,.zip,.usdz,.usdc"
                >
                </input>
            </div>
        </>
    )
}