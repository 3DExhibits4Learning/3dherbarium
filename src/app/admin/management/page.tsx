import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import { getAllPendingModels } from "@/api/queries";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { management } from "@/utils/devAuthed"
import ManagerClient from "@/components/Admin/ManagerClient"

import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getPhotoAnnotation } from "@/api/queries";
import { photo_annotation } from "@prisma/client";

export default async function Page() {

    // management AUTH redirect

    const session = await getServerSession(authOptions)
    let email = session?.user?.email as string

    if (!management.includes(email)) {
        return <h1>NOT AUTHORIZED</h1>
    }

    const pendingModels = await getAllPendingModels()


    /****TESTING SECTION ******/

    // function getImageType(buffer: Buffer) {
    //     // Check for JPEG
    //     if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    //         return 'image/jpeg';
    //     }
    //     // Check for PNG
    //     if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    //         return 'image/png';
    //     }
    //     // Check for GIF
    //     if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && (buffer[3] === 0x38)) {
    //         return 'image/gif';
    //     }
    //     // Check for BMP
    //     if (buffer[0] === 0x42 && buffer[1] === 0x4D) {
    //         return 'image/bmp';
    //     }
    //     // Check for WEBP
    //     if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x5A) {
    //         return 'image/webp';
    //     }
    //     // Check for TIFF
    //     if (buffer[0] === 0x49 && buffer[1] === 0x49 && buffer[2] === 0x2A && buffer[3] === 0x00) {
    //         return 'image/tiff (little-endian)';
    //     }
    //     if (buffer[0] === 0x4D && buffer[1] === 0x4D && buffer[2] === 0x00 && buffer[3] === 0x2A) {
    //         return 'image/tiff (big-endian)';
    //     }
        
    //     // Unknown format
    //     return 'unknown image type';
    // }


    // const annotation = await getPhotoAnnotation('c3baca99-6f4d-49c7-86b3-1e2fabfc5b5f') as photo_annotation
    // const imageType = getImageType(annotation.photo as Buffer)
    // console.log(imageType, annotation?.photo?.length)
    //await mkdir('C:/Users/ab632/Documents/Node/Test', {recursive: true}).then(() => console.log('DIRECTORY MADE')).catch((e) => console.error(e.message))
    //await writeFile(`X:/Herbarium/d95fe56cdcad4cdc80d1c75de766f5c6/c3baca99-6f4d-49c7-86b3-1e2fabfc5b5f.jpeg`, annotation?.photo as Buffer).then(() => console.log('SUCCESS')).catch((e) => console.error(e.message))


    //const fileContentBuffer = await readFile('C:/Users/ab632/Documents/test.txt')
    //const fileContent = annotation?.photo?.toString('base64')
    //const photoSrc = `data:image/jpeg;base64,${fileContent}`
    //console.log(photoSrc)

    // console.log(fileContent)

    return (
        <>
            <Header pageRoute="collections" headerTitle='Management' />
            <section className="flex flex-col !min-h-[calc(100vh-177px)]">
                <ManagerClient pendingModels={pendingModels} katId={process.env.KAT_JIRA_ID as string} hunterId={process.env.hunter_JIRA_ID as string} />
            </section>
            <Foot />
        </>
    )
}

//const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

// await fetch(`https://3dteam.atlassian.net/rest/api/3/issue/HERB-74/transitions`, {
//     method: 'POST',
//     //@ts-ignore -- without the first two headers, data is not returned in English
//     headers: {
//         'X-Force-Accept-Language': true,
//         'Accept-Language': 'en',
//         'Authorization': `Basic ${base64}`,
//         'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(transitionData)
// })
//     .then(res => res.json())
//     .then(json => {
//         console.log(json)
//     })
//     .catch((e: any) => { console.log(e.message) })

// const base64 = Buffer.from(`ab632@humboldt.edu:${process.env.JIRA_API_KEY}`).toString('base64')

//console.log(new Date().toLocaleDateString())