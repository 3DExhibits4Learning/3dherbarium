/**
 * @file src/components/Map/icons.ts
 * 
 * @fileoverview map icons
 */

import L from 'leaflet'

export const greenMapIcon = new L.Icon({
        iconUrl: '../../../marker-32.png',
        iconRetinaUrl: '../../../marker-32.png',
        popupAnchor: [-0, -0],
        iconSize: [32, 32],
    })