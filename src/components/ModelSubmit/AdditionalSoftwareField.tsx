import { MutableRefObject, forwardRef } from "react"
import { ForwardedRef } from "react"

const AdditionalSoftware = forwardRef((props: { handler: Function, stateVar: number, stateFn: Function, edit?: boolean }, ref: ForwardedRef<string[]>) => {

    let defaultValues = ['', '', '', '']
    const additionalRef = ref as MutableRefObject<string[]>

    const additionalSoftwareSelection = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        additionalRef.current[index] = (e.target as HTMLInputElement).value
        props.handler()
    }

    const addSoftware = () => {
        if (props.stateVar < 4) {
            props.stateFn(props.stateVar + 1)
        }
    }

    const removeSoftware = () => {
        if (props.stateVar > 0) {
            props.stateFn(props.stateVar - 1)
            additionalRef.current.pop()
        }
    }

    for (let value in additionalRef.current) {
        defaultValues[value] = additionalRef.current[value]
    }

    const size = props.edit ? 'w-3/5' : 'w-1/2 md:w-1/3'

    return (
        <>
            {props.stateVar > 0 &&
                <div className='mb-6'>
                    <label className='text-2xl ml-12'>Software </label>
                    <input type='text' name='software1' className={`${size} max-w-[500px] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                        defaultValue={defaultValues[0]}
                        onChange={(e) => additionalSoftwareSelection(0, e)}>
                    </input>
                    <button type='button' className='ml-2 w-[18.09px]' onClick={removeSoftware} >X</button>
                </div>}
            {props.stateVar > 1 &&
                <div className='mb-6'>
                    <label className='text-2xl ml-12'>Software </label>
                    <input type='text' name='software2' className={`${size} max-w-[500px] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                        defaultValue={defaultValues[1]}
                        onChange={(e) => additionalSoftwareSelection(1, e)}>
                    </input>
                    <button type='button' onClick={removeSoftware} className='ml-2 w-[18.09px]'>X</button>
                </div>}
            {props.stateVar > 2 &&
                <div className='mb-6'>
                    <label className='text-2xl ml-12'>Software </label>
                    <input type='text' name='software3' className={`${size} max-w-[500px] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                        defaultValue={defaultValues[2]}
                        onChange={(e) => additionalSoftwareSelection(2, e)}>
                    </input>
                    <button type='button' onClick={removeSoftware} className='ml-2 w-[18.09px]'>X</button>
                </div>}
            {props.stateVar > 3 &&
                <div className='mb-6'>
                    <label className='text-2xl ml-12'>Software </label>
                    <input type='text' name='software4' className={`${size} max-w-[500px] rounded-xl mb-4 ml-12 dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 text-[14px] outline-[#004C46]`}
                        defaultValue={defaultValues[3]}
                        onChange={(e) => additionalSoftwareSelection(3, e)}>
                    </input>
                    <button type='button' onClick={removeSoftware} className='ml-2 w-[18.09px]'>X</button>
                </div>}

            {/*Button from nextui doesn't render in Edit modal for some reason*/}

            {props.stateVar != 4 &&
                <button type='button' className='mb-4 ml-12 bg-[#004C46] text-white w-2/5 py-2 rounded-xl' onClick={addSoftware}>Add Another Software</button>}
        </>
    )
})
AdditionalSoftware.displayName = 'AdditionalSoftware'
export default AdditionalSoftware