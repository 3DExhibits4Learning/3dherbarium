'use client'

import { arrayFromObjects } from "../SketchfabDom"

export default function ModelData(props:{sketchfabApi: any}) {

    const sketchfabApi = props.sketchfabApi

    return (
        <div className='fade flex w-[99%] mt-[25px]'>
            <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                <p> 3D Model </p>
            </div>
            <div className='w-[65%] py-[20px] justify-center items-center text-center'>
                <p>Build method: {sketchfabApi.s.model.build_process}</p>
                <p>Created with: {arrayFromObjects(sketchfabApi.s.software)}</p>
                <p>Images: {sketchfabApi.s.image_set[0].no_of_images}</p>
                <p>Modeler: {sketchfabApi.s.model.modeled_by}</p>
                <p>Annotator: {sketchfabApi.s.getAnnotator()}</p>
            </div>
        </div>
    )
}