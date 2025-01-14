'use client'

import ImageSetForm from "./ImageSetForm"
import { specimenWithImageSet } from "@/api/types"

export default function ImageSetForms(props: { specimen: specimenWithImageSet[] }) {

    return (
        <section className="grid grid-cols-3 w-full mt-6">
            {props.specimen.map((specimen, index) => <ImageSetForm specimen={specimen} key={index} />)}
        </section>
    )
}