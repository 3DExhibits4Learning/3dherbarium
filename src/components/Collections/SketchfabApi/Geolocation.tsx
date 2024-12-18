'use client'

import { sketchfabApiData } from "@/ts/collections"

import MapWithPoint from "@/components/Map/MapWithPoint"
import Herbarium from "@/utils/HerbariumClass"

export default function Geolocation(props: { sketchfabApi: sketchfabApiData }) {

    const specimen = props.sketchfabApi.s as Herbarium
    const position = { lat: specimen.model.lat ? parseFloat(specimen.model.lat) : null, lng: specimen.model.lng ?  parseFloat(specimen.model.lng) : null}
    const locality = specimen.model.locality

    return (
        <>
            {
                position.lat && position.lng &&

                <div className='fade flex w-[99%] mt-[25px] h-fit'>

                    <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                        <p> Geolocation </p>
                    </div>

                    <section className='w-[65%] py-[20px] justify-center items-center text-center px-[10%] h-fit'>
                        <div className="h-[225px] w-full mb-1">
                            <MapWithPoint position={position as {lat: number, lng: number}}/>
                        </div>
                        {locality && <p dangerouslySetInnerHTML={{ __html: locality }} className='m-auto pr-[3%] pl-[2%] text-center fade inline' />}
                    </section>
                
                </div>
            }

        </>
    )
}