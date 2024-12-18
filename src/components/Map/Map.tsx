/**
 * @file /components/Map/Map.tsx
 * @fileoverview Basic map to power most other maps
 */

'use client'

// Imports
import { MapContainer, TileLayer} from 'react-leaflet'
import { ConditionalChildren } from '@/api/types';
import 'leaflet/dist/leaflet.css';

export default function Map({children}: ConditionalChildren) {

  // This clause ensures that this code doesn't run server side; it will throw an error if it does (it uses the window object)
  if (typeof window !== 'undefined') {

    const lightModeTiles: string = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
    const darkModeTiles: string = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    const openAttribution: string = '&copy; https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const esriAttribution: string = "Powered by <a href='https://www.esri.com/en-us/home' rel='noopener noreferrer'>Esri</a>"
    const prefersDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let tiles = !prefersDarkMode ? lightModeTiles : darkModeTiles
    let attribution = !prefersDarkMode ? openAttribution : esriAttribution

    return (
      <MapContainer className='h-full w-full' center={[40.875781, -124.07856]} zoom={9} scrollWheelZoom={false}>
        <TileLayer attribution={attribution} url={tiles} />
        {children}
      </MapContainer>
    )
  }
}

