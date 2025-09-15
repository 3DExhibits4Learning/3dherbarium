/**
 * @file src/components/Admin/Tasks/Tasks.tsx
 * 
 * @fileoverview administrative tasks client
 */

'use client'

// Imports
import { Accordion, AccordionItem } from "@heroui/react"
import { useMemo, useContext } from "react"
import { countCompletedSubtasks, transitionIssue, arrangeSubtasks } from "@/functions/client/admin/modeler"
import { ModelerContext } from "../Modeler/ModelerDash"
import { Button } from "@heroui/react"
import { dataTransfer } from "@/ts/types"
import { BotanyClientContext } from "../Botanist/BotanyClient"
import { botanyClientContext } from "@/ts/botanist"

// Default imports
import SubtaskButton from "./SubtaskButtons"
import dataTransferHandler from "@/functions/client/dataTransfer/dataTransferHandler"
import TaskImage from "./TaskImage"

// Main JSX
export default function Tasks(props: { epic: any, botanist?: boolean }) {
    // Data transfer context
    const modelerContext = useContext(ModelerContext) as dataTransfer
    const botanistContext = useContext(BotanyClientContext) as botanyClientContext
    const context = !props.botanist ? modelerContext : botanistContext
    const initializeTransfer = context.initializeDataTransferHandler
    const terminateTransfer = context.terminateDataTransferHandler

    // Memoed tasks
    const toDoTasks = useMemo(() => props.epic.issues.filter((issue: any) => issue.fields.status.name === 'To Do'), [props.epic])
    const inProgressTasks = useMemo(() => props.epic.issues.filter((issue: any) => issue.fields.status.name === 'In Progress'), [props.epic])
    const doneTasks = useMemo(() => props.epic.issues.filter((issue: any) => issue.fields.status.name === 'Done'), [props.epic])

    // Respective titles
    const modelerTitle = (issue: any) => issue.fields.summary.slice(0, -11) + ` (${countCompletedSubtasks(issue.fields.subtasks)}/${issue.fields.subtasks.length})`
    const botanistTitle = (issue: any) => <span>{issue.fields.summary.slice(0, -11)}<br />Subtasks completed: {countCompletedSubtasks(issue.fields.subtasks)} of {issue.fields.subtasks.length}</span>

    // Transition handler
    const transitionHandler = (transitionId: number, issueKey: string) => dataTransferHandler(initializeTransfer, terminateTransfer, transitionIssue, [transitionId, issueKey], 'Updating issue status')

    return <Accordion selectionMode="multiple" defaultExpandedKeys={['In Progress']} isCompact>
        <AccordionItem key={'In Progress'} aria-label={'In Progress'} title={"In Progress"} classNames={{ title: 'text-[ #004C46] text-3xl font-medium' }}>
            <Accordion isCompact>
                {
                    inProgressTasks.length &&
                    inProgressTasks.map((issue: any) => {
                        return <AccordionItem key={issue.fields.summary} aria-label={issue.fields.summary} classNames={{ title: 'text-[ #004C46] text-xl font-medium' }}
                            title={props.botanist ? botanistTitle(issue) : modelerTitle(issue)}>
                            <TaskImage sidSlice={issue.fields.summary.slice(-10).slice(1, 9)} />
                            <Button size='sm' className="text-sm bg-[#004C46] text-[#F5F3E7]" onPress={() => transitionHandler(11, issue.key)}>{"Mark as 'To Do'"}</Button>
                            <Accordion>
                                {
                                    arrangeSubtasks(issue.fields.subtasks, props.botanist).map((task: any) => {
                                        return <AccordionItem key={task.fields.summary} aria-label={task.fields.summary} classNames={{ title: 'text-[ #004C46] text-md font-medium' }}
                                            title={task.fields.summary.includes('(') ? task.fields.summary.slice(0, -11) + ` - ` + task.fields.status.name : task.fields.summary + ` - ` + task.fields.status.name}>
                                            <SubtaskButton status={task.fields.status.name} issueKey={task.key} summary={task.fields.summary} botanist={props.botanist} />
                                        </AccordionItem>
                                    })
                                }
                            </Accordion>
                        </AccordionItem>
                    })
                }
                {
                    !inProgressTasks.length &&
                    <AccordionItem key={'No Length'}
                        title={'YOU HAVE NO ACTIVE TASKS'}
                        classNames={{ title: 'text-red-600 text-2xl font-medium' }}>
                    </AccordionItem>
                }
            </Accordion>
        </AccordionItem>
        <AccordionItem key={'To Do'} aria-label={'To Do'} title={"To Do"} classNames={{ title: 'text-[ #004C46] text-2xl font-medium' }}>
            <Accordion>
                {
                    toDoTasks.map((issue: any, index: any) => {
                        return <AccordionItem key={index} aria-label={issue.fields.summary} title={issue.fields.summary.slice(0, -11)} classNames={{ title: 'text-[ #004C46]' }}>
                            <TaskImage sidSlice={issue.fields.summary.slice(-10).slice(1, 9)} />
                            {!props.botanist && <Button size='sm' className="text-sm bg-[#004C46] text-[#F5F3E7]" onPress={() => transitionHandler(21, issue.key)}>{"Mark as 'In Progress'"}</Button>}
                        </AccordionItem>
                    })
                }
            </Accordion>
        </AccordionItem>
        <AccordionItem key={'Done'} aria-label={'Done'} title={"Done"} classNames={{ title: 'text-[ #004C46] text-2xl font-medium' }}>
            <Accordion>
                {
                    doneTasks.map((issue: any, index: any) => {
                        return <AccordionItem key={index + 100} aria-label={issue.fields.summary} title={issue.fields.summary.slice(0, -11)} classNames={{ title: 'text-[ #004C46]' }}>
                            <Button size='sm' className="text-sm bg-[#004C46] text-[#F5F3E7]" onPress={() => transitionHandler(21, issue.key)}>{"Mark as 'In Progress'"}</Button>
                        </AccordionItem>
                    })
                }
            </Accordion>
        </AccordionItem>
    </Accordion>
}