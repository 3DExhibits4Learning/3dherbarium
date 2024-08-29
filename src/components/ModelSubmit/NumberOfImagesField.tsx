import { MutableRefObject, forwardRef } from "react"
import { ForwardedRef } from "react"

const NumberOfImages = forwardRef((props: { handler: Function, state: boolean }, ref: ForwardedRef<string>) => {
    const imagesRef = ref as MutableRefObject<string>
    const numberOfImagesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        imagesRef.current = (e.target as HTMLInputElement).value
        props.handler()
    }
    return (
        <>
        {props.state && <div>
            <label className='text-xl ml-12'>Number of Images:</label>
            <input type='number' name='imageCount' className='w-[10%] rounded-md mt-8 mb-4 ml-4 dark:bg-[#181818]' onChange={(e) => numberOfImagesHandler(e)}></input>
        </div>}
        </>
    )
})
NumberOfImages.displayName = 'ArtistName'
export default NumberOfImages