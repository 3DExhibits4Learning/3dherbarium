/**
 * @file src/components/Home/model.tsx
 * 
 * @fileoverview home page 3D model of a pine tree
 */

'use client'

// Typical imports
import { ChangeEvent, useEffect, useState, useRef, MutableRefObject, Ref } from 'react'
import { elementsRef, handleValueChange, initializeHomeModel, viewerReadySuccessHandler } from '@/functions/client/home'

import dynamic from 'next/dynamic'
import Foot from '../Shared/Foot'

const Header = dynamic(() => import('@/components/Header/Header'), { ssr: false })

// Main JSX
export default function HomeModel() {

  // Input state
  var [rangeValue, setRangeValue] = useState<number>(300)

  // Ref object for HTML elements, ref for input element
  const elementsRef = useRef<{ [key: string]: HTMLElement | null }>({})
  const slider = useRef<HTMLInputElement>(undefined)

  // Model viewer success function wrapper
  const viewerReadySuccessHandlerWrapper = (api: any) => viewerReadySuccessHandler(api, slider as MutableRefObject<HTMLInputElement>, elementsRef as unknown as MutableRefObject<elementsRef>)

  // Initialize model viewer
  useEffect(() => initializeHomeModel(viewerReadySuccessHandlerWrapper), [])

  return <main className='flex flex-col h-full w-full'>
      <Header headerTitle='Home' pageRoute='collections' />
      <article className='flex h-full'>

        <iframe frameBorder="0" id="homeModel" title={"Model Viewer for " + ''}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          xr-spatial-tracking="true"
          execution-while-out-of-viewport="true"
          execution-while-not-rendered="true" web-share="true"
          allowFullScreen
          style={{ transition: "width 1.5s", zIndex: "2" }}
          className='h-full w-full lg:w-3/5' />

        <div id='sliderDiv' className='hidden overflow-x-auto lg:flex flex-col w-2/5 h-full pr-[4] bg-black items-center pt-[1%] text-white overflow-y-auto' style={{ transition: "width 1.5s", zIndex: "1" }}>

          <p className='text-xl pb-8' >Welcome to the <span className='text-[#FFC72C]'>3D</span> Digital Herbarium</p>
          <p className='border-b border-solid pb-[2.5%]'>Check out our 3D Models on the Collections page, identify an unknown specimen with Plant.id or see what&apos;s new in the Feed. You can also see interior components of a pine tree below with our newest, experimental feature!</p><br></br>

          <div className='grid h-1/2 grid-cols-1 grid-rows-3 fade'>

            <div ref={el => {
              elementsRef.current['barkSection'] = el;
            }} id='barkSection' className='height-[15%] w-full'>
              <p className='text-xl'><i>Pinus</i> (Pine)</p>
              Pinus is a genus of gymnosperms in the family Pinaceae. There are many living representatives of this genus in California and throughout the world.
            </div>

            <div ref={el => {
              elementsRef.current['phloemSection'] = el;
            }} id='phloemSection' className='height-[15%] w-full opacity-0'>
              <p className='text-xl'>Phloem (100x magnified)</p>
              In Pinus wood, we also have phloem cells that make up a portion of the vascular tissue that is located outside of the xylem.
            </div>

            <div ref={el => {
              elementsRef.current['xylemSection'] = el;
            }} id='xylemSection' className='height-[15%] w-full opacity-0'>
              <p className='text-xl'>Xylem (40x magnified)</p>
              In Pinus wood, there are specialized cells known as xylem which are responsible for transporting water and minerals throughout the plant body.
            </div>
          </div>

          <div className='w-full pt-[5%] text-center fade'>
            <input ref={slider as Ref<HTMLInputElement>} id='opacitySlider' type='range' min='0' max='300' step='1' value={rangeValue} onChange={(e: ChangeEvent<HTMLInputElement>) => handleValueChange(e, setRangeValue)}></input><br></br><br></br>
            <p>Annotated by: Heather Davis</p>
            <p>Model by: AJ Bealum</p>
          </div>

        </div>

      </article>
      <Foot />
    </main>
}