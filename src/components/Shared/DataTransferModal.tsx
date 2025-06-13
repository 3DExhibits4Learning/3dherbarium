/**
 * @file src/components/Shared/DataTransferModal.tsx
 * 
 * @fileoverview general data transfer modal
 */

'use client'

// Typical imports
import { Modal, ModalContent, ModalBody, ModalFooter, Spinner, Button } from "@heroui/react"
import { SetStateAction, Dispatch } from "react";

// Main JSX
export default function DataTransferModal(props: { open: boolean, transferring: boolean, result: string, loadingLabel: string, href?: string, setOpen?: Dispatch<SetStateAction<boolean>>, closeFn?: Function, closeVar?: boolean }) {
    return <Modal isOpen={props.open} isDismissable={false} hideCloseButton isKeyboardDismissDisabled={true} className="relative z-50">
        <ModalContent>
            <ModalBody className="text-center">
                {
                    props.transferring &&
                    <Spinner label={props.loadingLabel} />

                }
                {
                    !props.transferring &&
                    <p>{props.result}</p>
                }
            </ModalBody>
            <ModalFooter className="flex justify-center">
                {
                    !props.transferring && props.href &&
                    <a href={props.href}><Button color="primary">OK</Button></a>
                }
                {
                    !props.transferring && !props.href && props.setOpen && !props.closeFn &&
                    <Button color="primary" onPress={() => (props.setOpen as Dispatch<SetStateAction<boolean>>)(false)}>OK</Button>
                }
                {
                    !props.transferring && !props.href && props.closeFn &&
                    <Button color="primary" onPress={() => {(props.closeFn as Function)(!props.closeVar)}}>OK</Button>
                }
            </ModalFooter>
        </ModalContent>
    </Modal>
}
