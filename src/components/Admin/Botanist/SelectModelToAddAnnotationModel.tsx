'use client'

// Typical imports
import { Accordion, AccordionItem } from "@heroui/react"
import { model } from "@prisma/client"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import { fullAnnotation } from "@/ts/types"
import { getFullAnnotations } from "@/functions/server/botanist"

// Default imports
import dynamic from "next/dynamic"

// Dynamic imports
const AddModelAnnotationModelViewer = dynamic(() => import('@/components/Admin/Botanist/AddModelAnnotationModelViewer'))

// Main JSX props interface
interface SelectModelToAddAnnotationModelProps {
    modelsToAnnotate: model[],
    model: { uid: string, species: string },
    setModel: Dispatch<SetStateAction<{ uid: string, species: string }>>,
    setPosition: Dispatch<SetStateAction<string>>
}

// Main JSX
export default function SelectModelToAddAnnotationModel(props: SelectModelToAddAnnotationModelProps) {
    // props => variables
    const uid = props.model.uid
    const setModel = props.setModel

    // Ref and state variables
    const modelClicked = useRef(false)
    const [annotations, setAnnotations] = useState<fullAnnotation[]>()

    // Wrapper for setting annotations to getFullAnnotations
    const setFullAnnotations = async (uid: string) => setAnnotations(await getFullAnnotations(uid) as fullAnnotation[])

    // Effect to use wrapper
    useEffect(() => { if (uid) setFullAnnotations(uid) }, [uid])

    return <section className="h-full w-1/5">
        <Accordion
            className="h-full"
            onSelectionChange={(keys: any) => {
                modelClicked.current = keys.size ? true : false
                setAnnotations(undefined) // so that AddModelAnnotationModelViewer is not rerendered until new annotations have been fetched
            }}>
            {
                props.modelsToAnnotate.map((model) => <AccordionItem
                    key={model.uid}
                    aria-label={'Specimen to model'}
                    title={toUpperFirstLetter(model.spec_name)}
                    classNames={{ title: 'text-[ #004C46] text-2xl' }}
                    onPress={() => {
                        if (modelClicked.current) setModel({ uid: model.uid, species: model.spec_name })
                        else {
                            setModel({ uid: '', species: '' })
                            setAnnotations(undefined)
                        }
                    }}>
                    {
                        uid && annotations &&
                        <div className="h-[400px]">
                            <AddModelAnnotationModelViewer
                                uid={uid}
                                firstAnnotationPosition={props.modelsToAnnotate.find(model => model.uid === uid)?.annotationPosition as string}
                                annotations={annotations}
                                setPosition={props.setPosition} />
                        </div>
                    }
                </AccordionItem>)
            }
        </Accordion>
    </section>
}