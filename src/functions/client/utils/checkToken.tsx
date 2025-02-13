'use client'

import { signIn } from "next-auth/react"
import { Dispatch, SetStateAction } from "react"

const checkToken = async (provider: 'sketchfab' | 'inaturalist', setError?: Dispatch<SetStateAction<boolean>>) => {
    
    const tokenValid: boolean | string = await fetch(`/api/access?provider=${provider}`)
        .then(res => res.json())
        .then(json => json.response)

    if (!tokenValid) {
        if (typeof (tokenValid) === 'string') if(setError) setError(true)
        else signIn(provider)
    }

    return tokenValid
}

export default checkToken