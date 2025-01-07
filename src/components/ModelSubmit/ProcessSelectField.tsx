import { useEffect, SetStateAction, Dispatch } from "react"

export default function ProcessSelect(props: { value: string | undefined, setValue: Dispatch<SetStateAction<string | undefined>> | Dispatch<SetStateAction<string>>, defaultValue?: string}){
    
    useEffect(() => {
        if(props.defaultValue){
            const radioButton = document.getElementById(props.defaultValue) as HTMLInputElement
            radioButton.checked = true
        }
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <p className='text-2xl mt-8'>What process was used to create the 3D model?<span className="text-red-600 ml-1">*</span></p>
            <div className='grid grid-cols-2 w-[210px] mt-4 mb-8' style={{ gridTemplateColumns: 'auto auto' }}>
                <div className='flex items-center'><label className='text-xl'>Photogrammetry</label></div>
                <div className='flex items-center'>
                    <input
                        onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='photogrammetry' name='modelMethod' id='photogrammetry'>
                    </input>
                </div>
                <div className='flex items-center'>
                    <label className='text-xl mr-4'>X-Ray or Laser Scan</label>
                </div>
                <div className='flex items-center'>
                    <input onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='scan' name='modelMethod' id='scan'>
                    </input>
                </div>
                <div className='flex items-center'>
                    <label className='text-xl mr-4'>Other</label>
                </div>
                <div className='flex items-center'>
                    <input onChange={(e) => props.setValue(e.target.value)} className='mt-1' type='radio' value='other' name='modelMethod' id='other'>
                    </input>
                </div>
            </div>
        </>
    )
}