'use client'

import { SetStateAction, useState, Dispatch } from "react"
import Autocomplete from "./AutoComplete"

export default function AutoCompleteWrapper(props: { value: string, setValue: Dispatch<SetStateAction<string>>, title: string, required?: boolean }) {

    const [speciesOptions, setSpeciesOptions] = useState<any[]>([])

    const fetchAutoCompleteSpecies = async () => {
        const speciesOptions = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=47126&rank=species&q=${props.value}`)
            .then(res => res.json()).then(json => json.results)
        setSpeciesOptions(speciesOptions)
    }

    return (
        <div className="w-full mb-8">
            <label className='text-2xl ml-12 mb-2'>
                {props.title}
                {
                    props.required &&
                    <span className="text-red-600 ml-1">*</span>
                }
            </label><br></br>
            <Autocomplete
                options={speciesOptions}
                changeFn={fetchAutoCompleteSpecies}
                width={'w-4/5 md:w-3/5'}
                listWidth={`w-4/5 md:w-3/5 ml-12 max-w-[500px]`}
                className={`inline-block h-[42px] ml-12 max-w-[500px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] px-4 text-[15px] outline-[#004C46] text-black dark:text-white mt-2`}
                value={props.value}
                setValue={props.setValue}
            />
        </div>
    )
}