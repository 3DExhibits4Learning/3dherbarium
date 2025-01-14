'use client'

import { Accordion, AccordionItem } from "@nextui-org/react"
import { useState, useMemo } from "react"
import { countCompletedSubtasks } from "@/functions/client/admin/modeler"

export default function Tasks(props: { epic: any }) {

    const issues = props.epic.issues
    console.log(issues[10])
    console.log(props.epic.issues.findIndex((issue:any) => issue.fields.summary.includes('Test')))
    console.log(countCompletedSubtasks(props.epic.issues[10].fields.subtasks))

    const toDoTasks = useMemo(() => props.epic.issues.filter((issue: any) => issue.fields.status.name === 'To Do'), [props.epic])
    const inProgressTasks = useMemo(() => props.epic.issues.filter((issue: any) => issue.fields.status.name === 'In Progress'), [props.epic])
    const doneTasks = useMemo(() => props.epic.issues.filter((issue: any) => issue.fields.status.name === 'In Progress'), [props.epic])

    return (
        <Accordion>
            <AccordionItem key={'In Progress'} aria-label={'In Progress'} title={"In Progress"} classNames={{ title: 'text-[ #004C46] text-3xl' }}>
                <Accordion>
                    {
                        inProgressTasks.length &&
                        inProgressTasks.map((issue: any) => {
                            return (
                                <AccordionItem key={issue.fields.summary} aria-label={issue.fields.summary} title={issue.fields.summary.slice(0, -11) + ` (${countCompletedSubtasks(issue.fields.subtasks)}/3)`} classNames={{ title: 'text-[ #004C46] text-xl' }}>
                                    <Accordion>
                                        {
                                            issue.fields.subtasks.map((task: any) => {
                                                return (
                                                    <AccordionItem 
                                                    key={task.fields.summary} 
                                                    aria-label={task.fields.summary} 
                                                    title={task.fields.summary.includes('(') ? task.fields.summary.slice(0, -11) + ` - ` + task.fields.status.name : task.fields.summary + ` - ` + task.fields.status.name}
                                                    classNames={{ title: 'text-[ #004C46] text-md' }}></AccordionItem>
                                                )
                                            })
                                        }
                                    </Accordion>
                                </AccordionItem>
                            )
                        })
                    }
                </Accordion>
            </AccordionItem>
            <AccordionItem key={'To Do'} aria-label={'To Do'} title={"To Do"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                <Accordion>
                    {
                        toDoTasks.map((issue: any, index: any) => {
                            return <AccordionItem key={index} aria-label={issue.fields.summary} title={issue.fields.summary.slice(0, -11)} classNames={{ title: 'text-[ #004C46]' }}></AccordionItem>
                        })
                    }
                </Accordion>
            </AccordionItem>
            <AccordionItem key={'Done'} aria-label={'Done'} title={"Done"} classNames={{ title: 'text-[ #004C46] text-2xl' }}>
                {
                    doneTasks.map((issue: any, index: any) => {
                        return <AccordionItem key={index} aria-label={issue.fields.summary} title={issue.fields.summary.slice(0, -11)} classNames={{ title: 'text-[ #004C46]' }}></AccordionItem>
                    })
                }
            </AccordionItem>
        </Accordion>
    )
}