import { LatLngLiteral } from "leaflet"
import { SetStateAction, Dispatch } from "react"
import { useMapEvents, Marker, Popup } from "react-leaflet"

export const LocationMarker = (props: { position: LatLngLiteral | undefined, setPosition: Dispatch<SetStateAction<LatLngLiteral | undefined>> }) => {

    useMapEvents({ click(e) { props.setPosition({ lat: e.latlng.lat, lng: e.latlng.lng }) } })

    return (
        <>
            {
                props.position &&
                <Marker position={props.position as LatLngLiteral} >
                    <Popup>Your specimen was collected here </Popup>
                </Marker>
            }
        </>
    )
}