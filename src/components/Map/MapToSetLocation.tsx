'use client'

import { LatLngLiteral } from "leaflet"
import { LocationMarker } from "./LocationMarker"
import { Dispatch, SetStateAction } from "react"

import Map from "./Map"

export default function MapToSetLocation(props: { position: LatLngLiteral | undefined, setPosition: Dispatch<SetStateAction<LatLngLiteral | undefined>>, title?: boolean, required?: boolean, mapSize: string }) {
    return (
        <section className="flex-col w-full mb-8">
            {
                props.title &&
                <h1 className='text-2xl mb-2'>Click the map at the location where your specimen was found
                    {
                        props.required &&
                        <span className="text-red-600 ml-1">*</span>
                    }
                </h1>
            }
            <div className={`${props.mapSize}`}>
                <Map center={props.position?.lat ? props.position : { lat: 40.8665, lng: -124.0828 }}>
                    <LocationMarker position={props.position} setPosition={props.setPosition} />
                </Map>
            </div>
        </section>
    )
}