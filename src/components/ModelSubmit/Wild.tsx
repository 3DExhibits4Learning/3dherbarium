import { SetStateAction, Dispatch } from "react"

export default function WildSelect(props: { setValue: Dispatch<SetStateAction<string>> }) {

    return (
        <>
            <p className='text-2xl mt-8 ml-12'>Is this specimen wild or cultivated?<span className="text-red-600 ml-1">*</span></p>
            <div className='grid grid-cols-2 w-[200px] mt-4 ml-12 mb-10'>
                <div className='flex items-center'><label className='text-xl mr-4'>Wild</label></div>
                <div className='flex items-center'><input onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='wild' name='usedMobileApp' id='Wild'></input></div>
                <div className='flex items-center'><label className='text-xl'>Cultivated</label></div>
                <div className='flex items-center'><input onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='cultivated' name='usedMobileApp' id='Cultivated'></input></div>
            </div>
        </>
    )
}