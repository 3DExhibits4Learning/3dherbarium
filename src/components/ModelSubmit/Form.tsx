'use client'

import { useState, useRef } from 'react';
import axios, { AxiosHeaderValue } from 'axios';
import ProgressModal from '@/components/ModelSubmit/ProgressModal';
import ArtistName from './ArtistNameField';
import SpeciesName from './SpeciesNameField';
import MobileSelect from './MobileSelectField';
import ProcessSelect from './ProcessSelectField';
import Software from './SoftwareField';
import { Button } from "@nextui-org/react";
import AdditionalSoftware from './AdditionalSoftwareField';
import { Divider } from '@nextui-org/react';
import TagInput from './Tags';
import Leaflet from 'leaflet';
import FormMap from '../Map/Form';

export default function ModelSubmitForm(props: { token: AxiosHeaderValue | string, email: string, isSketchfabLinked: boolean, sketchfab:{ organizationUid: string, projectUid: string} }) {

    // Variable initialization

    const speciesName = useRef<string>('')
    const artistName = useRef<string>('')
    const mobileValue = useRef<string>('')
    const radioValue = useRef<string>('')
    const software = useRef<string>('')
    const file = useRef<File | null>(null)
    const softwareArray = useRef<Array<string>>([])
    const tagArray = useRef<object[]>([])
    const positionRef = useRef<any>({})

    const [additionalSoftware, setAdditionalSoftware] = useState(0)
    const [uploadDisabled, setUploadDisabled] = useState<boolean>(true)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [success, setSuccess] = useState<boolean | null>(null)
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [position, setPosition] = useState<Leaflet.LatLngExpression | null>(null)

    var uid: string

    // Handler that is called everytime a field is updated; it checks all mandatory fields for values, enabling the upload button if those fields exist

    const isUploadable = () => {
            if (speciesName.current && artistName.current && mobileValue.current && radioValue.current && software.current && file.current && positionRef.current) { setUploadDisabled(false) }
            else { setUploadDisabled(true) }
    }

    // Upload handler

    const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        // This is the database entry handler

        const modelDbEntry = async () => {
            try {
                softwareArray.current.unshift(software.current)

                const data = {
                    email: props.email,
                    artist: artistName.current,
                    species: speciesName.current,
                    isMobile: mobileValue.current,
                    methodology: radioValue.current,
                    uid: uid,
                    software: softwareArray.current,
                    tags: tagArray.current,
                    position: positionRef.current
                }
                const res = await fetch('/api/modelSubmit', {
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                if (!res.ok) throw new Error(await res.text())
            }
            catch (e: any) {
                console.error(e)
            }
        }

        // Handler for fileUpload

        if (!file.current) return

        try {
            const data = new FormData()
            data.set('orgProject', props.sketchfab.projectUid)
            data.set('modelFile', file.current)
            data.set('visibility', 'private')
            data.set('options', JSON.stringify({background: {color:"#000000"}}))

            const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${props.sketchfab.organizationUid}/models`

            const res = await axios.post(orgModelUploadEnd, data, {
                onUploadProgress: (axiosProgressEvent) => setUploadProgress(axiosProgressEvent.progress as number),
                headers: {
                    'Authorization': props.token as AxiosHeaderValue
                }
            })
            uid = res.data.uid
            setSuccess(true)
        }
        catch (e: any) {
            setErrorMsg(e.message)
            setSuccess(false)
            return
        }

        // We then make a post request to our route handler which creates a db record containing the metadata associated with the model
        modelDbEntry()
    }

    return (
        <>
            <ProgressModal progress={uploadProgress} success={success} errorMsg={errorMsg} />
            <h1 className='hidden lg:block ml-[20%] text-3xl py-8'>Submit a 3D Model of a Plant!</h1>
            <form className='w-full lg:w-3/5 lg:border-2 m-auto lg:border-[#004C46] lg:rounded-md bg-[#D5CB9F] dark:bg-[#212121] lg:mb-16'>
                <Divider />
                <div className='flex items-center h-[75px]'>
                    <p className='ml-12 text-3xl'>Specimen Data</p>
                </div>
                <Divider className='mb-6' />
                <SpeciesName ref={speciesName} handler={isUploadable} />
                <FormMap position={position} setPosition={setPosition} ref={positionRef} title/>
                <TagInput ref={tagArray} />
                <Divider className='mt-8' />
                <h1 className='ml-12 text-3xl mt-4 mb-4'>Model Data</h1>
                <Divider />
                <ArtistName ref={artistName} handler={isUploadable} />
                <MobileSelect ref={mobileValue} handler={isUploadable} />
                <ProcessSelect ref={radioValue} handler={isUploadable} />
                <Software ref={software} handler={isUploadable} />
                <AdditionalSoftware ref={softwareArray} handler={isUploadable} stateVar={additionalSoftware} stateFn={setAdditionalSoftware} />
                <div className='my-6 mx-12'>
                    <p className='text-2xl mb-6'>Select your 3D model file.
                        The supported file formats can be found <a href='https://support.fab.com/s/article/Supported-3D-File-Formats' target='_blank'><u>here</u></a>.
                        If your format requires more than one file, zip the files then upload the folder. Maximum upload size is 500 MB.</p>
                    <input onChange={(e) => {
                        if (e.target.files?.[0])
                            file.current = e.target.files[0]
                        isUploadable()
                    }}
                        type='file' 
                        name='file'
                        id='formFileInput'
                        >
                    </input>
                </div>
                <Button
                    isDisabled={uploadDisabled}
                    color='primary'
                    onClick={handleUpload}
                    onPress={() => document.getElementById('progressModalButton')?.click()}
                    className='text-white text-xl mb-24 mt-8 ml-12'>Upload 3D Model
                </Button>
            </form>
        </>
    )
}
