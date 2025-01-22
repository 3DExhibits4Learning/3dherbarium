'use client'

import AnnotationReposition from "../AnnotationFields/AnnotationReposition"
import RadioButtons from "../AnnotationFields/RadioButtons"

export default function RepositionAndRadio(props: { isNew: boolean, index: number | 'new' | undefined }) {
    return <section className="flex justify-around">
        {
            !props.isNew &&
            <AnnotationReposition />
        }
        <p className="text-2xl mb-4 mt-2">Annotation {props.index}</p>
        <section className="flex">
            <div className="flex flex-col items-center justify-center">
                <div className="flex items-center">
                    <RadioButtons />
                </div>
            </div>
        </section>
    </section>
}