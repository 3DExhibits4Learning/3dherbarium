'use client'

import { useState, SetStateAction, Dispatch, useEffect } from 'react';
import MobileSelect from '@/components/ModelSubmit/MobileSelectField';
import ProcessSelect from '@/components/ModelSubmit/ProcessSelectField';
import { Button } from "@heroui/react";
import { Divider } from '@heroui/react';
import TagInput from '@/components/ModelSubmit/Tags';
import { LatLngLiteral } from 'leaflet';
import dynamic from 'next/dynamic';
const FormMap = dynamic(() => import('../Map/Form'), { ssr: false })
import AutoCompleteWrapper from '../Shared/Form Fields/AutoCompleteWrapper';
import TextInput from '../Shared/TextInput';
import DataTransferModal from '../Shared/DataTransferModal';
import Delete from './DeleteModal';
import { ModelUpdateObject } from '@/ts/types';

interface EditModelFormProps {
    speciesName: string
    position: LatLngLiteral
    artistName: string
    madeWithMobile: string
    buildMethod: string
    softwareArr: { value: string }[]
    tagsArr: { value: string }[]
    confirmation: string
    modelUid: string
    setOpen: Dispatch<SetStateAction<boolean>>
}

export default function ModelEditForm(props: EditModelFormProps) {

    // Variable initialization
    // Form field states
    const [speciesName, setSpeciesName] = useState<string>(props.speciesName)
    const [position, setPosition] = useState<LatLngLiteral | null>(props.position)
    const [artistName, setArtistName] = useState<string>(props.artistName)
    const [madeWithMobile, setMadeWithMobile] = useState<string>(props.madeWithMobile)
    const [buildMethod, setBuildMethod] = useState<string>(props.buildMethod)
    const [softwareArr, setSoftwareArr] = useState<{ value: string }[]>(props.softwareArr)
    const [tagArr, setTagArr] = useState<{ value: string }[]>(props.tagsArr)
    const [updateDisabled, setUpdateDisabled] = useState<boolean>(true)

    // Data transfer states
    const [open, setOpen] = useState<boolean>(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')

    // Defaults stringified for comparison
    const defaultFormValuesString = JSON.stringify([props.speciesName, props.position, props.artistName, props.madeWithMobile, props.buildMethod, props.softwareArr, props.tagsArr])

    // Truthy Fn
    const truthy = (value: any) => value ? true : false

    // Function to save any data changes
    const saveChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {

        try {

            // Prevent default, set data transfer states
            e.preventDefault()
            setOpen(true)
            setTransferring(true)

            // Update object
            const updateObject: ModelUpdateObject = {
                species: speciesName,
                artist: artistName,
                isMobile: madeWithMobile,
                methodology: buildMethod,
                software: softwareArr.map(software => software.value),
                tags: tagArr.map(tag => tag.value),
                position: position as LatLngLiteral,
                confirmation: props.confirmation
            }

            // Route handler fetch
            const result = await fetch('/api/dashboard/edit', {
                method: 'PATCH',
                body: JSON.stringify(updateObject)
            })
                .then(res => {
                    if (!res.ok) throw Error(res.statusText)
                    return res.json()
                })
                .then(json => json.data)
                .catch((e) => { throw Error(e.message) })

            // Set success results
            setResult(result)
            setTransferring(false)
        }
        catch (e: any) {
            // Set fail results
            setResult("Couldn't upload 3D model")
            setTransferring(false)
        }
    }

    // This effect checks all necessary fields upon update to enable/disable the update button
    useEffect(() => {

        const currentRequiredFormValues = [speciesName, position, artistName, madeWithMobile, buildMethod, softwareArr]
        const currentFormValuesString = JSON.stringify([speciesName, position, artistName, madeWithMobile, buildMethod, softwareArr, tagArr])

        if (currentRequiredFormValues.every(truthy) && currentFormValuesString !== defaultFormValuesString) setUpdateDisabled(false)
        else setUpdateDisabled(true)

    }, [speciesName, position, artistName, madeWithMobile, buildMethod, softwareArr, tagArr])

    return (
        <>
            <DataTransferModal open={open} transferring={transferring} result={result} loadingLabel='Updating Model' href='/dashboard'/>
            <Delete confirmation={props.confirmation} modelUid={props.modelUid} open={deleteModalOpen} setOpen={setDeleteModalOpen}/>
            
            <form className='w-full m-auto bg-[#D5CB9F] dark:bg-[#212121] lg:mb-16 px-12'>

                <Divider />

                <div className='flex items-center h-[75px]'>
                    <p className='text-3xl'>Specimen Data</p>
                </div>

                <Divider className='mb-6' />

                <AutoCompleteWrapper value={speciesName} setValue={setSpeciesName} title='Species Name' required />
                <FormMap position={position} setPosition={setPosition} title required />
                <TagInput title="Enter tags to describe your specimen, such as phenotype(fruits, flowers, development stage, etc.)" setTags={setTagArr} defaultValues={tagArr} />

                <Divider className='mt-12' />

                <h1 className='text-3xl mt-4 mb-4'>Model Data</h1>

                <Divider className='mb-12' />

                <TextInput value={artistName} setValue={setArtistName} title='3D Modeler Name' required />
                <MobileSelect value={madeWithMobile} setValue={setMadeWithMobile} defaultValue={madeWithMobile} />
                <ProcessSelect value={buildMethod} setValue={setBuildMethod} defaultValue={buildMethod} />
                <TagInput title="Enter software used to create the model (must enter at least one)" required setTags={setSoftwareArr as Dispatch<SetStateAction<{ value: string }[]>>} defaultValues={softwareArr} />

                <section className='flex justify-between mt-16 mx-12'>
                    <div>
                        <Button color="primary" className="mr-4" onClick={() => props.setOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            isDisabled={updateDisabled} color="primary" onClick={(e) => saveChanges(e)}>
                            Save Changes
                        </Button>
                    </div>
                    <Button color="danger" variant="light" onClick={() => setDeleteModalOpen(true)}>
                        Delete 3D Model
                    </Button>
                </section>
            </form>
        </>
    )
}