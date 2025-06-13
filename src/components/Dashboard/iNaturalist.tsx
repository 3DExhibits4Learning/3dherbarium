'use client'

import { useState, useEffect } from "react"
import { Button } from "@heroui/react"
import Image from "next/image"
import { Divider } from "@heroui/react"
import ImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css";
import { ReactImageGalleryItem } from "react-image-gallery"
import { iNatApiResponse } from "@/ts/types"
import DashMap from "../Map/DashMap"
import { LatLngExpression } from "leaflet"
import { signIn } from "next-auth/react"
import InaturalistPostModal from "./InaturalistPostModal"

export default function InaturalistDash(props: { iNatAccountLinked: boolean, tokenExpiration: number, activeSpeciesName: string, iNatId: string }) {

    // Checking the expiration date of the iNaturalist JWT to determine whether to show the sign in button or api options requiring authentication
    const date = new Date()

    // All further code is only for iNat actively authed users

    const [activeObservation, setActiveObservation] = useState<iNatApiResponse>()
    const [activeObservationImages, setActiveObservationImages] = useState<ReactImageGalleryItem[]>()
    const [modelWithoutPost, setModelWithoutPost] = useState<boolean>(false)
    const [adjacentObservations, setAdjacentObservations] = useState<iNatApiResponse>()
    const [latlng, setLatlng] = useState<{ lat: number, lng: number }>()
    const [postModalOpen, setPostModalOpen] = useState<boolean>(false)

    // If there is an species active in the viewer, get the latest corresponding iNat post. If the post doesn't exist, recommend its creation in the render code.

    useEffect(() => {
        let res = false
        let observation: any

        if (props.activeSpeciesName) {

            const activeSpeciesObservationObj = {
                id: props.iNatId,
                speciesName: props.activeSpeciesName,
                requestType: 'active'
            }

            const iNatDashFetch = async () => {
                await fetch('/api/dashboard', {
                    method: 'POST',
                    body: JSON.stringify(activeSpeciesObservationObj)
                })
                    .then(res => res.json())
                    .then(json => {
                        if (json.results.length) {
                            res = true
                            observation = json.results[0]
                            const imageArray = json.results[0].photos?.map((photo: any) => {
                                const largeUrl = photo.url.replace('square', 'large')
                                return { original: largeUrl, thumbnail: photo.url }
                            })
                            setModelWithoutPost(false)
                            setActiveObservation(json)
                            setActiveObservationImages(imageArray)
                        }
                        else {
                            setModelWithoutPost(true)
                            setActiveObservationImages(undefined)
                            setActiveObservation(undefined)
                        }
                    })
            }

            const getAdjacentObservations = async () => {
                await iNatDashFetch()
                if (res) {
                    const adjacentObservations = await fetch(`https://api.inaturalist.org/v1/observations?lat=${observation.geojson.coordinates[1]}&lng=${observation.geojson.coordinates[0]}&radius=100&taxon_name=${observation.taxon.name}&qaulity_grade=research`)
                        .then(res => res.json())
                        .then(json => json)
                    setAdjacentObservations(adjacentObservations)
                    setLatlng({ lat: observation.geojson.coordinates[1], lng: observation.geojson.coordinates[0] })
                }
            }
            getAdjacentObservations()
        }
    }, [props.activeSpeciesName]) // eslint-disable-line react-hooks/exhaustive-deps

    if (!props.iNatAccountLinked) return <div className="h-full w-full text-center mt-12 text-xl">Link your iNaturalist Account to post an observation, message other iNat users and more!</div>

    return (
        <>
            <InaturalistPostModal open={postModalOpen} setOpen={setPostModalOpen} />

            <div className="text-center">
                <div className="text-center my-4">
                    <Button className="text-xl text-white" onClick={() => setPostModalOpen(true)}>
                        Post to <Image src='../../../iNatLogo.svg' width={125} height={0} alt='iNaturalist Sign In Button' />
                    </Button>
                </div>

                <Divider />

                {
                    !props.activeSpeciesName &&
                    <p className="mt-24">Upload a 3D model to see your corresponding iNat post!</p>
                }

                {
                    modelWithoutPost &&
                    <p className="mt-24 font-medium">You don&apos;t have an iNaturalist observation for {props.activeSpeciesName}!</p>
                }

                {
                    activeObservation?.results.length && activeObservationImages &&
                    <>
                        <p className="my-4 font-medium">Your latest observation of <i>{activeObservation.results[0].taxon.name}</i></p>
                        <div className="w-full h-[500px] flex justify-center">
                            <div className="w-full max-w-[750px]">
                                <ImageGallery autoPlay items={activeObservationImages as ReactImageGalleryItem[]} slideInterval={10000} />
                            </div>
                        </div>

                        {
                            adjacentObservations && latlng &&
                            <div className="flex justify-center">
                                <DashMap observations={adjacentObservations?.results as any[]} position={latlng as LatLngExpression} />
                            </div>
                        }
                    </>
                }
            </div>
        </>
    )
}