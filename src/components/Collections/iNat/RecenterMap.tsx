/**
 * @file /src/app/components/map/RecenterMap.tsx
 * 
 * @fileoverview Recenter the map to the next position when the position is updated
 */

//library imports
import { LatLngLiteral } from 'leaflet';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

/**
 * @param props.position the position the center the map on 
 * @returns a null JSX component, this component does not 
 * need to be rendered, it is only responsible to centering the map
 * on updates.
 */
export default function RecenterMap(props: {position : LatLngLiteral})  {
    const map = useMap();

    useEffect(() => {
        if (props.position) {
            map.setView([props.position.lat, props.position.lng], map.getZoom());
        }
    }, [props.position, map]);

    return null;
};
