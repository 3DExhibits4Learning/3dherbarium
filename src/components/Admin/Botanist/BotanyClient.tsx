/**
 * @file src/components/Admin/Botanist/BotanyClient.tsx
 * 
 * @fileoverview botanist administrator client
 * 
 * @todo refactor, test
 */

'use client'

// Typical imports
import { Accordion, AccordionItem } from "@nextui-org/react"
import { useEffect, useState, useRef, createContext, useReducer } from "react"
import { model } from "@prisma/client"
import { botanyClientContext } from "@/ts/botanist"
import { initialBotanyClientState } from "@/ts/botanist"
import { activeAnnotationIndexDispatch, getAnnotationsObj } from "@/functions/client/admin/botanist"
import { ModelSelect } from "./ModelSelect"

// Default imports
import AreYouSure from "../../Shared/AreYouSure"
import NewSpecimenEntry from "../NewSpecimenEntry"
import DataTransferModal from "@/components/Shared/DataTransferModal"
import terminateDataTransfer from "@/functions/client/dataTransfer/terminateDataTransfer"
import initializeDataTransfer from "@/functions/client/dataTransfer/initializeDataTransfer"
import botanyClientReducer from "@/functions/client/reducers/botanyClientReducer"
import AnnotationEntryWrapper from "./AnnotationEntryWrapper"

// Exported context
export const BotanyClientContext = createContext<botanyClientContext | ''>('')

// Main JSX
export default function BotanyClient(props: { modelsToAnnotate: model[], annotationModels: model[] }) {

    // Reducer
    const [botanyState, botanyDispatch] = useReducer(botanyClientReducer, initialBotanyClientState)

    // "Are you sure" modal state, selected accordion key state
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [selectedKey, setSelectedKey] = useState<any>()

    // Data transfer states
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>('')

    // Data transfer handlers
    const initializeDataTransferHandler = (loadingLabel: string) => initializeDataTransfer(setOpenModal, setTransferring, setLoadingLabel, loadingLabel)
    const terminateDataTransferHandler = (result: string) => terminateDataTransfer(setResult, setTransferring, result)

    // Refs
    const newAnnotationEnabled = useRef<boolean>(false)

    // Effects: dispatch (handler) for active annotation changes, and an annotations getter for when an annotation is saved/deleted or a new model is selected
    useEffect(() => activeAnnotationIndexDispatch(botanyState, botanyDispatch), [botanyState.activeAnnotationIndex]) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => { getAnnotationsObj(botanyState.uid as string, newAnnotationEnabled, botanyDispatch) }, [botanyState.uid, botanyState.annotationSavedOrDeleted])
    useEffect(() => console.log(selectedKey?.keys()))

    return <BotanyClientContext.Provider value={{ botanyState, botanyDispatch }}>

        <DataTransferModal open={openModal} transferring={transferring} result={result} loadingLabel={loadingLabel} href='/admin/botanist' />
        
        <AreYouSure uid={botanyState.uid as string} open={modalOpen} setOpen={setModalOpen} species={botanyState.specimenName as string} />

        <Accordion className="w-full" onSelectionChange={setSelectedKey}>
            
            <AccordionItem key={'newSpecimen'} aria-label={'New Specimen'} title={"I've acquired a new specimen"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                <NewSpecimenEntry initializeTransfer={initializeDataTransferHandler} terminateTransfer={terminateDataTransferHandler} />
            </AccordionItem>
            
            <AccordionItem key={'annotate'} aria-label={'annotate'} title={"I want to annotate a 3D model"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                <section className="flex w-full h-full">
                    <ModelSelect modelsToAnnotate={props.modelsToAnnotate} setModalOpen={setModalOpen} ref={newAnnotationEnabled} />
                    <AnnotationEntryWrapper annotationModels={props.annotationModels} />
                </section>
            </AccordionItem>
        
        </Accordion>

    </BotanyClientContext.Provider>
}