'use client'

import { LatLngLiteral } from "leaflet"
import { Marker, Popup } from "react-leaflet"
import { greenMapIcon } from "./icons"

import Map from "./Map"

export default function MapWithPoint(props:{position: LatLngLiteral}) {
    return (
        <Map>
            <Marker position={props.position} icon={greenMapIcon}>
                <Popup>
                    <p>Latitude: {props.position.lat}</p>
                    <p>Longitude: {props.position.lng}</p>
                    </Popup>
            </Marker>
        </Map>
    )
}