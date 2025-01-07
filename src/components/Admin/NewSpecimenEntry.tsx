/**
 * @file src\components\Admin\NewSpecimenEntry.tsx
 * 
 * @fileoverview allows administrators to enter a new specimen into the database
 */

'use client'

// Typical imports
import { useState, useEffect } from "react"
import { Button } from "@nextui-org/react"
import { specimenInsertion } from "@/api/types"

// Default imports
import DataTransferModal from "../Shared/DataTransferModal"
import TextInput from "../Shared/TextInput"
import DateInput from "../Shared/Form Fields/DateInput"
import YesOrNo from "../Shared/Form Fields/YesOrNo"
import Autocomplete from "../Shared/Form Fields/AutoComplete"

// Main JSX
export default function NewSpecimenEntry() {

    // Form field states
    const [genus, setGenus] = useState<string>('')
    const [species, setSpecies] = useState<string>('')
    const [acquisitionDate, setAcquisitionDate] = useState<string>()
    const [procurer, setProcurer] = useState<string>('')
    const [isLocal, setIsLocal] = useState<boolean>()
    const [disabled, setDisabled] = useState<boolean>(true)

    // Data transfer states
    const [insertionModalOpen, setInsertionModalOpen] = useState<boolean>(false)
    const [inserting, setInserting] = useState<boolean>(false)
    const [insertionResult, setInsertionResult] = useState<string>('')
    
    // Autocomplete option states
    const [speciesOptions, setSpeciesOptions] = useState<any[]>([])
    const [genusOptions, setGenusOptions] = useState<any[]>([])

    const buttonEnable = (values: any[]) => {   
        if (values.every((value) => value)) setDisabled(false)
        else setDisabled(true)
    }

    const dataHandler = async () => {
        
        setInsertionModalOpen(true)
        setInserting(true)

        const insertObj: specimenInsertion = {
            species: species,
            acquisitionDate: acquisitionDate as string,
            procurer: procurer,
            isLocal: isLocal as boolean,
            genus: genus
        }

        await fetch('/api/admin/modeler/specimen', {
            method: 'POST',
            body: JSON.stringify(insertObj)
        }).then(res => res.json()).then(json => {
            setInsertionResult(json.data)
            setInserting(false)
        })
    }

    const fetchAutoCompleteSpecies = async () => {
        const speciesOptions = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=47126&rank=species&q=${species}`)
            .then(res => res.json()).then(json => json.results)
        setSpeciesOptions(speciesOptions)
    }

    const fetchAutoCompleteGenus = async () => {
        const genusOptions = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=47126&rank=genus&q=${genus}`)
            .then(res => res.json()).then(json => json.results)
        setGenusOptions(genusOptions)
    }

    useEffect(() => buttonEnable([species, acquisitionDate, procurer, genus, isLocal]))

    return (
        <>
            <DataTransferModal open={insertionModalOpen} transferring={inserting} result={insertionResult} loadingLabel="Entering specimen into database" href='/admin/modeler' />
            <Autocomplete options={genusOptions} changeFn={fetchAutoCompleteGenus} width='w-1/5 max-w-[500px]' value={genus} setValue={setGenus}/>
            <Autocomplete options={speciesOptions} changeFn={fetchAutoCompleteSpecies} width='w-1/5 max-w-[500px]' value={species} setValue={setSpecies}/>
            <YesOrNo value={isLocal} setValue={setIsLocal} title='Local Specimen?' required/>
            <DateInput value={acquisitionDate} setValue={setAcquisitionDate}/>
            <TextInput value={procurer} setValue={setProcurer} title='Procurer' required/>
            <div className="ml-12 my-8">
                <Button isDisabled={disabled} className="text-white text-xl" onPress={dataHandler}>
                    Enter Specimen into Database
                </Button>
            </div>
        </>
    )
}