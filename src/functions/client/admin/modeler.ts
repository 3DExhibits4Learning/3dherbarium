import { imageInsertion } from "@/api/types"
import { SetStateAction, Dispatch } from "react";

/**
 * 
 * @param specimenInsertData data to be inserted into db
 * @returns text indicating success or failure of route handler
 */
export const insertSpecimenIntoDatabase = async (specimenInsertData: FormData) => {
    return await fetch('/api/admin/modeler/specimen', {
        method: 'POST',
        body: specimenInsertData
    }).then(res => res.json()).then(json => { console.log(json); return json.data })
}

/**
 * 
 * @param data data to be inserted into db
 * @returns text indicating success or failure of route handler
 */
export const insertModelIntoDatabase = async (data: FormData) => {
    await fetch('/api/admin/modeler/model', {
        method: 'POST',
        body: data
    }).then(res => res.json()).then(json => { console.log(json); return json.data })
}

/**
 * 
 * @param imageSetInsertData data to be inserted into db
 * @returns text indicating success or failure of route handler
 */
export const insertImageSetIntoDatabase = async (imageSetInsertData: imageInsertion) => {
    return await fetch('/api/admin/modeler/photos', {
        method: 'POST',
        body: JSON.stringify(imageSetInsertData)
    }).then(res => res.json()).then(json => { console.log(json); return json.data })
}

/**
 * 
 * @param subtasks 
 * @returns 
 */
export const countCompletedSubtasks = (subtasks: any[]) => { var count = 0; for (let i in subtasks) { if (subtasks[i].fields.status.name === 'Done') count++ }; return count }