'use client'

import ModelForm from "./ModelForm"
import { specimenWithImageSet } from "@/ts/types"

export default function ModelForms(props: { specimen: specimenWithImageSet[] }) {

    return (
        <section className="grid grid-cols-3 w-full px-12 mb-12 mt-6">
            {props.specimen.map((specimen, index) => <ModelForm specimen={specimen} key={index} />)}
        </section>
    )
}