'use client'
import { useRef, LegacyRef, useState, useEffect } from "react"
import { Button } from "@nextui-org/react"
import DataTransferModal from "../Shared/DataTransferModal"
import { specimenInsertion } from "@/api/types"
import AutoComplete from "../Shared/AutoComplete"

export default function NewSpecimenEntry() {

    const species = useRef<string>()
    const speciesAcquisitionDate = useRef<HTMLInputElement>()
    const procurer = useRef<HTMLInputElement>()
    const genus = useRef<string>()
    const isLocal = useRef<HTMLSelectElement>()

    const [disabled, setDisabled] = useState<boolean>(true)
    const [insertionModalOpen, setInsertionModalOpen] = useState<boolean>(false)
    const [inserting, setInserting] = useState<boolean>(false)
    const [insertionResult, setInsertionResult] = useState<string>('')
    const [speciesOptions, setSpeciesOptions] = useState<any[]>([])
    const [genusOptions, setGenusOptions] = useState<any[]>([])

    const allTruthy = (value: any) => value ? true : false

    const buttonEnable = () => {
        const refArray = [species.current, speciesAcquisitionDate.current?.value, procurer.current?.value, genus.current, isLocal.current?.value]
        if (refArray.every(allTruthy)) setDisabled(false)
        else setDisabled(true)

    }

    const dataHandler = async () => {
        const local = isLocal.current?.value ? true : false
        setInsertionModalOpen(true)
        setInserting(true)

        const insertObj: specimenInsertion = {
            requestType: 'specimenEntry',
            species: species.current as string,
            acquisitionDate: speciesAcquisitionDate.current?.value as string,
            procurer: procurer.current?.value as string,
            isLocal: local,
            genus: genus.current as string
        }
        await fetch('/api/admin/modeler', {
            method: 'POST',
            body: JSON.stringify(insertObj)
        }).then(res => res.json()).then(json => {
            setInsertionResult(json.data)
            setInserting(false)
        })
    }

    const fetchAutoCompleteSpecies = async () => {
        const speciesOptions = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=47126&rank=species&q=${species.current}`)
            .then(res => res.json()).then(json => json.results)
        setSpeciesOptions(speciesOptions)
    }

    const fetchAutoCompleteGenus = async () => {
        const genusOptions = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=47126&rank=genus&q=${genus.current}`)
            .then(res => res.json()).then(json => json.results)
        setGenusOptions(genusOptions)
    }

    return (
        <>
            <DataTransferModal open={insertionModalOpen} transferring={inserting} result={insertionResult} loadingLabel="Entering specimen into database" href='/admin/modeler' />
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Genus</label>
                <AutoComplete
                    options={genusOptions}
                    changeFn={fetchAutoCompleteGenus}
                    ref={genus}
                    className="inline-block h-[42px] ml-12 max-w-[500px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] px-4 text-[15px] outline-[#004C46] text-black dark:text-white"
                    width='w-1/5 max-w-[500px]'
                    listWidth="w-1/5 max-w-[500px] ml-12"
                />
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Species</label>
                <AutoComplete
                    options={speciesOptions}
                    changeFn={fetchAutoCompleteSpecies}
                    ref={species}
                    className="inline-block h-[42px] ml-12 max-w-[500px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] px-4 text-[15px] outline-[#004C46] text-black dark:text-white"
                    width='w-1/5 max-w-[500px]'
                    listWidth="w-1/5 max-w-[500px] ml-12"
                />
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Local Specimen?</label>
                <select className='ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 rounded-xl outline-[#004C46]' ref={isLocal as LegacyRef<HTMLSelectElement>} onChange={buttonEnable}>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Species Acquisition Date </label>
                <input ref={speciesAcquisitionDate as LegacyRef<HTMLInputElement>} type='date' className={`w-[10%] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 !placeholder-[#9797A0] outline-[#004C46]`} onChange={buttonEnable}></input>
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Procurer </label>
                <input ref={procurer as LegacyRef<HTMLInputElement>} type='text' defaultValue={'Hunter Phillips'} className={`w-1/5 max-w-[500px] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`} onChange={buttonEnable}></input>
            </div>
            <div className="ml-12 my-8">
                <Button isDisabled={disabled} className="text-white text-xl" onPress={dataHandler}>
                    Enter Specimen into Database
                </Button>
            </div>
        </>
    )
}