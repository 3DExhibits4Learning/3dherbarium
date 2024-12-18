'use client'

import Map from "@/components/Map"
import { sketchfabApiData } from "@/ts/collections"

export default function Geolocation(props: { sketchfabApi: any }) {

    const sketchfabApi = props.sketchfabApi

    return (
            <div className='fade flex w-[99%] mt-[25px] h-[250px]'>
                <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                    <p> Geolocation </p>
                </div>
                <div className='w-[65%] py-[20px] justify-center items-center text-center px-[5%]'>
                    <Map></Map>
                </div>
            </div>
    )
}