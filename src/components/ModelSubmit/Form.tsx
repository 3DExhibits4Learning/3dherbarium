'use client'

import { useState, memo, SetStateAction, Dispatch, useEffect } from 'react';
import axios, { AxiosHeaderValue } from 'axios';
import ProgressModal from '@/components/ModelSubmit/ProgressModal';
import MobileSelect from './MobileSelectField';
import ProcessSelect from './ProcessSelectField';
import { Button } from "@nextui-org/react";
import { Divider } from '@nextui-org/react';
import TagInput from './Tags';
import Leaflet from 'leaflet';
import dynamic from 'next/dynamic';
const FormMap = dynamic(() => import('../Map/Form'))
import AutoCompleteWrapper from '../Shared/Form Fields/AutoCompleteWrapper';
import TextInput from '../Shared/TextInput';
import PhotoInput from '../Shared/Form Fields/PhotoInput';

export default function ModelSubmitForm(props: { token: AxiosHeaderValue | string, email: string, isSketchfabLinked: boolean, sketchfab: { organizationUid: string, projectUid: string } }) {

    // Variable initialization

    var uid: string

    const Map = memo(FormMap)

    const [speciesName, setSpeciesName] = useState<string>('')
    const [position, setPosition] = useState<Leaflet.LatLngExpression | null>(null)
    const [artistName, setArtistName] = useState<string>('')
    const [madeWithMobile, setMadeWithMobile] = useState<string>()
    const [buildMethod, setBuildMethod] = useState<string>()
    const [softwareArr, setSoftwareArr] = useState<object[]>([])
    const [tagArr, setTagArr] = useState<object[]>([])
    const [file, setFile] = useState<File | null>(null)
    const [photo, setPhoto] = useState<File>()
    const [uploadDisabled, setUploadDisabled] = useState<boolean>(true)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [success, setSuccess] = useState<boolean | null>(null)
    const [errorMsg, setErrorMsg] = useState<string>('')

    // Upload handler

    const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        // This is the database entry handler
        const modelDbEntry = async () => {
            
            try {

                const data = {
                    email: props.email,
                    artist: artistName,
                    species: speciesName,
                    isMobile: madeWithMobile,
                    methodology: buildMethod,
                    uid: uid,
                    software: softwareArr,
                    tags: tagArr,
                    position: position
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

        // First, we upload the model to sketchfab
        if (!file) return

        try {
            const data = new FormData()
            data.set('orgProject', props.sketchfab.projectUid)
            data.set('modelFile', file)
            data.set('visibility', 'private')
            data.set('options', JSON.stringify({ background: { color: "#000000" } }))

            const orgModelUploadEnd = `https://api.sketchfab.com/v3/orgs/${props.sketchfab.organizationUid}/models`

            const res = await axios.post(orgModelUploadEnd, data, {
                onUploadProgress: (axiosProgressEvent) => setUploadProgress(axiosProgressEvent.progress as number),
                headers: {
                    'Authorization': props.token as AxiosHeaderValue
                }
            })
            uid = res.data.uid
            modelDbEntry()
            setSuccess(true)
        }
        catch (e: any) {
            setErrorMsg(e.message)
            setSuccess(false)
        }
    }

    // This effect checks all necessary fields upon update to enable/disable the upload button
    useEffect(() => {

        if (speciesName && photo && position && artistName && madeWithMobile && buildMethod && softwareArr.length > 0 && file) { setUploadDisabled(false) }
        else { setUploadDisabled(true) }

    }, [speciesName, photo, position, artistName, madeWithMobile, buildMethod, softwareArr, file])

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

                <AutoCompleteWrapper value={speciesName} setValue={setSpeciesName} title='Species Name' required />
                <PhotoInput setFile={setPhoto as Dispatch<SetStateAction<File>>} title="Upload a photo of the specimen for community ID" required leftMargin='ml-12' topMargin='mt-12' bottomMargin='mb-12' />
                <Map position={position} setPosition={setPosition} title required />
                <TagInput title="Enter tags to describe your specimen, such as phenotype(fruits, flowers, development stage, etc.)" setTags={setTagArr} />

                <Divider className='mt-12' />

                <h1 className='ml-12 text-3xl mt-4 mb-4'>Model Data</h1>

                <Divider className='mb-12' />

                <TextInput value={artistName} setValue={setArtistName} title='3D Modeler Name' required leftMargin='ml-12' />
                <MobileSelect value={madeWithMobile} setValue={setMadeWithMobile} />
                <ProcessSelect value={buildMethod} setValue={setBuildMethod} />
                <TagInput title="Enter software used to create the model (must enter at least one)" required setTags={setSoftwareArr as Dispatch<SetStateAction<object[]>>} />

                <div className='my-8 mx-12'>
                    <p className='text-2xl mb-6'>Select your 3D model file.
                        The supported file formats can be found <a href='https://support.fab.com/s/article/Supported-3D-File-Formats' target='_blank'><u>here</u></a>.
                        If your format requires more than one file, zip the files then upload the folder. Maximum upload size is 500 MB.</p>
                    <input onChange={(e) => {
                        if (e.target.files?.[0])
                            setFile(e.target.files[0])
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
