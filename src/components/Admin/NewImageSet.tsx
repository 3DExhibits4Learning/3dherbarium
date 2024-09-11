'use client'
import { useRef, LegacyRef, useState } from "react"
import { Button } from "@nextui-org/react"
import DataTransferModal from "../Shared/DataTransferModal"
import { imageInsertion } from "@/api/types"
import AutoComplete from "../Shared/AutoComplete"

export default function NewImageSet() {

    const species = useRef<string>()
    const speciesAcquisitionDate = useRef<HTMLInputElement>()
    const imagedBy = useRef<HTMLInputElement>()
    const imagedDate = useRef<HTMLInputElement>()
    const numberOfImages = useRef<HTMLInputElement>()

    const [disabled, setDisabled] = useState<boolean>(true)
    const [insertionModalOpen, setInsertionModalOpen] = useState<boolean>(false)
    const [inserting, setInserting] = useState<boolean>(false)
    const [insertionResult, setInsertionResult] = useState<string>('')
    const [speciesOptions, setSpeciesOptions] = useState<any[]>([])

    const buttonEnable = () => {

        if (species.current && speciesAcquisitionDate.current?.value && imagedBy.current?.value && imagedDate.current?.value, numberOfImages.current?.value) {
            setDisabled(false)
        }
        else {
            setDisabled(true)
        }
    }

    const dataHandler = async () => {
        setInsertionModalOpen(true)
        setInserting(true)

        const insertObj: imageInsertion = {
            species: species.current as string,
            acquisitionDate: speciesAcquisitionDate.current?.value as string,
            imagedBy: imagedBy.current?.value as string,
            imagedDate: imagedDate.current?.value as string,
            numberOfImages: numberOfImages.current?.value as string
        }
        await fetch('/api/admin/modeler/photos', {
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

    return (
        <>
            <DataTransferModal open={insertionModalOpen} transferring={inserting} result={insertionResult} loadingLabel="Entering Image Data into Database" href='/admin/modeler' />
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
                <label className='text-2xl ml-12 block mb-2'>Specimen Acquisition Date </label>
                <input ref={speciesAcquisitionDate as LegacyRef<HTMLInputElement>} type='date' className={`w-[10%] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 !placeholder-[#9797A0] outline-[#004C46]`} onChange={buttonEnable}></input>
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Photography Date</label>
                <input ref={imagedDate as LegacyRef<HTMLInputElement>} type='date' className={`w-[10%] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 !placeholder-[#9797A0] outline-[#004C46]`} onChange={buttonEnable}></input>
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Photographer</label>
                <input ref={imagedBy as LegacyRef<HTMLInputElement>} type='text' defaultValue={'Hunter Phillips'} className={`w-1/5 max-w-[500px] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`} onChange={buttonEnable}></input>
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Number of Images</label>
                <input ref={numberOfImages as LegacyRef<HTMLInputElement>} type='number' className='ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 rounded-xl outline-[#004C46] w-[100px]' onChange={buttonEnable}></input>
            </div>
            <div className="ml-12 my-8">
                <Button isDisabled={disabled} className="text-white text-xl" onPress={dataHandler}>
                    Enter Image Data into Database
                </Button>
            </div>
        </>
    )
}