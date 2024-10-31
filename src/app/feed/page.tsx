'use client'

import Header from "@/components/Header/Header"
import Foot from "@/components/Shared/Foot"
import { Divider } from "@nextui-org/react"

export default function Page() {
    return (
        <>
            <Header pageRoute="collections" headerTitle='feed' />
            <p className="mt-8 ml-4 mb-2">10-31-2024</p>
            <Divider />
            <main className="min-h-[calc(100vh-177px)] h-fit flex justify-center">
                <article className='w-4/5 h-fit text-center flex flex-col items-center'>
                    <p className="text-3xl mt-8">Welcome to the new 3D Digital Herbarium Feed!</p>
                    <br></br><br></br>
                    <p className="text-lg">This is where all of the latest news regarding the herbarium will be posted, beginning with the welcome of the Fall 2024 student team:</p>
                    <br></br>
                    <p><span className="font-medium">Hunter Phillips</span>: Photogrammetrist and 3D Modeler</p>
                    <p><span className="font-medium">Kat Lim</span>: Botany Assistant</p>
                    <p><span className="font-medium">Simon Saltikov</span>: Programming Assistant</p>
                    <br></br><br></br>
                    <p className="text-lg">Check back here regularly for updates!</p>
                    <br></br>
                    <p className="text-lg">*Note that the site may be offline periodically over the next day or two while we stabalize updates</p>
                </article>
            </main>
            <Foot />
        </>
    )
}