'use client'

import { Button } from "@nextui-org/react"
import { transitionIssue } from "@/functions/server/jira"
import { useContext } from "react"
import { ModelerContext } from "../Modeler/ModelerDash"
import { dataTransfer } from "@/api/types"

import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"

export default function SubtaskButton(props: { status: string, issueKey: string }) {

    // Variable declaration
    var button
    var transitionId: number

    // Determine transition ID, button string
    if (props.status === 'To Do') { button = "Mark as 'In Progress'"; transitionId = 21 }
    else if (props.status === 'In Progress') { button = "Mark as 'Done'"; transitionId = 31 }
    else if (props.status === 'Done') { button = "Mark as 'In Progress'"; transitionId = 21 }

    // Data transfer context
    const context = useContext(ModelerContext) as dataTransfer
    const initializeTransfer = context.initializeDataTransferHandler
    const terminateTransfer = context.terminateDataTransferHandler
    const transitionHandler = () => dataTransferHandler(initializeTransfer, terminateTransfer, transitionIssue, [transitionId, props.issueKey], 'Updating issue status')

    return (
        <section className="flex">
            <div>
                <Button onPress={() => transitionIssue(transitionId, props.issueKey)}>{button}</Button>
            </div>
        </section>
    )
}