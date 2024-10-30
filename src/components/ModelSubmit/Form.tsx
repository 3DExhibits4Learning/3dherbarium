'use client'

import { useState, SetStateAction, Dispatch, useEffect } from 'react';
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
import ModelInput from './ModelInput';
import DataTransfer from './DataTransfer';
import { uid } from 'uid';
import WildSelect from './Wild';

interface ModelSubmitFormProps{
    edit?: boolean
    speciesName?: string
    position?: LatLngLiteral
    artistName?: string
    madeWithMobile?: string
    buildMethod?: string
    softwareArr?: string[]
    tagsArr?: string[]
}

export default function ModelSubmitForm() {

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
    const [photos, setPhotos] = useState<FileList>()
    const [uploadDisabled, setUploadDisabled] = useState<boolean>(true)
    const [wildOrCultivated, setWildOrCultivated] = useState<string>()

    // Data transfer states
    const [open, setOpen] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [success, setSuccess] = useState<boolean | null>(null)

    // This is the model upload handler; in addition to uploading the model, photos and doing db entry, it sends a confirmation email to user and admin
    const uploadModelAndEnterIntoDb = async (e: React.MouseEvent<HTMLButtonElement>) => {

        try {

            // Prevent default, set data transfer states
            e.preventDefault()
            setOpen(true)
            setTransferring(true)

            // Stringifying the arrays and position, creating the uid and formData
            const software = JSON.stringify(softwareArr.map(software => software.value))
            const tags = JSON.stringify(tagArr.map(tag => tag.value))
            const pos = JSON.stringify(position)
            const confirmation = uid()
            const data = new FormData()
            
            // Checking photos/length for ts, set number of photos and photo files
            if (photos && photos.length) {
                
                data.set('numberOfPhotos', photos.length.toString())
                
                for (let i = 0; i < photos.length; i++) {
                    data.set(`photo${i}`, photos[i])
                }
            }

            // Set remaining data
            data.set('artist', artistName)
            data.set('species', speciesName)
            data.set('isMobile', madeWithMobile as string)
            data.set('methodology', buildMethod as string)
            data.set('software', software)
            data.set('tags', tags)
            data.set('position', pos)
            data.set('file', file as File)
            data.set('confirmation', confirmation)
            data.set('wildOrCultivated', wildOrCultivated as string)

            // Route handler fetch
            const result = await fetch('/api/modelSubmit', {
                method: 'POST',
                body: data
            })
                .then(res => {
                    if(!res.ok) throw Error(res.statusText)
                    return res.json()
                })
                .then(json => json.data)
                .catch((e) => { throw Error(e.message) })
            
            // User email confirmation promise
            const emailUser = fetch(`api/email/model?confirmation=${confirmation}`, {
                method: 'POST',
            }).catch((e) => { if (process.env.NEXT_PUBLIC_LOCAL_ENV === 'development') console.error(e.message) })
            
            // Admin email confirmation promise
            const emailAdmin = fetch(`api/email/admin/modelContributed?confirmation=${confirmation}`, {
                method: 'POST',
            }).catch((e) => { if (process.env.NEXT_PUBLIC_LOCAL_ENV === 'development') console.error(e.message) })
            
            // Await email promises
            await Promise.all([emailUser, emailAdmin])

            // Set success results
            setResult(result)
            setSuccess(true)
            setTransferring(false)
        }
        catch (e: any) {
            // Set fail results
            if(process.env.NEXT_PUBLIC_LOCAL_ENV && ['test', 'development'].includes(process.env.NEXT_PUBLIC_LOCAL_ENV)) console.error(e.message)
            setResult("Couldn't upload 3D model")
            setTransferring(false)
            setSuccess(false)
        }
    }

    // This effect checks all necessary fields upon update to enable/disable the upload button
    useEffect(() => {

        if (speciesName && photos && photos.length && position && artistName && madeWithMobile && buildMethod && softwareArr.length > 0 && file && wildOrCultivated) { setUploadDisabled(false) }
        else { setUploadDisabled(true) }

    }, [speciesName, photos, position, artistName, madeWithMobile, buildMethod, softwareArr, file, wildOrCultivated])

    return (
        <>
            <DataTransfer open={open} transferring={transferring} result={result} success={success} />

            <h1 className='hidden lg:block ml-[20%] text-3xl py-8'>Submit a 3D Model of a Plant!</h1>
            <form className='w-full lg:w-3/5 lg:border-2 m-auto lg:border-[#004C46] lg:rounded-md bg-[#D5CB9F] dark:bg-[#212121] lg:mb-16'>

                <Divider />

                <div className='flex items-center h-[75px]'>
                    <p className='ml-12 text-3xl'>Specimen Data</p>
                </div>

                <Divider className='mb-6' />

                <WildSelect setValue={setWildOrCultivated as Dispatch<SetStateAction<string>>}/>
                <AutoCompleteWrapper value={speciesName} setValue={setSpeciesName} title='Species Name' required />
                <PhotoInput setFile={setPhotos as Dispatch<SetStateAction<FileList>>} title="Upload a photo of the specimen for community ID (max: 5)" required leftMargin='ml-12' topMargin='mt-12' bottomMargin='mb-12' />
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
                    className='text-white text-xl mb-24 mt-8 ml-12'>Upload 3D Model
                </Button>
            </form>
        </>
    )
}