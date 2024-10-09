'use client'

import { useState, SetStateAction, Dispatch, useEffect } from 'react';
import axios, { AxiosHeaderValue } from 'axios';
import MobileSelect from './MobileSelectField';
import ProcessSelect from './ProcessSelectField';
import { Button } from "@nextui-org/react";
import { Divider } from '@nextui-org/react';
import TagInput from './Tags';
import Leaflet, { LatLngLiteral } from 'leaflet';
import dynamic from 'next/dynamic';
const FormMap = dynamic(() => import('../Map/Form'), { ssr: false })
import AutoCompleteWrapper from '../Shared/Form Fields/AutoCompleteWrapper';
import TextInput from '../Shared/TextInput';
import PhotoInput from '../Shared/Form Fields/PhotoInput';
import { ModelUploadBody } from '@/api/types';
import ModelInput from './ModelInput';
import DataTransfer from './DataTransfer';

export default function ModelSubmitForm(props: { token: AxiosHeaderValue | string, email: string, isSketchfabLinked: boolean, sketchfab: { organizationUid: string, projectUid: string } }) {

    // Variable initialization

    // Form field states
    const [speciesName, setSpeciesName] = useState<string>('')
    const [position, setPosition] = useState<Leaflet.LatLngExpression | null>(null)
    const [artistName, setArtistName] = useState<string>('')
    const [madeWithMobile, setMadeWithMobile] = useState<string>()
    const [buildMethod, setBuildMethod] = useState<string>()
    const [softwareArr, setSoftwareArr] = useState<{ value: string }[]>([])
    const [tagArr, setTagArr] = useState<{ value: string }[]>([])
    const [file, setFile] = useState<File | null>(null)
    const [photo, setPhoto] = useState<File>()
    const [uploadDisabled, setUploadDisabled] = useState<boolean>(true)

    // Data transfer states
    const [open, setOpen] = useState<boolean>(false)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [success, setSuccess] = useState<boolean | null>(null)

    // Promise tracker for to determine when model upload is complete
    // This allows us to not await the model upload, thereby enabling the do while loop below to get upload progress
    const trackPromise = (promise: any) => {
        let isResolved = false
        let isRejected = false

        // A wrapper promise that tracks the state
        const wrappedPromise = promise
            .then((result: any) => {
                isResolved = true;
                return result;
            })
            .catch((error: any) => {
                isRejected = true;
                if (process.env.NODE_ENV === 'development') console.error(error.message)
                throw new Error("Couldn't upload 3D model")
            })

        // Method to check if resolved or rejected
        wrappedPromise.isResolved = () => isResolved;
        wrappedPromise.isRejected = () => isRejected;

        return wrappedPromise
    }

    // // Get and set upload progress
    // const getUploadProgress = async () => {
    //     setUploadProgress(parseFloat(await fetch('/api/modelSubmit').then(res => res.json()).then(json => json)))
    // }

    const pause = async () => {
        return new Promise((resolve) => setTimeout(resolve, 2000))
    }

    // This is the model upload handler
    const uploadModelAndEnterIntoDb = async (e: React.MouseEvent<HTMLButtonElement>) => {

        try {

            e.preventDefault()
            setOpen(true)
            setTransferring(true)

            const software = JSON.stringify(softwareArr.map(software => software.value))
            const tags = JSON.stringify(tagArr.map(tag => tag.value))
            const pos = JSON.stringify(position)

            const data = new FormData()
            data.set('email', props.email)
            data.set('artist', artistName)
            data.set('species', speciesName)
            data.set('isMobile', madeWithMobile as string)
            data.set('methodology', buildMethod as string)
            data.set('software', software)
            data.set('tags', tags)
            data.set('position', pos)
            data.set('file', file as File)

            let result: any

            const upload = fetch('/api/modelSubmit', {
                method: 'POST',
                body: data
            }).then(res => res.json()).then(json => result = json.data)

            const trackedUpload = trackPromise(upload)
            globalThis.uploadProgress = 0

            do {
                // await getUploadProgress()
                // console.log('GOT PROGRESS')
                setUploadProgress(globalThis.uploadProgress)
                await pause()
                console.log('AWAITED PAUSE')
            }
            while (!trackedUpload.isResolved() && !trackedUpload.isRejected())
            
            console.log(trackedUpload.isResolved())
            console.log(result)

            setResult(result)
            setSuccess(true)
            setTransferring(false)
        }
        catch (e: any) {
            if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') console.error(e.message)
            setResult("Couldn't upload 3D model")
            setTransferring(false)
            setSuccess(false)
        }
    }

    // This effect checks all necessary fields upon update to enable/disable the upload button
    useEffect(() => {

        if (speciesName && photo && position && artistName && madeWithMobile && buildMethod && softwareArr.length > 0 && file) { setUploadDisabled(false) }
        else { setUploadDisabled(true) }

    }, [speciesName, photo, position, artistName, madeWithMobile, buildMethod, softwareArr, file])

    // useEffect(() => {
    //     const testfn = async() => {
    //         const test = await fetch('/api/modelSubmit').then(res => res.json()).then(json => json)
    //         console.log(test)
    //     }
    //     testfn()
    // },[])

    return (
        <>
            <DataTransfer open={open} transferring={transferring} result={result} progress={uploadProgress} success={success} />

            <h1 className='hidden lg:block ml-[20%] text-3xl py-8'>Submit a 3D Model of a Plant!</h1>
            <form className='w-full lg:w-3/5 lg:border-2 m-auto lg:border-[#004C46] lg:rounded-md bg-[#D5CB9F] dark:bg-[#212121] lg:mb-16'>

                <Divider />

                <div className='flex items-center h-[75px]'>
                    <p className='ml-12 text-3xl'>Specimen Data</p>
                </div>

                <Divider className='mb-6' />

                <AutoCompleteWrapper value={speciesName} setValue={setSpeciesName} title='Species Name' required />
                <PhotoInput setFile={setPhoto as Dispatch<SetStateAction<File>>} title="Upload a photo of the specimen for community ID" required leftMargin='ml-12' topMargin='mt-12' bottomMargin='mb-12' />
                <FormMap position={position} setPosition={setPosition} title required />
                <TagInput title="Enter tags to describe your specimen, such as phenotype(fruits, flowers, development stage, etc.)" setTags={setTagArr} />

                <Divider className='mt-12' />

                <h1 className='ml-12 text-3xl mt-4 mb-4'>Model Data</h1>

                <Divider className='mb-12' />

                <TextInput value={artistName} setValue={setArtistName} title='3D Modeler Name' required leftMargin='ml-12' />
                <MobileSelect value={madeWithMobile} setValue={setMadeWithMobile} />
                <ProcessSelect value={buildMethod} setValue={setBuildMethod} />
                <TagInput title="Enter software used to create the model (must enter at least one)" required setTags={setSoftwareArr as Dispatch<SetStateAction<{ value: string }[]>>} />

                <ModelInput setFile={setFile as Dispatch<SetStateAction<File>>} />

                <Button
                    isDisabled={uploadDisabled}
                    color='primary'
                    onClick={uploadModelAndEnterIntoDb}
                    onPress={() => document.getElementById('progressModalButton')?.click()}
                    className='text-white text-xl mb-24 mt-8 ml-12'>Upload 3D Model
                </Button>
            </form>
        </>
    )
}

// // Example Usage
// const examplePromise = new Promise((resolve) => setTimeout(resolve, 2000));

// const trackedPromise = trackPromise(examplePromise);

// setTimeout(() => {
//     console.log('Is Resolved:', trackedPromise.isResolved()); // After 1 second: false
// }, 1000);

// setTimeout(() => {
//     console.log('Is Resolved:', trackedPromise.isResolved()); // After 3 seconds: true
// }, 3000);
