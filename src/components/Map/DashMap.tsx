// TODO : Check all observation json values in iNaturalist, create a type for them, and pass prop of said type to this component
'use client'

import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { toUpperFirstLetter } from '@/functions/server/utils/toUpperFirstLetter';
import SendInatMsg from '../Shared/SendInatMsg';
import { useState } from 'react';
import Image from 'next/image';

export default function DashMap(props: { observations: any[], position: LatLngExpression }) {

    const [openMessageSend, setOpenMessageSend] = useState<boolean>(false)
    const [messageRecipient, setMessageRecipient] = useState<string>()

    const lightModeTiles: string = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
    const darkModeTiles: string = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    const openAttribution: string = '&copy; https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const esriAttribution: string = "Powered by <a href='https://www.esri.com/en-us/home' rel='noopener noreferrer'>Esri</a>"
    const prefersDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let tiles = !prefersDarkMode ? lightModeTiles : darkModeTiles
    let attribution = !prefersDarkMode ? openAttribution : esriAttribution

    const myIcon = new L.Icon({
        iconUrl: '../../../marker-32.png',
        iconRetinaUrl: '../../../marker-32.png',
        popupAnchor: [-0, -0],
        iconSize: [32, 32],
    });

    return (
        <>
            <SendInatMsg username={messageRecipient as string} open={openMessageSend} setOpen={setOpenMessageSend}/>
            <MapContainer className='h-[400px] w-4/5 z-10 mt-8' center={[40.875781, -124.07856]} zoom={9} scrollWheelZoom={false} style={{ height: '400px' }}>
                <TileLayer
                    attribution={attribution}
                    url={tiles}
                />
                <Marker position={props.position} />
                {props.observations.map((observation, index) => {
                    return (
                        <>
                            {
                                observation.photos[0]?.url &&
                                <Marker key={index} position={{ lat: observation.geojson.coordinates[1], lng: observation.geojson.coordinates[0] }} icon={myIcon}>
                                    <Popup>
                                        <div className='flex h-[200px] w-[300px] justify-between'>
                                            <div>
                                                <p className='text-center text-[20px] !mt-0 !mb-[12px] text-[#004C46] dark:text-[#F5F3E7]'>{toUpperFirstLetter(observation.taxon.preferred_common_name)}</p>
                                                <p className='text-[14px] !mt-0 !mb-[12px]'>Observer: {observation.user.login}</p>
                                                <p className='text-[14px] !m-0 !mb-[12px]'>Date: {observation.observed_on_details?.date ?? ''}</p>
                                                {/* <p className='text-[14px] !m-0 hover:underline hover:cursor-pointer'
                                                    onClick={() => {
                                                        setMessageRecipient(observation.user.login_exact ?? observation.user.login)
                                                        setOpenMessageSend(true)
                                                    }}
                                                >
                                                    <div className='h-[24px] w-[24px] relative mr-1'><Image src='/messageIcon.png' alt='Message Icon' fill></Image></div>
                                                    Message {observation.user.login}
                                                </p> */}
                                            </div>
                                            <img src={observation.photos[0].url.replace('square', 'small')} alt="observation photo" className='inline-block w-[125px] h-[150px]' />
                                        </div>
                                    </Popup>
                                </Marker>
                            }
                        </>
                    )
                })}
            </MapContainer>
        </>
    )
}