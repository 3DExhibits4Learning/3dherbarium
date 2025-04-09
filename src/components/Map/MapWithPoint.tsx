'use client'

import { LatLngLiteral } from "leaflet"
import { Marker, Popup } from "react-leaflet"
import { mapMarker } from "./icons"

import Map from "./Map"

export default function MapWithPoint(props: { position: LatLngLiteral }) {
    return <Map center={props.position}>
            <Marker position={props.position} icon={mapMarker}>
                <Popup>
                    <p>Latitude: {props.position.lat}</p>
                    <p>Longitude: {props.position.lng}</p>
                </Popup>
            </Marker>
        </Map>
}