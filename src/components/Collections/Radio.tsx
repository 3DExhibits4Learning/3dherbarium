'use client'

import { SetStateAction, useContext, Dispatch } from "react"
import { CollectionsContext } from "./CollectionsWrapper"
import { CollectionsWrapperData } from "@/ts/reducer"

export default function CollectionsMediaRadio(props: { setIsSelected: Dispatch<SetStateAction<boolean>> }) {

    const context = (useContext(CollectionsContext) as CollectionsWrapperData)
    const mediaState = context.mediaState
    const dispatch = context.mediaStateDispatch

    return (
        <div className="flex ml-6">
            <label className="mr-1">3D Model</label>
            <input className="mr-8" name='collectionsMedia' type='radio' value='model' checked={mediaState.modelChecked} onChange={() => { dispatch({ type: 'modelChecked' }); props.setIsSelected(true) }}></input>
            <label className="mr-1">Photos</label>
            <input className="mr-8" name='collectionsMedia' type='radio' value='photos' checked={mediaState.photosChecked} onChange={() => dispatch({ type: 'photosChecked' })}></input>
            <label className="mr-1">Observations</label>
            <input name='collectionsMedia' type='radio' value='observations' checked={mediaState.observationsChecked} onChange={() => dispatch({ type: 'observationsChecked' })}></input>
        </div>
    )
}