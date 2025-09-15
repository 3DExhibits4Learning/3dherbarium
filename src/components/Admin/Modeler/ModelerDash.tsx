/**
 * @file src\components\Admin\Modeler\ModelerDash.tsx
 * 
 * @fileoverview 3D modeler admin client
 */

'use client'

// Typical imports
import { Accordion, AccordionItem } from "@heroui/react"
import { specimenWithImageSet } from "@/ts/types"
import { useState, createContext, memo } from "react"
import { dataTransfer } from "@/ts/types"

// Default imports
import NewSpecimenEntry from "../NewSpecimenEntry"
import DataTransferModal from "@/components/Shared/DataTransferModal"
import initializeDataTransfer from "@/functions/client/dataTransfer/initializeDataTransfer"
import terminateDataTransfer from "@/functions/client/dataTransfer/terminateDataTransfer"
import ImageSetForms from "./ImageSetForms"
import ModelForms from "./ModelForms"
import Tasks from "../Tasks/Tasks"

// Exported context
export const ModelerContext = createContext<'' | dataTransfer>('')

// Main JSX
export default function ModelerDash(props: { unphotographedSpecimen: specimenWithImageSet[], unModeledSpecimen: specimenWithImageSet[], epic: any }) {

    // Data transfer states
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>('')

    // Initialize/terminate data transfer handlers
    const initializeDataTransferHandler = (loadingLabel: string) => initializeDataTransfer(setOpenModal, setTransferring, setLoadingLabel, loadingLabel)
    const terminateDataTransferHandler = (result: string) => terminateDataTransfer(setResult, setTransferring, result)

    // Context
    const modelerContext = { initializeDataTransferHandler, terminateDataTransferHandler }

    // Memoed Forms
    const MemoForms = memo(() => <ModelForms specimen={props.unModeledSpecimen} />)
    MemoForms.displayName = 'MemoForms'

    return (
        <ModelerContext.Provider value={modelerContext}>
            <DataTransferModal open={openModal} transferring={transferring} result={result} loadingLabel={loadingLabel} href='/admin/modeler' />
            <section className="w-full flex">
                <Accordion className="w-full overflow-y-auto">
                    <AccordionItem key={'newSpecimen'} aria-label={'New Specimen'} title={"I've acquired a new specimen"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                        <NewSpecimenEntry />
                    </AccordionItem>
                    <AccordionItem key={'newImageSet'} aria-label={'New Image Set'} title={"I've photographed a new specimen"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                        <ImageSetForms specimen={props.unphotographedSpecimen} />
                    </AccordionItem>
                    <AccordionItem key={'new3DModel'} aria-label={'New Image Set'} title={"I've created a new 3D Model"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                        <MemoForms />
                    </AccordionItem>
                </Accordion>
                <div className="w-1/5 h-full flex border-l-2 border-[#004C46] overflow-y-auto">
                    <Tasks epic={props.epic}/>
                </div>
            </section>
        </ModelerContext.Provider>
    )
}