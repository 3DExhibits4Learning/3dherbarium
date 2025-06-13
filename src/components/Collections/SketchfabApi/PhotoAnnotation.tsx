'use client'

import { photo_annotation } from "@prisma/client"
import { Skeleton } from "@heroui/skeleton";

export default function PhotoAnnotation(props: { sketchfabApi: any }) {

    const sketchfabApi = props.sketchfabApi
    const loading = sketchfabApi.loadingPhoto

    return <>
        <div className="w-full h-[65%]" id="annotationDivMedia" style={{ display: "block" }}>
            {loading && <div className='w-full h-full justify-center'><Skeleton className="w-full h-full" /></div>}
            {
                !loading &&
                <div className='w-full h-full text-center fade'>
                    <img key={Math.random()} className='fade center w-[98%] h-full pr-[2%] pt-[1%]'
                        src={sketchfabApi.imgSrc}
                        alt={`Image for annotation number ${sketchfabApi.annotations[sketchfabApi.index - 1].annotation_no}`}>
                    </img>
                </div>
            }
        </div>

        <div id="annotationDivText">
            <br></br>
            <p dangerouslySetInnerHTML={{ __html: (sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation).annotation }} className='m-auto pr-[3%] pl-[2%] text-center fade' />
        </div>

        <div id="annotationDivCitation">
            <br></br>
            <p className='fade text-center w-[95%]'>Photo by: {(sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation).author}, licensed under <a href='https://creativecommons.org/share-your-work/cclicenses/' target='_blank'>{(sketchfabApi.annotations[sketchfabApi.index - 1].annotation as photo_annotation).license}</a></p>
        </div>
    </>
}