/**
 * @file src/components/Map/icons.ts
 * 
 * @fileoverview map icons
 */

import L from 'leaflet'

export const mapMarker = new L.Icon({
        iconUrl: '/mapMarker.svg',
        iconRetinaUrl: '/mapMarker.svg',
        popupAnchor: [-0, -0],
        iconSize: [40, 40],
    })

