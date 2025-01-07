'use client'

import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'


export default function FormMap(props: { position: any, setPosition: any, className?: string, title?: boolean, enabler?: Function, required?: boolean }) {

  // This clause ensures that this code doesn't run server side; it will throw an error if it does (it uses the window object)
  if (typeof window !== 'undefined') {

    const className = props.className ? props.className : 'h-[400px] w-4/5 mb-12 z-10'

    const lightModeTiles: string = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
    const darkModeTiles: string = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    const openAttribution: string = '&copy; https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const esriAttribution: string = "Powered by <a href='https://www.esri.com/en-us/home' rel='noopener noreferrer'>Esri</a>"
    const prefersDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let tiles = !prefersDarkMode ? lightModeTiles : darkModeTiles
    let attribution = !prefersDarkMode ? openAttribution : esriAttribution

    const LocationMarker = () => {
      
      useMapEvents({ click(e) { props.setPosition({ lat: e.latlng.lat, lng: e.latlng.lng }) } })
      
      return props.position === null ? null : (
        <Marker position={props.position}>
          <Popup>Your specimen was collected here</Popup>
        </Marker>
      )
    }
    
    return (
      <>
        {
          props.title &&
          <h1 className='text-2xl mb-2'>Click the map at the location where your specimen was found
            {
              props.required &&
              <span className="text-red-600 ml-1">*</span>
            }
          </h1>
        }
        <MapContainer className={`${className}`} center={[40.875781, -124.07856]} zoom={9} scrollWheelZoom={false}>
          <TileLayer
            attribution={attribution}
            url={tiles}
          />
          <LocationMarker />
        </MapContainer>
      </>
    )
  }
}
