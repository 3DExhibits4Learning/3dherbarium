'use client'

import { SetStateAction, Dispatch } from "react"

const fetchAutoCompleteOptions = async (query: string | undefined, setAutocompleteOptions: Dispatch<SetStateAction<any[]>>) => {
    if (query) {
        const autocompleteOptions = await fetch(`https://api.inaturalist.org/v1/taxa/autocomplete?taxon_id=47126&rank=species,genus&q=${query}`)
            .then(res => res.json()).then(json => json.results)
        setAutocompleteOptions(autocompleteOptions)
    }
}

export default fetchAutoCompleteOptions