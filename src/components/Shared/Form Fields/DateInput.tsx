import { Dispatch, SetStateAction } from "react"

export default function DateInput (props:{value: string | undefined, setValue:Dispatch<SetStateAction<string | undefined>>, title?: string, required?: boolean}){
    return (
        <>
            <div className="mb-8">
            {
                props.title && 
                <p className={`text-2xl mb-2`}>{props.title}
                    {
                        props.required &&
                        <span className="text-red-600 ml-1">*</span>
                    }
                </p>
            }
                <input
                    type='date'
                    className={`w-2/5 md:w-3/5 max-w-[250px] rounded-xl dark:bg-[#27272a] dark:hover:bg-[#3E3E47] h-[42px] px-4 !placeholder-[#9797A0] outline-[#004C46]`}
                    value={props.value}
                    onChange={(e) => props.setValue(e.target.value)}
                >
                </input>
            </div>
        </>
)}