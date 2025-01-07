import { SetStateAction, Dispatch } from "react";

export const buttonEnable = (requiredValues: any[], setIsDisabled: Dispatch<SetStateAction<boolean>>) => {
    if (requiredValues.every((value) => value)) setIsDisabled(false)
    else setIsDisabled(true)
}
