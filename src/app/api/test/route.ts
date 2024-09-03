import { writeFile } from "fs/promises"
import { join } from "path"

const comments = [
    {
      id: 1,
      comment: "This is comment 1"
    },
    {
      id: 2,
      comment: "This is comment 2"
    },
    {
      id: 3,
      comment: "This is comment 3"
    }
  ]
  
  export async function GET(request: Request) {
   
  //   const myOptions = { status: 200, statusText: "SuperSmashingGreat!" };
  //   const obj = { hello: "world" }
  //   const blob = new Blob([JSON.stringify(obj, null, 2)], {
  //   type: "application/json",
  // }) 
  //   const myResponse = new Response(blob)
  //   return Response.json({error: 'Upload Error'}, {status: 400, statusText: 'Upload Error'})
    try{
      //const models = await getAllSiteReadyModels()
      
      //return Response.json({data: 'models got', response: citations})
    }
    catch(e: any) {return Response.json({data:'fail', response: e.message}, {status: 400, statusText: 'fail'})}
  }

  
  export async function POST(request: Request) {
    try{
      const data = await request.formData()
      const file = data.get('file') as File
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      //const path = join('public/tmp', file.name)
      const path = join('public/data', file.name)
      await writeFile(path, buffer)

      return Response.json({ data:'success', response: 'no data returned' })
    }
    catch(e: any) {return Response.json({data: 'error', reponse: e.message}, {status: 400, statusText:"error"})}
  }

        // const json = await request.json()
      // const name = formData.get('name')
      // const email = formData.get('email')
      // const file = formData.get('file')
      // const annotations = json.annotations
      // const citations = await citationHandler(annotations)

  // interface progressObject {
//     started: boolean,
//     pc: number
// }

//     try {
//         const data = new FormData()
//         data.set('file', file)

//         const res = await fetch('/api/model_submit', {
//             method: 'POST',
//             body: data
//         })
//         if (!res.ok) throw new Error(await res.text())
//     } catch (e: any) {
//         console.error(e)
//     }
// }

//     try {
//         const data = new FormData()
//         data.set('file', file)

//         const res = await axios.post('/api/model_submit', data, {
//             onUploadProgress: (axiosProgressEvent) => console.log('Progress: ' + axiosProgressEvent.progress),
//         })
//         if (res.status != 200) throw new Error(res.statusText)
//     } catch (e: any) {
//         console.error(e)
//     }
// }

// try {
//     const data = new FormData()
//     data.set('org', '0974c639b9364864bc9af2160fefbc1c')
//     data.set('project', 'efb74a4893f34d8eb4e6bfbfbf14c6de')

//     const modelTransferEnd = 'https://api.sketchfab.com/v3/models/6f8cd6eaa6a5423e87216a0c37265cf5/transfer-to-org'

//     const res = await axios.post(modelTransferEnd, data, {
//         onUploadProgress: (axiosProgressEvent) => console.log('Progress: ' + axiosProgressEvent.progress),
//         headers: {
//             'Authorization': apiToken
//         }
//     })
//     console.log(res.data)
//     //if (res.status != 200) throw new Error(res.statusText)
// } catch (e: any) {
//     console.error(e)
// }

// try {
//     const data = new FormData()
//     data.set('modelFile', file)

//     const modelUploadEnd = 'https://api.sketchfab.com/v3/models'

//     const res = await axios.post(modelUploadEnd, data, {
//         onUploadProgress: (axiosProgressEvent) => console.log('Progress: ' + axiosProgressEvent.progress),
//         headers: {
//             'Authorization': apiToken
//         }
//     })
//     console.log(res.data)
//     if (res.status != 200) throw new Error(res.statusText)
// } catch (e: any) {
//     console.error(e)
// }

// const res = await axios.get('https://api.sketchfab.com/v3/orgs/0974c639b9364864bc9af2160fefbc1c/models', {
//     headers: {
//         'Authorization': apiToken
//     }
// })
// console.log(res.data)

// const res = await axios.get('https://api.sketchfab.com/v3/orgs/0974c639b9364864bc9af2160fefbc1c/projects', {
//     headers: {
//         'Authorization': apiToken
//     }
// })
// console.log(res.data)

// import {writeFile} from 'fs/promises'
// import {join} from 'path'

// export async function POST(request: Request) {
//   const formData = await request.formData()
//   const file: File = formData.get('file') as File
  
//   if(!file) return

//   const bytes = await file.arrayBuffer()
//   const buffer = Buffer.from(bytes)
//   const path = join('public/tmp', file.name)
//   await writeFile(path, buffer)
//   return Response.json({ imageUpload: "successful" })
// }