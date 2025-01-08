/**
 * @file /components/Map/Map.tsx
 * @fileoverview basic map to power most other maps post 2025
 */

'use client'

// Imports
import { MapContainer, TileLayer } from 'react-leaflet'
import { LatLngLiteral } from 'leaflet';
import { ReactNode } from 'react';
import 'leaflet/dist/leaflet.css';

export default function Map({ center, children }: { center: LatLngLiteral, children: ReactNode }) {

  if (typeof window !== 'undefined') {

    const lightModeTiles: string = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
    const darkModeTiles: string = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    const darkAttribution: string = "&copy; <a href='https://www.openstreetmap.org/' rel='noopener noreferrer'>OpenStreetMap</a> contributors, &copy; <a href='https://carto.com/' rel='noopener noreferrer'>CartoDB</a>"
    const esriAttribution: string = "Powered by <a href='https://www.esri.com/en-us/home' rel='noopener noreferrer'>Esri</a>"
    const prefersDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

    let tiles = !prefersDarkMode ? lightModeTiles : darkModeTiles
    let attribution = !prefersDarkMode ? esriAttribution: darkAttribution

    return (
      <MapContainer className='h-full w-full' center={[center.lat, center.lng]} zoom={10} scrollWheelZoom={false}>
        <TileLayer attribution={attribution} url={tiles} />
        {children}
      </MapContainer>
    )
  }
}

