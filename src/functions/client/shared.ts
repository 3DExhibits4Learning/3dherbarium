import { SetStateAction, Dispatch } from "react";

/**
 * 
 * @param requiredValues 
 * @param setIsDisabled 
 */
export const buttonEnable = (requiredValues: any[], setIsDisabled: Dispatch<SetStateAction<boolean>>) => {
    if (requiredValues.every((value) => value)) setIsDisabled(false)
    else setIsDisabled(true)
}

/**
 * 
 * @param originalValues 
 * @param currentValues 
 * @returns 
 */
export const arrStrCompare = (originalValues: any[], currentValues: any[]) => JSON.stringify(originalValues) === JSON.stringify(currentValues) ? true : false
