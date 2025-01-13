'use client'

import DataTransferModal from "@/components/Shared/DataTransferModal"
import { Accordion, AccordionItem } from "@nextui-org/react"
import { useState } from "react"

export default function Tasks() {

    // Data transfer states
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [transferring, setTransferring] = useState<boolean>(false)
    const [result, setResult] = useState<string>('')
    const [loadingLabel, setLoadingLabel] = useState<string>('')

    return (
        <>
            <DataTransferModal open={openModal} transferring={transferring} result={result} loadingLabel={loadingLabel} href='/admin/modeler' />
            <Accordion>
                <AccordionItem>
                </AccordionItem>
            </Accordion>
        </>
    )
}