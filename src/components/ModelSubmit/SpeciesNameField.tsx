import { MutableRefObject, forwardRef, ForwardedRef, useState } from "react"
import Autocomplete from "../Shared/AutoCompleteRef"

const SpeciesName = forwardRef((props: { handler: Function, edit?: boolean, defaultValue?: string }, ref: ForwardedRef<string>) => {
    const speciesRef = ref as MutableRefObject<string>
    const [speciesOptions, setSpeciesOptions] = useState<any[]>([])

    const fetchAutoCompleteSpecies = async () => {
        const speciesOptions = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=47126&rank=species&q=${speciesRef.current}`)
            .then(res => res.json()).then(json => json.results)
        setSpeciesOptions(speciesOptions)
        props.handler()
    }
    const size = props.edit ? 'w-4/5' : 'w-4/5 md:w-3/5'
    return (
        <div className="w-full mb-8">
            <label className='text-2xl ml-12 '>Species Name</label><br></br>
            <Autocomplete
                options={speciesOptions}
                changeFn={fetchAutoCompleteSpecies}
                width={size}
                listWidth={`${size} ml-12 max-w-[500px]`}
                defaultValue={props.defaultValue}
                ref={speciesRef}
                className={`inline-block h-[42px] ml-12 max-w-[500px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] px-4 text-[15px] outline-[#004C46] text-black dark:text-white`} />
        </div>
    )
})
SpeciesName.displayName = 'SpeciesName'
export default SpeciesName