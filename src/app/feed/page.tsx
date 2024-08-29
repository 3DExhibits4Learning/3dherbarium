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
                    <p>I&apos;d like to take this first post to welcome our new 3D Modeling assistant, Hunter Phillips!</p>
                    <p>Here is a sneak peak at Hunters work, before it&apos;s annotated and featured on the collections page!</p>
                    <div className="w-full lg:w-1/2 flex justify-center my-12 h-[500px] lg:h-[750px]">
                        <ModelViewer uid={'30cdc48045a04a4b970db0656c960f28'} minHeight="500px" noAutoStart/>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center my-12 h-[500px] lg:h-[750px]">
                        <ModelViewer uid={'831f136655d54b27b485319bda131335'} minHeight="500px" noAutoStart/>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center my-12 h-[500px] lg:h-[750px]">
                        <ModelViewer uid={'5f90f6ce21c14db8acc9fdd5efba547f'} minHeight="500px" noAutoStart/>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center my-12 h-[500px] lg:h-[750px]">
                        <ModelViewer uid={'10d6e43ca5444250861bf406e0055e10'} minHeight="500px" noAutoStart/>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center my-12 h-[500px] lg:h-[750px]">
                        <ModelViewer uid={'a72ae03b40ef4ff4ad6162c5f818e182'} minHeight="500px" noAutoStart/>
                    </div>
                </article>
            </main>
            <Foot />
        </>
    )
}