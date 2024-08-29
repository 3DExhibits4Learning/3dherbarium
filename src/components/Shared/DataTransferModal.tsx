'use client'
import { Modal, ModalContent, ModalBody, ModalFooter, Spinner, useDisclosure, Button } from "@nextui-org/react"
import { SetStateAction, Dispatch } from "react";

export default function DataTransferModal(props: { open: boolean, transferring: boolean, result: string, loadingLabel: string, href?: string, setOpen?: Dispatch<SetStateAction<boolean>>, closeFn?: Function, closeVar?: boolean }) {
    const { onOpenChange } = useDisclosure();
    return (
        <>
            <Modal isOpen={props.open} onOpenChange={onOpenChange} isDismissable={false} hideCloseButton isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
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
                                    // Note that onPress={router.refresh} would randomly not work for this button
                                    <a href={props.href}><Button color="primary">OK</Button></a>
                                }
                                {
                                    !props.transferring && !props.href && props.setOpen && !props.closeFn &&
                                    <Button color="primary" onPress={() => (props.setOpen as Dispatch<SetStateAction<boolean>>)(false)}>OK</Button>
                                }
                                {
                                    !props.transferring && !props.href && props.closeFn &&
                                    <Button color="primary" onPress={() => {
                                        (props.closeFn as Function)(!props.closeVar)
                                    }}>OK</Button>
                                }
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
