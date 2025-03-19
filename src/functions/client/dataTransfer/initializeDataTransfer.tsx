/**
 * @function initializeDataTransfer
 * 
 * @description Initialize data transfer function (Open modal and set transfer states)
 */

'use client'

import { SetStateAction, Dispatch } from "react"

export default function initializeDataTransfer(setOpenModal: Dispatch<SetStateAction<boolean>>, setTransferring: Dispatch<SetStateAction<boolean>>, setLoadingLabel: Dispatch<SetStateAction<string>>, loadingLabel: string) {
    setOpenModal(true)
    setTransferring(true)
    setLoadingLabel(loadingLabel)
}