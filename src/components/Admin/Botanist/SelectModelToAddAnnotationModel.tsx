'use client'

// Typical imports
import { Accordion, AccordionItem } from "@nextui-org/react"
import { model } from "@prisma/client"
import { Dispatch, SetStateAction, useRef, useState } from "react"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { NewModelClicked } from "@/ts/reducer"
import { useContext } from "react"
import { BotanyClientContext } from "./BotanyClient"
import { botanyClientContext } from "@/ts/botanist"
import { Spinner } from "@nextui-org/react"
import AddModelAnnotationModelViewer from "@/components/Admin/Botanist/AddModelAnnotationModelViewer"

// Main JSX
export default function SelectModelToAddAnnotationModel(props:{modelsToAnnotate: model[], uid: string, setUid: Dispatch<SetStateAction<string>>}){

    const modelClicked = useRef(false)
    const setUid = props.setUid

    return <section className="h-full w-1/5">
        <Accordion className="h-full" onSelectionChange={(keys: any) => modelClicked.current = keys.size ? true : false}>
            {
                props.modelsToAnnotate.map((model, i) => {
                    return <AccordionItem
                        key={i}
                        aria-label={'Specimen to model'}
                        title={toUpperFirstLetter(model.spec_name)}
                        classNames={{ title: 'text-[ #004C46] text-2xl' }}
                        onPress={() => {
                            if (modelClicked.current) setUid(model.uid)
                            else setUid('')
                        }}>
                        {props.uid && <div className="h-[400px]"><AddModelAnnotationModelViewer uid={props.uid}/></div>}
                    </AccordionItem>
                })}
        </Accordion>
    </section>
}