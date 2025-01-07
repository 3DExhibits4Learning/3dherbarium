/**
 * @file src\components\Admin\NewSpecimenEntry.tsx
 * 
 * @fileoverview allows administrators to enter a new specimen into the database
 */

'use client'

// Typical imports
import { useState, useEffect, useContext } from "react"
import { Button } from "@nextui-org/react"
import { specimenInsertion } from "@/api/types"
import { dataTransfer, ModelerContext } from "./Modeler/ModelerDash"
import { insertSpecimenIntoDatabase } from "@/functions/client/admin/modeler"
import { buttonEnable } from "@/functions/client/shared"
import { LatLngLiteral } from "leaflet"

// Default imports
import TextInput from "../Shared/TextInput"
import DateInput from "../Shared/Form Fields/DateInput"
import YesOrNo from "../Shared/Form Fields/YesOrNo"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"
import AutoCompleteWrapper from "../Shared/Form Fields/AutoCompleteWrapper"
import dynamic from "next/dynamic"

// Dynamic imports 
const MapToSetLocation = dynamic(() => import('../Map/MapToSetLocation'), { ssr: false })

// Main JSX
export default function NewSpecimenEntry() {

    // Data transfer context
    const context = useContext(ModelerContext) as dataTransfer
    const initializeTransfer = context.initializeDataTransferHandler
    const terminateTransfer = context.terminateDataTransferHandler

    // Form field states
    const [genus, setGenus] = useState<string>('')
    const [species, setSpecies] = useState<string>('')
    const [acquisitionDate, setAcquisitionDate] = useState<string>()
    const [procurer, setProcurer] = useState<string>('')
    const [isLocal, setIsLocal] = useState<boolean>()
    const [disabled, setDisabled] = useState<boolean>(true)
    const [position, setPosition] = useState<LatLngLiteral>()

    // Specimen insertion handeler
    const insertSpecimenHandler = async () => {

        // Specimen insertion object
        const insertObj: specimenInsertion = {
            species: species,
            acquisitionDate: acquisitionDate as string,
            procurer: procurer,
            isLocal: isLocal as boolean,
            genus: genus
        }

        // Handle data transfer
        await dataTransferHandler(initializeTransfer, terminateTransfer, insertSpecimenIntoDatabase, [insertObj], 'Entering specimen into database')
    }

    useEffect(() => buttonEnable([species, acquisitionDate, procurer, genus, isLocal], setDisabled))

    return (
        <section className="px-12">
            <AutoCompleteWrapper value={genus} setValue={setGenus} title='Genus' required rank='genus' />
            <AutoCompleteWrapper value={species} setValue={setSpecies} title='Species' required />
            <TextInput value={procurer} setValue={setProcurer} title='Procurer' required />
            <YesOrNo value={isLocal} setValue={setIsLocal} title='Native species?' required />
            <DateInput value={acquisitionDate} setValue={setAcquisitionDate} />
            <Button isDisabled={disabled} className="text-white text-xl" onPress={insertSpecimenHandler}>
                Enter Specimen into Database
            </Button>
            <MapToSetLocation position={position} setPosition={setPosition} />
        </section>
    )
}