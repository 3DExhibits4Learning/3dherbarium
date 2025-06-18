'use client'

import { LatLngLiteral } from "leaflet"
import dynamic from "next/dynamic"
const MapWithPoint = dynamic(() => import('@/components/Map/MapWithPoint'), {ssr: false})

export default function Geolocation(props: { position: LatLngLiteral, locality?: string | null }) {

    return (
        <>
            {
                props.position.lat && props.position.lng &&

                <div className='fade flex w-[99%] mt-[25px] h-fit'>

                    <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                        <p> Geolocation </p>
                    </div>

                    <section className='w-[65%] py-[20px] justify-center items-center text-center px-[10%] h-fit'>
                        <div className="!h-[225px] w-full mb-1">
                            <MapWithPoint position={props.position as {lat: number, lng: number}}/>
                        </div>
                        {props.locality && <p dangerouslySetInnerHTML={{ __html: props.locality }} className='m-auto pr-[3%] pl-[2%] text-center fade inline' />}
                    </section>
                
                </div>
            }

        </>
    )
}