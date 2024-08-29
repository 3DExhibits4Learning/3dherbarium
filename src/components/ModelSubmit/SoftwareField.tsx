import { MutableRefObject, forwardRef, ForwardedRef } from "react"

const Software = forwardRef((props: { handler: Function, defaultValue?: string }, ref: ForwardedRef<string>) => {
    const softwareRef = ref as MutableRefObject<string>
    const softwareSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        softwareRef.current = (e.target as HTMLInputElement).value
        props.handler()
    }
    const size = props.defaultValue ? 'w-3/5' : 'w-1/2 md:w-1/3'
    return (
        <>
            <div className='mt-8 mb-6'>
                <p className='text-2xl ml-12 mb-4'>What software was used to create the 3D Model?</p>
                <label className='text-2xl ml-12'>Software </label>
                <input type='text' name='software0' className={`${size} max-w-[500px] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`} defaultValue={props.defaultValue} onChange={(e) => softwareSelection(e)}></input>
            </div>
        </>
    )
})
Software.displayName = 'ArtistName'
export default Software