import { SetStateAction, Dispatch } from "react"

export interface AnnotationNumbers { id: string, no: string }

export default function AnnotationNumber(props: { annotation: AnnotationNumbers, max: string, annotationNumbers: AnnotationNumbers[], setAnnotationNumbers: Dispatch<SetStateAction<AnnotationNumbers[]>>}){

    const numberChangeHandler = (no: string) => {
        const newAnnotationNumbers = props.annotationNumbers?.map(annotationNumber => annotationNumber.id === props.annotation.id ? { id: annotationNumber.id, no: no} : annotationNumber)
        props.setAnnotationNumbers(newAnnotationNumbers)
    }

    return <div className="flex justify-center border p-4 w-24">
        <input
            onChange={e => numberChangeHandler(e.target.value)}
            type='number'
            min='2'
            max={props.max}
            value={props.annotation.no}
            className="h-12 w-16 text-xl text-center">
        </input>
    </div>
}