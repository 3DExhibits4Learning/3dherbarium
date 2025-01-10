import { imageInsertion, modelInsertion } from "@/api/types"

export const insertSpecimenIntoDatabase = async (specimenInsertData: FormData) => {
    return await fetch('/api/admin/modeler/specimen', {
        method: 'POST',
        body: specimenInsertData
    }).then(res => res.json()).then(json => json.data)
}

export const insertModelIntoDatabase = async (data: FormData) => {
    await fetch('/api/admin/modeler/model', {
        method: 'POST',
        body: data
    }).then(res => res.json()).then(json => json.data)
}

export const insertImageSetIntoDatabase = async (imageSetInsertData: imageInsertion) => {
    return await fetch('/api/admin/modeler/photos', {
        method: 'POST',
        body: JSON.stringify(imageSetInsertData)
    }).then(res => res.json()).then(json => json.data)
}