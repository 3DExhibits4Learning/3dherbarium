/**
 * @file src/components/Admin/Tasks/SubtaskButtons.tsx
 * 
 * @fileoverview subtask button
 */
'use client'

// Typical imports
import { Button } from "@nextui-org/react"
import { useContext } from "react"
import { ModelerContext } from "../Modeler/ModelerDash"
import { dataTransfer } from "@/api/types"
import { isIssueAutoMarkedDone, transitionIssue } from "@/functions/client/admin/modeler"

// Default imports
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"

export default function SubtaskButton(props: { status: string, issueKey: string, summary: string }) {

    // Data transfer context
    const context = useContext(ModelerContext) as dataTransfer
    const initializeTransfer = context.initializeDataTransferHandler
    const terminateTransfer = context.terminateDataTransferHandler

    // Transition handler
    const transitionHandler = (transitionId: number) => dataTransferHandler(initializeTransfer, terminateTransfer, transitionIssue, [transitionId, props.issueKey], 'Updating subtask status')

    return (
        <section className="flex">
            {
                props.status === 'To Do' &&
                <Button size='sm' className="text-sm bg-[#004C46] text-[#F5F3E7]" onPress={() => transitionHandler(21)}>{"Mark as 'In Progress'"}</Button>
            }
            {
                props.status === 'In Progress' && isIssueAutoMarkedDone(props.summary) &&
                <Button size='sm' className="text-sm" onPress={() => transitionHandler(11)}>{"Mark as 'To Do'"}</Button>
            }
            {
                props.status === 'In Progress' && !isIssueAutoMarkedDone(props.summary) &&
                <section className="flex w-full justify-around">
                    <Button size='sm' className="text-sm bg-[#004C46] text-[#F5F3E7]" onPress={() => transitionHandler(11)}>{"Mark as 'To Do'"}</Button>
                    <Button size='sm' className="text-sm bg-[#004C46] text-[#F5F3E7]" onPress={() => transitionHandler(31)}>{"Mark as 'Done'"}</Button>
                </section>
            }
            {
                props.status === 'Done' && !isIssueAutoMarkedDone(props.summary) &&
                <Button size='sm' className="text-sm bg-[#004C46] text-[#F5F3E7]" onPress={() => transitionHandler(21)}>{"Mark as 'In Progress'"}</Button>
            }
        </section>
    )
}