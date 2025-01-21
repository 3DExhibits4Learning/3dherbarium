'use client'

import { SetStateAction, Dispatch, useCallback, ChangeEvent } from "react"

export default function YesOrNo(props: { value: boolean | undefined, setValue: Dispatch<SetStateAction<boolean>>, title: string, required?: boolean, topMargin?: string, defaultNo?: boolean }) {

    const changeHandler = useCallback((isViable: boolean) => props.setValue(isViable), [])

    return <div className={`${props.topMargin}`}>
        {
            props.title &&
            <p className="text-2xl mb-1">{props.title}
                {
                    props.required &&
                    <span className="text-red-600 ml-1">*</span>
                }
            </p>
        }
        <select className='dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 rounded-xl outline-[#004C46] mb-8' onChange={e => changeHandler(parseInt(e.target.value) ? true : false)}>
            {
                props.defaultNo &&
                <>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </>

            }
            {
                !props.defaultNo &&
                <>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </>

            }
        </select>
    </div>
}