'use client'

import { useContext } from "react"
import { BotanyClientContext } from "../BotanyClient"
import { botanyClientContext } from "@/ts/botanist"
import { SetPosition } from "@/ts/reducer"

export default function AnnotationReposition() {

    // Context
    const context = useContext(BotanyClientContext) as botanyClientContext
    const botanyState = context.botanyState
    const dispatch = context.botanyDispatch

    return (
        <>
            <div className="flex items-center">
                <input type='checkbox'
                    className="ml-12"
                    checked={botanyState.repositionEnabled}
                    onChange={() => {
                        dispatch({type:"setRepositionEnabled"})
                        const positionDispatchObj: SetPosition = {type:"setPosition", position: undefined}; dispatch(positionDispatchObj)
                    }}
                >
                </input>
                <p className="ml-2">Annotation Reposition</p>
            </div>
        </>
    )
}