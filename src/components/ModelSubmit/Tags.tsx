'use client'

import { MutableRefObject, forwardRef, useCallback, ForwardedRef } from 'react'
//@ts-ignore
import Tags from '@yaireo/tagify/dist/react.tagify' // React-wrapper file
import '@yaireo/tagify/dist/tagify.css' // Tagify CSS

const TagInput = forwardRef((props: { defaultValues?: string }, ref: ForwardedRef<object[]>) => {

    const tags = ref as MutableRefObject<object[]>

    const onChange = useCallback((e: any) => {
        // e.detail.tagify.value // Array where each tag includes tagify's (needed) extra properties
        // e.detail.tagify.getCleanValue() // Same as above, without the extra properties (Plain array of string objects {value: '[tag]'})
        // e.detail.value // a string representing the tags
        tags.current = e.detail.tagify.getCleanValue()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <h1 className='ml-12 text-2xl mb-2'>Enter tags to describe your specimen, such as phenotype(fruits, flowers, development stage, etc.)</h1>
            <Tags
                id='tags'
                className='w-4/5 h-[150px] bg-white ml-12 dark:bg-[#181818] dark:text-white'
                placeholder='Add some tags'
                settings={{
                    blacklist: ["xxx"],
                    maxTags: 4,
                    dropdown: {
                        enabled: 0 // always show suggestions dropdown
                    }
                }}
                defaultValue={props.defaultValues}
                onChange={onChange}
            />
        </>
    )
})
TagInput.displayName = 'tags'
export default TagInput