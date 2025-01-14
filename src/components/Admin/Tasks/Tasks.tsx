'use client'

import { Accordion, AccordionItem } from "@nextui-org/react"
import { useMemo, useContext } from "react"
import { countCompletedSubtasks, transitionIssue, arrangeSubtasks } from "@/functions/client/admin/modeler"
import { ModelerContext } from "../Modeler/ModelerDash"
import { dataTransfer } from "@/api/types"
import { Button } from "@nextui-org/react"

import SubtaskButton from "./SubtaskButtons"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"

export default function Tasks(props: { epic: any }) {

    // Data transfer context
    const context = useContext(ModelerContext) as dataTransfer
    const initializeTransfer = context.initializeDataTransferHandler
    const terminateTransfer = context.terminateDataTransferHandler

    // Memoed tasks
    const toDoTasks = useMemo(() => props.epic.issues.filter((issue: any) => issue.fields.status.name === 'To Do'), [props.epic])
    const inProgressTasks = useMemo(() => props.epic.issues.filter((issue: any) => issue.fields.status.name === 'In Progress'), [props.epic])
    const doneTasks = useMemo(() => props.epic.issues.filter((issue: any) => issue.fields.status.name === 'In Progress'), [props.epic])

    // Transition handler
    const transitionHandler = (transitionId: number, issueKey: string) => dataTransferHandler(initializeTransfer, terminateTransfer, transitionIssue, [transitionId, issueKey], 'Updating issue status')

    return (
        <Accordion selectionMode="multiple" defaultExpandedKeys={['In Progress']}>
            <AccordionItem key={'In Progress'} aria-label={'In Progress'} title={"In Progress"} classNames={{ title: 'text-[ #004C46] text-3xl' }}>
                <Accordion>
                    {
                        inProgressTasks.length &&
                        inProgressTasks.map((issue: any) => {
                            return <AccordionItem
                                key={issue.fields.summary}
                                aria-label={issue.fields.summary}
                                title={issue.fields.summary.slice(0, -11) + ` (${countCompletedSubtasks(issue.fields.subtasks)}/3)`}
                                classNames={{ title: 'text-[ #004C46] text-xl' }}>
                                <Accordion>
                                    {
                                        arrangeSubtasks(issue.fields.subtasks).map((task: any) => {
                                            return <AccordionItem
                                                key={task.fields.summary}
                                                aria-label={task.fields.summary}
                                                title={task.fields.summary.includes('(') ? task.fields.summary.slice(0, -11) + ` - ` + task.fields.status.name : task.fields.summary + ` - ` + task.fields.status.name}
                                                classNames={{ title: 'text-[ #004C46] text-md' }}>
                                                <SubtaskButton status={task.fields.status.name} issueKey={task.key} summary={task.fields.summary} />
                                            </AccordionItem>
                                        })
                                    }
                                </Accordion>
                            </AccordionItem>
                        })
                    }
                    {
                        !inProgressTasks.length &&
                        <p className="text-red-600 text-3xl">You have no active tasks!!</p>
                    }
                </Accordion>
            </AccordionItem>
            <AccordionItem key={'To Do'} aria-label={'To Do'} title={"To Do"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                <Accordion>
                    {
                        toDoTasks.map((issue: any, index: any) => {
                            return <AccordionItem
                                key={index}
                                aria-label={issue.fields.summary}
                                title={issue.fields.summary.slice(0, -11)}
                                classNames={{ title: 'text-[ #004C46]' }}>
                                <Button size='sm' className="text-sm" onPress={() => transitionHandler(21, issue.key)}>{"Mark as 'In Progress'"}</Button>
                            </AccordionItem>
                        })
                    }
                </Accordion>
            </AccordionItem>
            <AccordionItem key={'Done'} aria-label={'Done'} title={"Done"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                {
                    doneTasks.map((issue: any, index: any) => {
                        return <AccordionItem
                            key={index}
                            aria-label={issue.fields.summary}
                            title={issue.fields.summary.slice(0, -11)}
                            classNames={{ title: 'text-[ #004C46]' }}>
                            {
                                issue.fields.parent.key === 'SPRIN-1' &&
                                <Button size='sm' className="text-sm" onPress={() => transitionHandler(21, issue.key)}>{"Mark as 'In Progress'"}</Button>
                            }

                        </AccordionItem>
                    })
                }
            </AccordionItem>
        </Accordion>
    )
}