// export const insertSpecimenIntoDatabase = async() => {
    
//             const insertObj: specimenInsertion = {
//                 species: species,
//                 acquisitionDate: acquisitionDate as string,
//                 procurer: procurer,
//                 isLocal: isLocal as boolean,
//                 genus: genus
//             }
    
//             await fetch('/api/admin/modeler/specimen', {
//                 method: 'POST',
//                 body: JSON.stringify(insertObj)
//             }).then(res => res.json()).then(json => {
//                 setInsertionResult(json.data)
//                 setInserting(false)
//             })
        
// }