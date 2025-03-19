/**
 * @function terminateDataTransfer
 * 
 * @description Terminate data transfer function (Set modal result states)
 */

'use client'

import { SetStateAction, Dispatch } from "react"

export default function terminateDataTransfer(setResult: Dispatch<SetStateAction<string>>, setTransferring: Dispatch<SetStateAction<boolean>>, result: string) { setResult(result); setTransferring(false) }