// TODO : Check all observation json values in iNaturalist, create a type for them, and pass prop of said type to this component
'use client'

import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Circle } from 'react-leaflet'
import L, { LatLngLiteral } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { toUpperFirstLetter } from '@/functions/server/utils/toUpperFirstLetter'
import { SetStateAction, Dispatch, Fragment } from 'react'

export default function InatMap(props: { activeSpecies: string, observations: any[], position: LatLngLiteral, userCoordinates: LatLngLiteral | undefined, setUserCoordinates: Dispatch<SetStateAction<LatLngLiteral>> }) {

    const lightModeTiles: string = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
    const darkModeTiles: string = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    const openAttribution: string = '&copy; https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const esriAttribution: string = "Powered by <a href='https://www.esri.com/en-us/home' rel='noopener noreferrer'>Esri</a>"
    const prefersDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const iNatTileUrl: string = 'https://api.inaturalist.org/v1/points/{z}/{x}/{y}.png?photos=true&taxon_name=' + props.activeSpecies

    let tiles = !prefersDarkMode ? lightModeTiles : darkModeTiles
    let attribution = !prefersDarkMode ? openAttribution : esriAttribution

    const myIcon = new L.Icon({
        iconUrl: '../../../marker-32.png',
        iconRetinaUrl: '../../../marker-32.png',
        popupAnchor: [-0, -0],
        iconSize: [32, 32],
    });

    const markerIcon = new L.Icon({
        iconUrl: '../../../marker-icon.png',
        iconRetinaUrl: '../../../marker-icon.png',
        popupAnchor: [-0, -0],
        iconSize: [24, 32],
    });

    const LocationMarker = () => {
        const map = useMapEvents({ click(e) { props.setUserCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng }) } })
        return props.position === null ? null : (<Marker position={props.position} icon={markerIcon} />)
    }

    return <MapContainer className='h-[95%] w-[95%] z-10 rounded-xl' center={[props.position.lat, props.position.lng]} zoom={7} scrollWheelZoom={false}>
        <TileLayer attribution={attribution} url={tiles} />
        <TileLayer url={iNatTileUrl} />
        <LocationMarker />
        <Circle center={props.position} radius={75000} pathOptions={{ color: '#004C46', fillColor: '#004C46' }}></Circle>
        {
            props.observations?.length &&
            <>
                {
                    props.observations.map((observation, index) => <Fragment key={index}>
                        {
                            observation.photos[0]?.url &&
                            <Marker position={{ lat: observation.geojson.coordinates[1], lng: observation.geojson.coordinates[0] }} icon={myIcon}>
                                <Popup>
                                    <div className='flex h-[200px] w-[300px] justify-between'>
                                        <div>
                                            <p className='text-center text-[20px] !mt-0 !mb-[12px] text-[#004C46] dark:text-[#F5F3E7]'>{toUpperFirstLetter(observation.taxon.preferred_common_name)}</p>
                                            <p className='text-[14px] !mt-0 !mb-[12px]'>Observer: {observation.user.login}</p>
                                            <p className='text-[14px] !m-0 !mb-[12px]'>Date: {observation.observed_on_details.date}</p>
                                            {/* <p className='text-[14px] !m-0 hover:underline hover:cursor-pointer'>
                                                            <div className=' relative h-[24px] w-[24px] mr-1'>
                                                                <Image src='/messageIcon.png' alt='Message Icon' fill></Image>
                                                            </div>Message {observation.user.login}
                                                        </p> */}
                                        </div>
                                        <img src={observation.photos[0].url.replace('square', 'small')} alt="observation photo" className='inline-block w-[125px] h-[150px]' />
                                    </div>
                                </Popup>
                            </Marker>
                        }
                    </Fragment>)
                }
            </>
        }
    </MapContainer>
}