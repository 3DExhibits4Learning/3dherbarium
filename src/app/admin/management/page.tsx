import Header from "@/components/Header/Header";
import Foot from "@/components/Shared/Foot";
import { getAllPendingModels } from "@/api/queries";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { management } from "@/utils/devAuthed"
import ManagerClient from "@/components/Admin/ManagerClient"


export default async function Page() {

    // management AUTH redirect

    const session = await getServerSession(authOptions)
    let email = session?.user?.email as string

    if (!management.includes(email)) {
        return <h1>NOT AUTHORIZED</h1>
    }
    // Model array must be stringified due to the following warning from next.js:
    // Warning: Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported.
    const pendingModels = await getAllPendingModels()
    const pendingModelsJson = JSON.stringify(pendingModels)

    // const file = await readFile('C:/Users/ab632/Pictures/Saved Pictures/Passport Receipt.jpg')
    // const tags = await ExifReader.load(file);
    // const imageDate = tags['DateTimeOriginal'].description;
    // const unprocessedTagValue = tags['DateTimeOriginal'].value;
    // console.log(imageDate.slice(0,10).replace(/:/g, "-"))
    // console.log(imageDate.slice(-8).slice(0,5))

    // // Get the absolute path to the file
    // const filePath = '/Users/ab632/Documents/Annotation Numbers'

    // // Create a readable stream
    // const fileStream = fs.createReadStream(filePath);

    // // Create an interface to read the file line by line
    // const rl = readline.createInterface({
    //     input: fileStream,
    //     crlfDelay: Infinity
    // });

    // const lines = [];

    // // Read each line and store it in an array
    // for await (const line of rl) {
    //     lines.push(line);
    // }

    // // Respond with the file content
    // console.log(lines[0])
    // console.log(lines[1])

    // for (let i = 0; i < lines.length; i++) {
    //     if (i % 2 === 0) {
    //         const annotation = await prisma.annotations.findFirst({ where: { url: lines[i] } })
    //         if (annotation) {
    //             await prisma.annotations.update({
    //                 where: {
    //                     annotation_id: annotation?.annotation_id
    //                 },
    //                 data: {
    //                     annotation_no: parseInt(lines[i + 1])
    //                 }
    //             })

    //             console.log(`annotation ${annotation?.annotation_id}`)
    //         }
    //     }
    // }

    // const content = 'Words\non\nnew\nlines'
    // await writeFile('/Users/ab632/Documents/info.php', content )

    return (
        <>
            <Header pageRoute="collections" headerTitle='Management' />
            <section className="flex flex-col !min-h-[calc(100vh-177px)]">
                <ManagerClient pendingModels={pendingModelsJson} katId={process.env.KAT_JIRA_ID as string} hunterId={process.env.hunter_JIRA_ID as string} />
            </section>
            <Foot />
        </>
    )
}