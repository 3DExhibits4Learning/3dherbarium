'use client'

import { LatLngLiteral } from "leaflet"
import { Marker, Popup } from "react-leaflet"

import Map from "./Map"

export default function MapWithPoint(props:{position: LatLngLiteral}) {
    return (
        <Map>
            <Marker position={props.position}>
                <Popup>Specimen geolocation</Popup>
            </Marker>
        </Map>
    )
}