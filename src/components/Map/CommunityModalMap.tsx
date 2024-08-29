'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';


const CommunityModalMap = (props: { position: LatLngExpression}) => {

  // This clause ensures that this code doesn't run server side; it will throw an error if it does (it uses the window object)
  if (typeof window !== 'undefined') {

    const lightModeTiles: string = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
    const darkModeTiles: string = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    const openAttribution: string = '&copy; https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const esriAttribution: string = "Powered by <a href='https://www.esri.com/en-us/home' rel='noopener noreferrer'>Esri</a>"
    const prefersDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let tiles = !prefersDarkMode ? lightModeTiles : darkModeTiles
    let attribution = !prefersDarkMode ? openAttribution : esriAttribution

    const markerIcon = new L.Icon({
        iconUrl: '../../../marker-icon.png',
        iconRetinaUrl: '../../../marker-icon.png',
        popupAnchor: [-0, -0],
        iconSize: [24, 32],
    });

    return (
      <>
        <MapContainer className='h-full w-full mb-12 z-10' center={props.position} zoom={7} scrollWheelZoom={false}>
          <TileLayer
            attribution={attribution}
            url={tiles}
          />
          <Marker position={props.position} icon={markerIcon}>
            <Popup>
                Specimen location
            </Popup>
          </Marker>
        </MapContainer>
      </>
    )
  }
}
export default CommunityModalMap