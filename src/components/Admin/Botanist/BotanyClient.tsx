/**
 * @file src/components/Admin/Botanist/BotanyClient.tsx
 * 
 * @fileoverview botanist administrator client
 * 
 * @todo refactor, test
 */

'use client'

// Typical imports
import { Accordion, AccordionItem } from "@heroui/react"
import { useEffect, useState, useRef, createContext, useReducer } from "react"
import { model } from "@prisma/client"
import { botanyClientContext } from "@/ts/botanist"
import { initialBotanyClientState } from "@/ts/botanist"
import { activeAnnotationIndexDispatch, getAnnotationsObj } from "@/functions/client/admin/botanist"
import { ModelSelect } from "./ModelSelect"
import { AnnotationNumbers } from "@/components/Admin/Botanist/AnnotationSubcomponents/AnnotationNumber"
import { renumberAnnotationsServer } from "@/functions/server/botanist"

// Default imports
import AreYouSure from "../../Shared/AreYouSure"
import NewSpecimenEntry from "../NewSpecimenEntry"
import DataTransferModal from "@/components/Shared/DataTransferModal"
import terminateDataTransfer from "@/functions/client/dataTransfer/terminateDataTransfer"
import initializeDataTransfer from "@/functions/client/dataTransfer/initializeDataTransfer"
import botanyClientReducer from "@/functions/client/reducers/botanyClientReducer"
import AnnotationEntryWrapper from "./AnnotationEntryWrapper"
import Tasks from "../Tasks/Tasks"
import AddModelAnnotationToPublishedModel from "@/components/Admin/Botanist/AddModelAnnotationToPublishedModel"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"
import RenumberAnnotations from "@/components/Admin/Botanist/RenumberAnnotations"

// Exported context
export const BotanyClientContext = createContext<botanyClientContext | ''>('')

// Main JSX
export default function BotanyClient(props: { modelsToAnnotate: model[], annotationModels: model[], epic: any, baseModelsForAnnotationModels: model[] }) {

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

    // Annotation renumber state
    const [renumberOpen, setRenumberOpen] = useState(false)

    // Data transfer handlers
    const initializeDataTransferHandler = (loadingLabel: string) => initializeDataTransfer(setOpenModal, setTransferring, setLoadingLabel, loadingLabel)
    const terminateDataTransferHandler = (result: string) => terminateDataTransfer(setResult, setTransferring, result)

    // Annotation renumber handler
    const renumberAnnotations = async(annotationNumbers: AnnotationNumbers) => await dataTransferHandler(initializeDataTransferHandler, terminateDataTransferHandler, renumberAnnotationsServer, [annotationNumbers], 'Renumbering annotations')

    // Ref
    const newAnnotationEnabled = useRef<boolean>(false)

    // @ts-ignore sort models to annotate by date
    props.modelsToAnnotate.sort((a, b) => new Date(a.spec_acquis_date) - new Date(b.spec_acquis_date))

    // Effects: dispatch (handler) for active annotation changes, an annotations getter for when an annotation is saved/deleted or a new model is selected, 
    // and data reset when the annotations accordion item is closed
    useEffect(() => activeAnnotationIndexDispatch(botanyState, botanyDispatch), [botanyState.activeAnnotationIndex]) // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => { getAnnotationsObj(botanyState.uid as string, newAnnotationEnabled, botanyDispatch) }, [botanyState.uid, botanyState.annotationSavedOrDeleted])
    useEffect(() => { if (!selectedKey?.has('annotate')) botanyDispatch({ type: 'undefineUidAndActiveAnnotation' }) }, [selectedKey])

    return <BotanyClientContext.Provider value={{ botanyState, botanyDispatch, initializeDataTransferHandler, terminateDataTransferHandler }}>

        <DataTransferModal open={openModal} transferring={transferring} result={result} loadingLabel={loadingLabel} href='/admin/botanist' />
        <AreYouSure uid={botanyState.uid as string} open={modalOpen} setOpen={setModalOpen} species={botanyState.specimenName as string} sid={botanyState.sid as string} />
        {botanyState.annotations && botanyState.annotations.length >=2 && botanyState.uid && <RenumberAnnotations isOpen={renumberOpen} setIsOpen={setRenumberOpen} renumberAnnotations={renumberAnnotations}/>}

        <section className="w-full h-full flex">

            <Accordion className="w-full overflow-y-auto" onSelectionChange={setSelectedKey}>

                <AccordionItem key={'newSpecimen'} aria-label={'New Specimen'} title={"I've acquired a new specimen"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                    <NewSpecimenEntry initializeTransfer={initializeDataTransferHandler} terminateTransfer={terminateDataTransferHandler} />
                </AccordionItem>

                <AccordionItem key={'annotate'} aria-label={'annotate'} title={"I want to annotate a 3D model"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                    <section className="flex w-full h-full">
                        <ModelSelect modelsToAnnotate={[props.modelsToAnnotate[0]]} setModalOpen={setModalOpen} setReorderOpen={setRenumberOpen} ref={newAnnotationEnabled} />
                        <AnnotationEntryWrapper annotationModels={props.annotationModels} />
                    </section>
                </AccordionItem>

                <AccordionItem key={'Add annotation model'} aria-label={'Add annotation model'} title={"I want to add a model annotation to published 3D model"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                    <AddModelAnnotationToPublishedModel baseModelsForAnnotationModels={props.baseModelsForAnnotationModels} annotationModels={props.annotationModels} />
                </AccordionItem>

            </Accordion>

            <div className="w-1/5 h-full flex border-l-2 border-[#004C46] overflow-y-auto"><Tasks epic={props.epic} botanist /></div>

        </section>

    </BotanyClientContext.Provider>
}