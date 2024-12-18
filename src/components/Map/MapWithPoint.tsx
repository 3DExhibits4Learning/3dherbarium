'use client'

import { LatLngLiteral } from "leaflet"
import { Marker, Popup } from "react-leaflet"
import { greenMapIcon } from "./icons"

import Map from "./Map"

export default function MapWithPoint(props:{position: LatLngLiteral}) {
    return (
        <Map>
            <Marker position={props.position} icon={greenMapIcon}>
                <Popup>Specimen geolocation</Popup>
            </Marker>
        </Map>
    )
}