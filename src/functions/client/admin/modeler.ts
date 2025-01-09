import { specimenInsertion } from "@/api/types"
import { SetStateAction, Dispatch } from "react"

export const insertSpecimenIntoDatabase = async (specimenInsertData: FormData) => {
    return await fetch('/api/admin/modeler/specimen', {
        method: 'POST',
        body: specimenInsertData
    }).then(res => res.json()).then(json => json.data)
}