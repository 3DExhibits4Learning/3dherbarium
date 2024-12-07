'use client'

export default function VideoAnnotation(props: { sketchfabApi: any }) {

    const sketchfabApi = props.sketchfabApi

    return (
        <div className="w-full h-full" id="annotationDivVideo">
            {/*@ts-ignore - align works on iframe just fine*/}
            <iframe align='left' className='fade w-[calc(100%-15px)] h-full' src={sketchfabApi.annotations[sketchfabApi.index - 1].url}></iframe>
        </div>
    )
}