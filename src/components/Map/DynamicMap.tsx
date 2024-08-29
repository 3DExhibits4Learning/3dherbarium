/**
 * @file /components/Map/DynamicMap.tsx
 * @fileoverview react leaflet map component implementation for nextJS.
 */

'use client';

import Leaflet from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

import swipe_gesture_icon from '../../../public/swipe-gesture.png';
import swipe_gesture_icon_dark from '../../../public/swipe-gesture-dark.png';

import L from 'leaflet';
import { Marker, useMapEvents, Circle } from 'react-leaflet';

const icon = L.icon({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const { MapContainer } = ReactLeaflet;

const Map = ({ children, className, width, height, setIsLoading, ...rest }: any) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const date0: string = searchParams.get('date0') || '';
  const date1: string = searchParams.get('date1') || ''
  const searchGrade: string = searchParams.get('searchGrade') || '';
  const locationEnable: string = searchParams.get('locationEnable') || '';
  const searchRadius: string = searchParams.get('searchRadius') || '100';
  const lat: string = searchParams.get('lat') || '';
  const lng: string = searchParams.get('lng') || '';
  const relative_lat: string = searchParams.get('relative_lat') || '';
  const relative_lng: string = searchParams.get('relative_lng') || '';

  const isDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [showIcon, setShowIcon] = useState<boolean>(L.Browser.mobile ? true : false);
  const [paragraphHidden, setParagraphHidden] = useState<boolean>(false);

  useEffect(() => {
    if (!showIcon) {
      setTimeout(() => setParagraphHidden(true), 500); // 500ms for fade-out duration
    } else {
      setParagraphHidden(false);
    }
  }, [showIcon]);

  function LocationMarker() {
    let latLng;
    if (!locationEnable || locationEnable === 'false' || !lat && !lng) { latLng = null }
    else latLng = { lat: parseFloat(relative_lat || '0'), lng: parseFloat(relative_lng || '0') }

    const [position, setPosition] = useState<Leaflet.LatLngExpression | null>(latLng);
    const map = useMapEvents({
      zoomstart(e) {
        setShowIcon(false);
      },
      zoomlevelschange(e) {
        setShowIcon(false);
      },
      drag(e) {
        setShowIcon(false);
      },
      // move(e) {
      //   setShowIcon(false);
      // },
      click(e) {
        if (locationEnable === 'true') {
          setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
          router.replace(`?${new URLSearchParams({
            locationEnable,
            searchRadius,
            date0,
            date1,
            searchGrade,
            lat: e.latlng.wrap().lat.toString(),
            lng: e.latlng.wrap().lng.toString(),
            relative_lat: e.latlng.lat.toString(),
            relative_lng: e.latlng.lng.toString()
          })}`, { scroll: false });
          setIsLoading(true);
          scrollTo({ behavior: 'smooth', top: 0 });
        }
      },
    });

    return position === null ? null : (
      <>
        <Marker position={position} icon={icon}></Marker>
        <Circle center={position} radius={parseInt(searchRadius) * 1000} pathOptions={{ color: '#004C46', fillColor: '#004C46' }}></Circle>
      </>
    )
  }


  return (
    <section className={className}>
      <div
        className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center z-50 pointer-events-none">
        <Image
          className={`pointer-events-none w-[200px] ${showIcon ? 'rotate-blink-animation' : 'fade-out'}`}
          src={isDarkMode ? swipe_gesture_icon_dark : swipe_gesture_icon}
          alt="Use two fingers to swipe"
        />
        {!paragraphHidden && (
          <p className={`noselect font-bold text-xl text-black dark:text-white pointer-events-auto ${!showIcon ? 'fade-out' : ''}`}>SWIPE WITH 2 FINGERS</p>
        )}
      </div>
      <MapContainer className={`${className} pointer-events-auto`} dragging={!L.Browser.mobile} tap={!L.Browser.mobile} {...rest}>
        {children(ReactLeaflet, Leaflet)}
        <LocationMarker />
      </MapContainer>
    </section>

  )
}

export default Map;