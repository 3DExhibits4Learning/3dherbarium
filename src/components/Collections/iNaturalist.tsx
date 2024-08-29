'use client'
import { useEffect, useState } from 'react';
import { LatLngLiteral } from 'leaflet';
//import InatMap from '../Map/iNaturalist';
import ImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css";
import { ReactImageGalleryItem } from "react-image-gallery"
import Leaderboards from './Leaderboards';
import { toUpperFirstLetter } from '@/utils/toUpperFirstLetter';
import dynamic from 'next/dynamic';
const InatMap = dynamic(() => import('../Map/iNaturalist'), {ssr:false})

export default function Inaturalist(props: { activeSpecies: string }) {

    const [observations, setObservations] = useState<any>()
    const [userCoordinates, setUserCoordinates] = useState<LatLngLiteral>()
    const [coordinates, setCoordinates] = useState<LatLngLiteral>()
    const [images, setImages] = useState<object[]>()
    const [topObservers, setTopObservers] = useState<any[]>()
    const [topIdentifiers, setTopIdentifiers] = useState<any[]>()
    const [observer, setObserver] = useState<string>()
    const [observationTitle, setObservationTitle] = useState<string>()
    const [observationLocation, setObservationLocation] = useState<string>()
    const [observationDate, setObservationDate] = useState<string>()
    const [observerIcon, setObserverIcon] = useState<string>()
    const [fetchFailed, setFetchFailed] = useState<boolean>(false)

    const setCredentials = (index: number) => {
        const observation = observations[index]
        setObserver(observation.user.login_exact ?? observation.user.login ?? '')
        setObservationTitle(observation.species_guess ?? observation.taxon.name ?? '')
        setObservationDate(observation.observed_on_details.date ?? observation.time_observed_at ?? '')
        setObservationLocation(observation.place_guess ?? '')
        setObserverIcon(observation.user.icon ?? '../../../blankIcon.jpg')
    }

    useEffect(() => {

        const iNatFetch = async () => {

            const iNatFetchObj = {
                activeSpecies: props.activeSpecies,
                userCoordinates: userCoordinates ? userCoordinates : undefined
            }

            const res = await fetch('/api/collections/inaturalist', {
                method: 'POST',
                body: JSON.stringify(iNatFetchObj)

            })

            if (res.ok) {
                const json = await res.json()

                setFetchFailed(false)
                setCoordinates(userCoordinates)
                setObservations(json.data.observations)
                setImages(json.data.images)
                setTopObservers(json.data.topObservers)
                setTopIdentifiers(json.data.topIdentifiers)

                if (!userCoordinates) {
                    setCoordinates(json.data.point)
                }
            }
            else (setFetchFailed(true))
        }

        iNatFetch()

    }, [userCoordinates]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <main className="h-full w-full flex">
                <section className='hidden lg:flex h-full w-1/3 items-center justify-center'>
                    {
                        coordinates &&
                        <InatMap activeSpecies={props.activeSpecies} position={coordinates} userCoordinates={userCoordinates} setUserCoordinates={setUserCoordinates} observations={observations} />
                    }
                </section>
                <section className='flex items-center justify-center w-full lg:w-1/3 flex-col'>
                    {
                        observations &&
                        <>
                            <p className='flex h-[10%] w-full justify-center items-center text-2xl xl:text-3xl'>{toUpperFirstLetter(observationTitle as string)}</p>
                            <div className='w-4/5  xl:w-[95%] h-[65%] xl:h-[75%]'>
                                <ImageGallery autoPlay items={images as ReactImageGalleryItem[]} slideInterval={5000} onSlide={(currentIndex) => setCredentials(currentIndex)}/>
                            </div>
                            <div id='observationCredentials' className='flex flex-col h-[25%] xl:h-[15%] w-3/5 text-center items-center justify-center text-base xl:text-lg'>
                                <p>{observationLocation}</p>
                                <p>{observationDate}</p>
                                <p className='mt-2'>
                                    <img className='inline-block h-[48px] w-[48px] mr-4' src={observerIcon} alt='Observer Icon' />{observer}
                                </p>
                            </div>
                        </>
                    }
                    {
                        !observations &&
                        <div className='flex flex-col h-full w-full justify-center items-center'>
                            <p>No observations found at this location.</p>
                            <p>Try clicking a different location on the map.</p>
                        </div>
                    }
                </section>
                <section className='hidden lg:flex flex-col justify-center items-center w-1/3'>
                {
                    topIdentifiers?.length != 0 && topObservers?.length != 0 &&
                    <Leaderboards identifiers={topIdentifiers} observers={topObservers} />
                }
                </section>
            </main>
        </>
    )
}