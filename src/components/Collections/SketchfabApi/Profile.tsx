'use client'

import { sketchfabApiData } from "@/ts/collections"
import { addCommas } from "../SketchfabDom"
import { boolRinse } from "../SketchfabDom"
import { toUpperFirstLetter } from "@/functions/server/utils/toUpperFirstLetter"
import Herbarium from "@/functions/client/utils/HerbariumClass"

export default function Profile(props: { sketchfabApi: sketchfabApiData }) {

    const s = props.sketchfabApi.s as Herbarium // s = specimen

    return (
        <>
            <div className='fade flex w-[99%] mt-[25px]'>
                <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                    <p> Profile </p>
                </div>
                <div className='w-[65%] py-[20px] justify-center items-center text-center px-[2%]'>
                    <p>Date acquired: {s.model.spec_acquis_date.toDateString()}</p>
                    {s.specimen.height && <p>Specimen height: {s.specimen.height} cm</p>}
                    {s.commonNames.length > 1 && <p>Common Names: {addCommas(s.commonNames)}</p>}
                    {s.commonNames.length == 1 && <p>Common Names: {s.commonNames[0]}</p>}
                    {s.profile.extinct !== '' && <p>Extinct: {boolRinse(s.profile.extinct as string)}</p>}
                    {s.profile.habitat && <p>Habitat: {toUpperFirstLetter(s.profile.habitat)}</p>}
                    {s.profile.freshwater !== '' && <p>Freshwater: {boolRinse(s.profile.freshwater as string)}</p>}
                    {s.profile.marine !== '' && <p>Marine: {boolRinse(s.profile.marine as string)}</p>}
                </div>
            </div>
        </>
    )
}