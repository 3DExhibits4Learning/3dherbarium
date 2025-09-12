'use client'

import { specimenWithImageSet } from "@/ts/types"

import ModelForm from "./ModelForm"

export default function ModelForms(props: { specimen: specimenWithImageSet[] }) {
    return <section className="grid grid-cols-3 w-full px-12 mb-12 mt-6">
            {props.specimen.map((specimen, index) => <ModelForm specimen={specimen} key={index} />)}
        </section>
}