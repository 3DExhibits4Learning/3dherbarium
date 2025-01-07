import { specimenInsertion } from "@/api/types"
import { SetStateAction, Dispatch } from "react"

export const insertSpecimenIntoDatabase = async (specimenInsertObject: specimenInsertion) => {
    return await fetch('/api/admin/modeler/specimen', {
        method: 'POST',
        body: JSON.stringify(specimenInsertObject)
    }).then(res => res.json()).then(json => json.data)
}

export const setAutocompleteOptions = async (speciesOrGenus: 'species' | 'genus', query: string, setOptions: Dispatch<SetStateAction<any>> ) => {
    await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=47126&rank=${speciesOrGenus}&q=${query}`).then(res => res.json()).then(json => setOptions(json.results))
}