'use client'
import { useRef, LegacyRef, useState } from "react"
import { Button } from "@nextui-org/react"
import DataTransferModal from "../Shared/DataTransferModal"
import { modelInsertion } from "@/api/types"
import AutoComplete from "../Shared/AutoCompleteRef"

export default function New3DModel() {

    const species = useRef<string>()
    const speciesAcquisitionDate = useRef<HTMLInputElement>()
    const commonName = useRef<HTMLInputElement>()
    const uid = useRef<HTMLInputElement>()
    const modeler = useRef<HTMLInputElement>()
    const isViable = useRef<HTMLSelectElement>()
    const isBase = useRef<HTMLSelectElement>()

    const [disabled, setDisabled] = useState<boolean>(true)
    const [insertionModalOpen, setInsertionModalOpen] = useState<boolean>(false)
    const [inserting, setInserting] = useState<boolean>(false)
    const [insertionResult, setInsertionResult] = useState<string>('')
    const [speciesOptions, setSpeciesOptions] = useState<any[]>([])

    const allTruthy = (value: any) => value ? true : false

    const buttonEnable = () => {
        const refArray = [species.current, speciesAcquisitionDate.current?.value, commonName.current?.value, uid.current?.value, modeler.current?.value]
        if (refArray.every(allTruthy)) setDisabled(false)
        else setDisabled(true)
    }

    const dataHandler = async () => {
        setInsertionModalOpen(true)
        setInserting(true)

        const lowerCommon = commonName.current?.value.toLowerCase()

        const insertObj: modelInsertion = {
            species: species.current as string,
            acquisitionDate: speciesAcquisitionDate.current?.value as string,
            commonName: lowerCommon as string,
            uid: uid.current?.value as string,
            modeler: modeler.current?.value as string,
            isViable: isViable.current?.value.toString() as string,
            isBase: isBase.current?.value.toString() as string
        }
        await fetch('/api/admin/modeler/model', {
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
            <DataTransferModal open={insertionModalOpen} transferring={inserting} result={insertionResult} loadingLabel="Entering Model Data into Database" href='/admin/modeler' />
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
                <label className='text-2xl ml-12 block mb-2'>Specimen Acquisition Date</label>
                <input ref={speciesAcquisitionDate as LegacyRef<HTMLInputElement>} type='date' className={`w-[10%] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 !placeholder-[#9797A0] outline-[#004C46]`} onChange={buttonEnable}></input>
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Preferred Common Name</label>
                <input ref={commonName as LegacyRef<HTMLInputElement>} type='text' className={`w-1/5 max-w-[500px] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`} onChange={buttonEnable}></input>
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>UID</label>
                <input ref={uid as LegacyRef<HTMLInputElement>} type='text' className={` w-[7.5%] min-w-[250px] max-w-[500px] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`} onChange={buttonEnable}></input>
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>3D Modeler</label>
                <input ref={modeler as LegacyRef<HTMLInputElement>} type='text' defaultValue={'Hunter Phillips'} className={`w-1/5 max-w-[500px] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`} onChange={buttonEnable}></input>
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Viable</label>
                <select className='ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 rounded-xl outline-[#004C46]' ref={isViable as LegacyRef<HTMLSelectElement>} onChange={buttonEnable}>
                    <option value={'1'}>Yes</option>
                    <option value={'0'}>No</option>
                </select>
            </div>
            <div className="mb-6">
                <label className='text-2xl ml-12 block mb-2'>Base Model</label>
                <select className='ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 rounded-xl outline-[#004C46]' ref={isBase as LegacyRef<HTMLSelectElement>} onChange={buttonEnable}>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
            <div className="ml-12 my-8">
                <Button isDisabled={disabled} className="text-white text-xl" onPress={dataHandler}>
                    Enter Model Data into Database
                </Button>
            </div>
        </>
    )
}