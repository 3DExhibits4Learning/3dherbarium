'use client'

import { useState } from "react"

export default function TaskImage(props: { sidSlice: string }) {

    const [imgSrc, setImgSrc] = useState<any>(`/api/admin/modeler/photos/getTaskPhoto?sidSlice=${props.sidSlice}`)

    return <div className="w-full h-[200px] mb-8">
        <img className='h-full w-full' src={imgSrc} alt={`Photo of task specimen`} onError={() => { setImgSrc('/noImage.png') }} />
    </div>
}