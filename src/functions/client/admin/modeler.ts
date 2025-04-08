import { imageInsertion } from "@/ts/types"

/**
 * 
 * @param specimenInsertData data to be inserted into db
 * @returns text indicating success or failure of route handler
 */
export const insertSpecimenIntoDatabase = async (specimenInsertData: FormData) => await fetch('/api/admin/modeler/specimen', { method: 'POST', body: specimenInsertData }).then(res => res.json()).then(json => json.data)

/**
 * 
 * @param data data to be inserted into db
 * @returns text indicating success or failure of route handler
 */
export const insertModelIntoDatabase = async (data: FormData) => await fetch('/api/admin/modeler/model', { method: 'POST', body: data }).then(res => res.json()).then(json => json.data)

/**
 * 
 * @param imageSetInsertData data to be inserted into db
 * @returns text indicating success or failure of route handler
 */
export const insertImageSetIntoDatabase = async (imageSetInsertData: imageInsertion) => await fetch('/api/admin/modeler/photos', { method: 'POST', body: JSON.stringify(imageSetInsertData) })
    .then(res => res.json()).then(json => json.data)

/**
 * 
 * @param subtasks 
 * @returns 
 */
export const countCompletedSubtasks = (subtasks: any[]) => { var count = 0; for (let i in subtasks) { if (subtasks[i].fields.status.name === 'Done') count++ }; return count }

/**
 * 
 * @param summary 
 * @returns 
 */
export const isIssueAutoMarkedDone = (summary: string) => summary.includes('Build') || summary.includes('Photograph') || summary.includes('Annotate') ? true : false

/**
 * 
 * @param transitionId 
 * @returns 
 */
export const transitionIssue = async (transitionId: number, issueKey: string) => await fetch('/api/issues/transition', { method: 'POST', body: JSON.stringify({ issueKey: issueKey, transitionId: transitionId }) })
    .then(res => res.text()).then(text => text)


/**
 * 
 * @param subtasks 
 */
export const arrangeSubtasks = (subtasks: any[], botanist?: boolean | undefined) => {

    if (botanist) {
        const orderedSubtasks = subtasks.filter((task: any) => task.fields.summary.includes('metadata'))
        orderedSubtasks.push(subtasks.find((task: any) => task.fields.summary.includes('Annotate')))
        return orderedSubtasks
    }

    const orderedSubtasks = subtasks.filter((task: any) => task.fields.summary.includes('Photograph'))
    orderedSubtasks.push(subtasks.find((task: any) => task.fields.summary.includes('Convert')))
    orderedSubtasks.push(subtasks.find((task: any) => task.fields.summary.includes('Build')))
    return orderedSubtasks
}