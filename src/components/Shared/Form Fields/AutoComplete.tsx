// TODO: 
// Bug: When empty, the autocomplete field requires two tab key presses to focus on the next component

'use client'

import { ChangeEvent, Ref, useRef, useState, useEffect, KeyboardEvent, SetStateAction, Dispatch } from "react"
import { useRouter } from "next/navigation"

export default function Autocomplete(props: { options: any[], changeFn: Function, width?: string, value: string, setValue:Dispatch<SetStateAction<string>>, className?: string, listWidth?: string, search?: boolean }) {
    // Variable Declarations

    const router = useRouter()

    //const valueRef = ref as MutableRefObject<string>
    const selectedValue = useRef<HTMLInputElement>(undefined)
    const valueRef = useRef<string>(undefined)
    const options = useRef<HTMLUListElement>(undefined)
    const [optionsVisible, setOptionsVisible] = useState<boolean>(true)
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

    // Typical ref update for input onChange

    const changeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        setOptionsVisible(true)
        valueRef.current = e.target.value
        props.setValue(e.target.value)
        await props.changeFn()
    }

    // If an option is selected from the autocomplete list with a click, populate the input value field with that option

    const listSelect = (option: string) => {
        if (selectedValue.current) {
            selectedValue.current.value = option
            valueRef.current = option
            props.setValue(option)
        }
        setOptionsVisible(false)
    }

    // Handle clicks outside of the autocomplete component

    const handleOutsideClick = (e: MouseEvent) => {
        if (options.current && !options.current.contains(e.target as Node)) {
            setOptionsVisible(false)
        }
    }

    // Autocomplete keypress handler
    // Note e.stopPropagation() is only for the arrowup key on the admin pages with the wrapper being the accordion from nextui

    const autocompleteKeyHandler = (e: KeyboardEvent<HTMLInputElement>) => {

        if (e.key === 'Enter' && valueRef.current && props.search) {
            e.preventDefault();
            //@ts-ignore
            router.push(`/collections/${e.target.value}`)
        }

        if (optionsVisible) {

            if (e.shiftKey && e.key === "Tab") {

                if (highlightedIndex >= 0) {
                    e.preventDefault();
                    setHighlightedIndex(highlightedIndex - 1)
                }
            }

            else if (e.key === "ArrowDown" || e.key === 'Tab') {

                if (highlightedIndex < 0) {
                    e.preventDefault();
                    setHighlightedIndex(0)
                }

                else if (highlightedIndex < props.options.length - 1) {
                    e.preventDefault();
                    setHighlightedIndex(highlightedIndex + 1)
                }
            }

            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                e.stopPropagation()

                if (highlightedIndex >= 0) {
                    setHighlightedIndex(highlightedIndex - 1)
                }
            }

            else if (e.key === 'Enter') {
                e.preventDefault();

                if (highlightedIndex >= 0 && selectedValue.current) {
                    selectedValue.current.value = props.options[highlightedIndex].name
                    valueRef.current =props.options[highlightedIndex].name
                    props.setValue(props.options[highlightedIndex].name)
                    setOptionsVisible(false)

                    if (props.search) {
                        router.push(`/collections/${valueRef.current}`)
                    }
                }
            }
        }
    }

    // Add or remove outside click listener
    useEffect(() => {
        if (typeof window !== undefined) {
            if (optionsVisible) document.addEventListener('click', handleOutsideClick);
            else document.removeEventListener('click', handleOutsideClick)
        }
    }, [optionsVisible])

    // If options have become less than highlighted index onChange, reset index
    useEffect(() => {
        if (props.options.length < highlightedIndex) {
            setHighlightedIndex(-1)
        }
    }, [props.options]) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <>
            <div className="flex">
                <input
                    ref={selectedValue as Ref<HTMLInputElement>}
                    type='text'
                    className={`${props.className} ${props.width}`}
                    onChange={(e) => changeHandler(e)}
                    onKeyDown={autocompleteKeyHandler}
                    value={props.value}
                >
                </input>
                {
                    props.options.length > 0 && optionsVisible &&
                    <ul ref={options as Ref<HTMLUListElement>} className={`absolute ${props.listWidth} z-50 bg-white dark:bg-[#27272a] rounded-xl mt-[42px] text-[#004C46]`}>
                        {props.options.map((option, index) => {
                            if (index == highlightedIndex) return <li onClick={() => listSelect(option.name)} className={`hover:cursor-pointer px-4 bg-[#00856A] rounded-lg text-white`} key={option.name}>{option.name}</li>
                            else return <li onClick={() => listSelect(option.name)} className={`hover:bg-[#00856A] hover:text-white dark:hover:bg-[#00856A] dark:text-white hover:cursor-pointer px-4 rounded-lg`} key={option.name}>{option.name}</li>
                        })}
                    </ul>
                }
            </div>
        </>
    );
} 