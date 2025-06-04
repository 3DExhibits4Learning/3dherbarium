'use client'

import { sketchfabApiData } from "@/ts/collections"
import { fullAnnotation } from "@/ts/types"

export default function VideoAnnotation(props: { sketchfabApi: sketchfabApiData }) {

    const sketchfabApi = props.sketchfabApi as sketchfabApiData
    const index = sketchfabApi.index as number
    const annotations = sketchfabApi.annotations as fullAnnotation[]
    const videoAnnotation = annotations[index - 1]

    return <>
        {
            !videoAnnotation.annotation.annotation &&
            <div className="w-full h-full" id="annotationDivVideo">
                {/*@ts-ignore - align works on iframe just fine*/}
                <iframe align='left' className='fade w-[calc(100%-15px)] h-full' src={videoAnnotation.url}></iframe>
            </div>
        }
        {
            videoAnnotation.annotation.annotation &&
            <>
                <div className="w-full h-[65%]" id="annotationDivVideo">
                    {/*@ts-ignore - align works on iframe just fine*/}
                    <iframe align='left' className='fade w-[calc(100%-15px)] h-full' src={videoAnnotation.url}></iframe>
                </div>

                <div>
                    <br></br>
                    <p dangerouslySetInnerHTML={{ __html: videoAnnotation.annotation.annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
                </div>
            </>
        }
    </>
}