'use client'

import { useCallback, SetStateAction, Dispatch } from 'react'
//@ts-ignore
import Tags from '@yaireo/tagify/dist/react.tagify' // React-wrapper file
import '@yaireo/tagify/dist/tagify.css' // Tagify CSS

export default function TagInput(props: { defaultValues?: {value: string}[], title: string, required?: boolean, setTags: Dispatch<SetStateAction<{value: string}[]>> }){

        var tagString: string = ''

        if(props.defaultValues){
            for (let i = 0; i < props.defaultValues?.length; i++) {
                tagString += props.defaultValues[i].value + ','
            }
            tagString = tagString.slice(0, -1)
        }

    const onChange = useCallback((e: any) => {
        // e.detail.tagify.value // Array where each tag includes tagify's (needed) extra properties
        // e.detail.tagify.getCleanValue() // Same as above, without the extra properties (Plain array of string objects {value: '[tag]'})
        // e.detail.value // a string representing the tags
        props.setTags(e.detail.tagify.getCleanValue())
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <h1 className='text-2xl mb-2'>{props.title}
                {
                    props.required &&
                    <span className="text-red-600 ml-1">*</span>
                }
            </h1>
            <Tags
                id='tags'
                className='w-4/5 h-[150px] bg-white dark:bg-[#181818] dark:text-white'
                placeholder='Add some tags'
                settings={{
                    blacklist: ["xxx"],
                    maxTags: 4,
                    dropdown: {
                        enabled: 0 // always show suggestions dropdown
                    }
                }}
                defaultValue={tagString}
                onChange={onChange}
            />
        </>
    )
}