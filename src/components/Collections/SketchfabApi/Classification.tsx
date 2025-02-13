'use client'

import { GbifResponse } from "@/ts/types";

export default function Classification(props: { gMatch: GbifResponse }) {

    const gMatch = props.gMatch

    return (
        <div className='fade flex w-[99%] mt-[25px]'>
            <div className='annotationBorder w-[35%] flex text-[1.5rem] justify-center items-center py-[20px] border-r'>
                <p> Classification </p>
            </div>
            <div className='w-[65%] py-[20px] justify-center items-center text-center'>
                <p>Species: <i><span className='text-[#FFC72C]'>{gMatch.species}</span></i></p>
                <p>Kingdom: {gMatch.kingdom}</p>
                <p>Phylum: {gMatch.phylum}</p>
                <p>Order: {gMatch.order}</p>
                <p>Family: {gMatch.family}</p>
                <p>Genus: <i>{gMatch.genus}</i></p>
            </div>
        </div>
    )
}