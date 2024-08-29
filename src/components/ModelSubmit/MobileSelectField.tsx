import { MutableRefObject, forwardRef, ForwardedRef, useEffect } from "react"

const MobileSelect = forwardRef((props : { handler: Function, defaultValue?: string}, ref : ForwardedRef<string>) => {
    const mobileRef = ref as MutableRefObject<string>
    const handleMobile = (e: React.ChangeEvent<HTMLInputElement>) => {
        mobileRef.current = (e.target as HTMLInputElement).value
        props.handler()
    }
    useEffect(() => {
        if(props.defaultValue){
            const radioButton = document.getElementById(props.defaultValue) as HTMLInputElement
            radioButton.checked = true
        }
    },[]) // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
        <p className='text-2xl mt-8 ml-12'>Was the 3D Model created with a mobile 3D modeling app, such as PhotoCatch or PolyCam?</p>
        <div className='grid grid-cols-2 w-[90px] mt-4 ml-12'>
            <div className='flex items-center'><label className='text-xl'>Yes</label></div>
            <div className='flex items-center'><input onChange={(e) => handleMobile(e)} className='mt-1' type='radio' value='Yes' name='usedMobileApp' id='Yes'></input></div>
            <div className='flex items-center'><label className='text-xl mr-4'>No</label></div>
            <div className='flex items-center'><input onChange={(e) => handleMobile(e)} className='mt-1' type='radio' value='No' name='usedMobileApp' id='No'></input></div>
        </div>
        </>
    )
})
MobileSelect.displayName = 'MobileSelect'
export default MobileSelect