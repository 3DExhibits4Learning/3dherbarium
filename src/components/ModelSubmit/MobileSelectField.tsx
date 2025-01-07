import { useEffect, SetStateAction, Dispatch } from "react"

export default function MobileSelect(props : { value: string | undefined, setValue: Dispatch<SetStateAction<string | undefined>> | Dispatch<SetStateAction<string>>, defaultValue?: string}){
    
    useEffect(() => {
        if(props.defaultValue){
            const radioButton = document.getElementById(props.defaultValue) as HTMLInputElement
            radioButton.checked = true
        }
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
        <p className='text-2xl mt-8'>Was the 3D Model created with a mobile 3D modeling app, such as PhotoCatch or PolyCam?<span className="text-red-600 ml-1">*</span></p>
        <div className='grid grid-cols-2 w-[90px] mt-4'>
            <div className='flex items-center'><label className='text-xl'>Yes</label></div>
            <div className='flex items-center'><input onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='Yes' name='usedMobileApp' id='Yes'></input></div>
            <div className='flex items-center'><label className='text-xl mr-4'>No</label></div>
            <div className='flex items-center'><input onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='No' name='usedMobileApp' id='No'></input></div>
        </div>
        </>
    )
}