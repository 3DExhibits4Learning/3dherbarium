'use client'

import { addCommas } from "../SketchfabDom"
import { boolRinse } from "../SketchfabDom"
import { toUpperFirstLetter } from "@/utils/toUpperFirstLetter"

export default function Profile(props: { sketchfabApi: any }) {

    const sketchfabApi = props.sketchfabApi

    return (
        <>
            <div className='fade flex w-[99%] mt-[25px]'>
                <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                    <p> Profile </p>
                </div>
                <div className='w-[65%] py-[20px] justify-center items-center text-center px-[2%]'>
                    {sketchfabApi.s.commonNames.length > 1 && <p>Common Names: {addCommas(sketchfabApi.s.commonNames)}</p>}
                    {sketchfabApi.s.commonNames.length == 1 && <p>Common Names: {sketchfabApi.s.commonNames[0]}</p>}
                    {sketchfabApi.s.profile.extinct !== '' && <p>Extinct: {boolRinse(sketchfabApi.s.profile.extinct as string)}</p>}
                    {sketchfabApi.s.profile.habitat && <p>Habitat: {toUpperFirstLetter(sketchfabApi.s.profile.habitat)}</p>}
                    {sketchfabApi.s.profile.freshwater !== '' && <p>Freshwater: {boolRinse(sketchfabApi.s.profile.freshwater as string)}</p>}
                    {sketchfabApi.s.profile.marine !== '' && <p>Marine: {boolRinse(sketchfabApi.s.profile.marine as string)}</p>}
                </div>
            </div>
        </>
    )
}