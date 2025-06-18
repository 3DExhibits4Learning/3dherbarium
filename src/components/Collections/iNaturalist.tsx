/**
 * @file src/components/Collections/iNaturalist.tsx
 * 
 * @fileoverview collections inatrualist component
 */

'use client'

// Typical imports
import { useEffect, useState, useRef, SetStateAction, Dispatch } from 'react'
import { LatLngLiteral } from 'leaflet'
import { toUpperFirstLetter } from '@/functions/server/utils/toUpperFirstLetter'
import { ReactImageGalleryItem } from "react-image-gallery"
import { Spinner } from '@heroui/react'

// Default imports
import Leaderboards from './Leaderboards'
import dynamic from 'next/dynamic'
import ImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css"

// Dynamic imports
const InatMap = dynamic(() => import('../Map/iNaturalist'), { ssr: false })

export default function Inaturalist(props: { activeSpecies: string }) {

    const observationsRef = useRef<any>(undefined)

    const [observations, setObservations] = useState<any>()
    const [userCoordinates, setUserCoordinates] = useState<LatLngLiteral>({ lat: 40.8665, lng: -124.0828 })
    const [coordinates, setCoordinates] = useState<LatLngLiteral>({ lat: 40.8665, lng: -124.0828 })
    const [images, setImages] = useState<object[]>()
    const [topObservers, setTopObservers] = useState<any[]>()
    const [topIdentifiers, setTopIdentifiers] = useState<any[]>()
    const [observer, setObserver] = useState<string>()
    const [observationTitle, setObservationTitle] = useState<string>()
    const [observationLocation, setObservationLocation] = useState<string>()
    const [observationDate, setObservationDate] = useState<string>()
    const [observerIcon, setObserverIcon] = useState<string>()
    const [fetchFailed, setFetchFailed] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [firstLoad, setFirstLoad] = useState<boolean>(true)

    const setCredentials = (index: number) => {
        var observation
        if (observations) observation = observations[index]
        else if(observationsRef.current) observation = observationsRef.current[index]
        else {setLoading(false); return}
        setObserver(observation.user.login_exact ?? observation.user.login ?? '')
        setObservationTitle(observation.species_guess ?? observation.taxon.name ?? '')
        setObservationDate(observation.observed_on_details.date ?? observation.time_observed_at ?? '')
        setObservationLocation(observation.place_guess ?? '')
        setObserverIcon(observation.user.icon ?? '../../../blankIcon.jpg')
    }

    useEffect(() => {

        setLoading(true)

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
                setCoordinates(userCoordinates as LatLngLiteral)
                setObservations(json.data.observations)
                observationsRef.current = json.data.observations
                setCredentials(0)
                setImages(json.data.images)
                setTopObservers(json.data.topObservers)
                setTopIdentifiers(json.data.topIdentifiers)
                setLoading(false)
                setFirstLoad(false)

                if (!userCoordinates) { setCoordinates(json.data.point) }
            }
            else setFetchFailed(true); setLoading(false); setFirstLoad(false)
        }

        iNatFetch()

    }, [userCoordinates]) // eslint-disable-line react-hooks/exhaustive-deps

    return <>
            <article className="h-full w-full flex">
                {
                    !observations && loading && firstLoad &&
                    <section className='h-full w-full flex justify-center items-center'>
                        <Spinner size='lg' label='Loading Observations' />
                    </section>
                }
                {
                    !firstLoad &&
                    <section className='hidden lg:flex h-full w-1/3 items-center justify-center'>
                        {
                            coordinates && !loading &&
                            <InatMap activeSpecies={props.activeSpecies} position={coordinates} userCoordinates={userCoordinates} setUserCoordinates={setUserCoordinates} observations={observations} />
                        }
                        {
                            loading && !firstLoad &&
                            <div className='h-full w-full flex justify-center items-center'>
                                <Spinner size='lg' label='Updating Observations' />
                            </div>
                        }
                    </section>
                }
                {
                    !observations && !loading &&
                    <div className='flex flex-col h-full w-full justify-center items-center'>
                        <p>No observations found at this location.</p>
                        <p>Try clicking a different location on the map.</p>
                    </div>
                }
                {
                    observations && images &&
                    <>
                        <section className='flex h-full items-center w-full lg:w-1/3 flex-col'>
                            {
                                observations && images &&
                                <>
                                    <p className='flex w-full h-[5%] justify-center items-center [@media(max-height:900px)]:text-lg text-xl lg:text-2xl xl:text-3xl'>{toUpperFirstLetter(observationTitle as string)}</p>
                                    <div id='observationCredentials' className='flex flex-col w-3/5 text-center items-center justify-center [@media(max-height:900px)]:text-sm text-md'>
                                        <p className='mt-2'><img className='inline-block h-[48px] w-[48px] mr-4' src={observerIcon} alt='Observer Icon' />{observer}</p>
                                        <p>{observationLocation}</p>
                                        <p>{observationDate}</p>
                                    </div>
                                    <div className='w-4/5  xl:w-[95%] h-[65%] xl:h-[75%]'>
                                        <ImageGallery autoPlay items={images as ReactImageGalleryItem[]} slideInterval={5000} onSlide={(currentIndex) => setCredentials(currentIndex)} />
                                    </div>
                                </>
                            }
                            {/* {
                                loading &&
                                <div className='h-full w-full flex justify-center items-center'>
                                    <Spinner size='lg' label='Updating Observations' className='text-2xl' />
                                </div>
                            } */}
                        </section>
                        <section className='hidden lg:flex flex-col justify-center items-center w-1/3'>
                            {
                                topIdentifiers?.length != 0 && topObservers?.length != 0 &&
                                <Leaderboards identifiers={topIdentifiers} observers={topObservers} />
                            }
                        </section>
                    </>
                }
            </article>
        </>
}