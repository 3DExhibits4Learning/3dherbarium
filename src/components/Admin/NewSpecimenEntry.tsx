/**
 * @file src\components\Admin\NewSpecimenEntry.tsx
 * 
 * @fileoverview allows administrators to enter a new specimen into the database
 */

'use client'

// Typical imports
import { useState, useEffect, useContext, SetStateAction, Dispatch } from "react"
import { Button } from "@heroui/react"
import { ModelerContext } from "./Modeler/ModelerDash"
import { insertSpecimenIntoDatabase } from "@/functions/client/admin/modeler"
import { buttonEnable } from "@/functions/client/shared"
import { LatLngLiteral } from "leaflet"
import { dataTransfer } from "@/ts/types"

// Default imports
import TextInput from "../Shared/Form Fields/TextInput"
import DateInput from "../Shared/Form Fields/DateInput"
import YesOrNo from "../Shared/Form Fields/YesOrNo"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"
import AutoCompleteWrapper from "../Shared/Form Fields/AutoCompleteWrapper"
import dynamic from "next/dynamic"
import TextArea from "../Shared/Form Fields/TextArea"
import Form from "../Shared/Form"
import PhotoInput from "../Shared/Form Fields/PhotoInput"

// Dynamic imports 
const MapToSetLocation = dynamic(() => import('../Map/MapToSetLocation'), { ssr: false })

// Main JSX
export default function NewSpecimenEntry(props:{initializeTransfer?: Function, terminateTransfer?: Function}) {

    // Data transfer context
    const context = useContext(ModelerContext) as dataTransfer
    const initializeTransfer = props.initializeTransfer ? props.initializeTransfer : context.initializeDataTransferHandler 
    const terminateTransfer = props.terminateTransfer ? props.terminateTransfer : context.terminateDataTransferHandler

    // Form field states
    const [genus, setGenus] = useState<string>('')
    const [species, setSpecies] = useState<string>('')
    const [acquisitionDate, setAcquisitionDate] = useState<string>()
    const [procurer, setProcurer] = useState<string>('')
    const [isLocal, setIsLocal] = useState<boolean>(true)
    const [disabled, setDisabled] = useState<boolean>(true)
    const [position, setPosition] = useState<LatLngLiteral>()
    const [height, setHeight] = useState<string>('')
    const [locality, setLocality] = useState<string>('')
    const [file, setFile] = useState<FileList>()

    // Specimen insertion handeler
    const insertSpecimenHandler = async () => {

        // Create and set form data
        const data = new FormData()

        data.set('species', species)
        data.set('acquisitionDate', acquisitionDate as string)
        data.set('procurer', procurer as string)
        data.set('isLocal', isLocal ? 'true' : 'false')
        data.set('genus', genus)
        data.set('height', height)
        data.set('locality', locality)
        data.set('position', JSON.stringify(position))
        data.set('photo', (file as FileList)[0] as File)

        // Handle data transfer
        await dataTransferHandler(initializeTransfer, terminateTransfer, insertSpecimenIntoDatabase, [data], 'Entering specimen into database')
    }

    // Button enabler
    useEffect(() => buttonEnable([species, acquisitionDate, procurer, genus, position, height, locality, file], setDisabled))

    return (
        <section className="w-full flex justify-center">
            <article className="w-1/2 mb-12">
            <Form title='3D Herbarium Specimen Entry Form'>
                <AutoCompleteWrapper value={genus} setValue={setGenus} title='Genus' required rank='genus' />
                <AutoCompleteWrapper value={species} setValue={setSpecies} title='Species' required />
                <TextInput value={procurer} setValue={setProcurer} title='Procurer' required textSize="text-2xl" />
                <PhotoInput setFile={setFile as Dispatch<SetStateAction<FileList>>} title='Select photo of specimen' required/>
                <YesOrNo value={isLocal} setValue={setIsLocal} title='Native species?' required />
                <DateInput value={acquisitionDate} setValue={setAcquisitionDate} title="Date acquired" required />
                <TextInput value={height} setValue={setHeight} title='Specimen height (cm)' required type='number' textSize="text-2xl" maxWidth="max-w-[250px]" />
                <MapToSetLocation position={position} setPosition={setPosition} title mapSize='h-[400px] ww-[400px]' required/>
                <TextArea value={locality} setValue={setLocality} title='Describe locality (scenery, landmarks, adjacent species, etc.)' required />
                <div>
                    <Button isDisabled={disabled} className="text-white text-xl mt-8 mb-6 bg-[#004C46]" onPress={insertSpecimenHandler}>
                        Enter Specimen into Database
                    </Button>
                </div>
            </Form>
            </article>
        </section>
    )
}