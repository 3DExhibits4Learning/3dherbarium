/**
 * @file src\components\Admin\Modeler\ModelerDash.tsx
 * 
 * @fileoverview 3D modeler admin client
 */

'use client'

// Typical imports
import { Accordion, AccordionItem } from "@nextui-org/react"
import { specimenWithImageSet, imageSetWithModel } from "@/api/types"
import { useState, createContext } from "react"

// Default imports
import NewSpecimenEntry from "../NewSpecimenEntry"
import NewImageSet from "./NewImageSet"
import New3DModel from "./NewModelEntry"
import SpecimenToPhotograph from "./SpecimenToPhotograph"
import SpecimenToModel from "./SpecimenToModel"
import DataTransferModal from "@/components/Shared/DataTransferModal"
import initializeDataTransfer from "@/functions/client/dataTransfer/initializeDataTransfer"
import terminateDataTransfer from "@/functions/client/dataTransfer/terminateDataTransfer"

// Exported context
export const ModelerContext = createContext<'' | dataTransfer>('')

export interface dataTransfer{
    initializeDataTransferHandler: Function 
    terminateDataTransferHandler: Function
}

// Main JSX
export default function ModelerDash(props: { unphotographedSpecimen: specimenWithImageSet[], unModeledSpecimen: imageSetWithModel[] }) {

    // Data transfer states
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>('')

    // Initialize/terminate data transfer handlers
    const initializeDataTransferHandler = (loadingLabel: string) => initializeDataTransfer(setOpenModal, setTransferring, setLoadingLabel, loadingLabel)
    const terminateDataTransferHandler = (result: string) => terminateDataTransfer(setResult, setTransferring, result)

    // Context
    const modelerContext = {initializeDataTransferHandler, terminateDataTransferHandler}

    return (
        <ModelerContext.Provider value={modelerContext}>
            <DataTransferModal open={openModal} transferring={transferring} result={result} loadingLabel={loadingLabel} href='/admin/modeler' />
            <Accordion>
                <AccordionItem key={'newSpecimen'} aria-label={'New Specimen'} title={"I've acquired a new specimen"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                    <NewSpecimenEntry />
                </AccordionItem>
                <AccordionItem key={'newImageSet'} aria-label={'New Image Set'} title={"I've photographed a new specimen"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                    <NewImageSet />
                </AccordionItem>
                <AccordionItem key={'new3DModel'} aria-label={'New Image Set'} title={"I've created a new 3D Model"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                    <New3DModel />
                </AccordionItem>
                <AccordionItem key={'specimenToPhotograph'} aria-label={'New Image Set'} title={"Specimen to photograph [" + props.unphotographedSpecimen.length + ']'} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                    <SpecimenToPhotograph unphotographedSpecimen={props.unphotographedSpecimen} />
                </AccordionItem>
                <AccordionItem key={'specimenToModel'} aria-label={'New Image Set'} title={"Specimen to model [" + props.unModeledSpecimen.length + ']'} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                    <SpecimenToModel unModeledSpecimen={props.unModeledSpecimen} />
                </AccordionItem>
            </Accordion>
        </ModelerContext.Provider>
    )
}