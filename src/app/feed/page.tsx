'use client'

import Header from "@/components/Header/Header"
import Foot from "@/components/Shared/Foot"
//import ModelViewer from "@/components/Dashboard/ModelViewer"
import dynamic from "next/dynamic"
const ModelViewer = dynamic(() => import('../../components/Shared/ModelViewer'), { ssr: false })

export default function Page() {
    return (
        <>
            <Header pageRoute="collections" headerTitle='feed' />
            <main className="min-h-[calc(100vh-177px)] h-fit flex justify-center">
                <article className='w-4/5 h-fit text-center flex flex-col items-center'>
                    <p className="text-3xl mt-12">Welcome to the new 3D Digital Herbarium Feed!</p>
                    <br></br><br></br>
                    <p className="text-lg">This is where all of the latest news regarding the herbarium will be posted, beginning with the welcome of the Fall 2024 student team:</p>
                    <br></br>
                    <p><span className="font-medium">Hunter Phillips</span>: Photogrammetrist and 3D Modeler</p>
                    <p><span className="font-medium">Kat Lim</span>: Botany Assistant</p>
                    <p><span className="font-medium">Simon Saltikov</span>: Programming Assistant</p>
                    <br></br><br></br>
                    <p className="text-lg">Check back here regularly for updates!</p>
                </article>
            </main>
            <Foot />
        </>
    )
}