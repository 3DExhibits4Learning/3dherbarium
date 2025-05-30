'use client'

// Typical imports
import { Accordion, AccordionItem } from "@nextui-org/react"
import { model } from "@prisma/client"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { NewModelClicked } from "@/ts/reducer"
import { useContext } from "react"
import { BotanyClientContext } from "./BotanyClient"
import { botanyClientContext } from "@/ts/botanist"
import { Spinner } from "@nextui-org/react"
import AddModelAnnotationModelViewer from "@/components/Admin/Botanist/AddModelAnnotationModelViewer"
import { fullAnnotation } from "@/ts/types"
import { getFullAnnotations } from "@/functions/server/botanist"

// Main JSX
export default function SelectModelToAddAnnotationModel(props: { modelsToAnnotate: model[], uid: string, setUid: Dispatch<SetStateAction<string>> }) {

    const modelClicked = useRef(false)
    const setUid = props.setUid

    const [annotations, setAnnotations] = useState<fullAnnotation[]>()
    const setFullAnnotations = async(uid: string) => setAnnotations(await getFullAnnotations(uid))

    useEffect(() => {if (props.uid) setFullAnnotations(props.uid)}, [props.uid])

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
                            if (modelClicked.current) {
                                setUid(model.uid)
                            }
                            else setUid('')
                        }}>
                        {
                            props.uid && annotations &&
                            <div className="h-[400px]">
                                <AddModelAnnotationModelViewer 
                                uid={props.uid} 
                                firstAnnotationPosition={props.modelsToAnnotate.find(model => model.uid === props.uid)?.annotationPosition as string} 
                                annotations={annotations}/>
                            </div>
                        }
                    </AccordionItem>
                })}
        </Accordion>
    </section>
}