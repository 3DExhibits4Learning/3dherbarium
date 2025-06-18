'use client'
import { Modal, ModalContent, ModalBody, ModalFooter, Spinner, useDisclosure, Button } from "@heroui/react"
import { Progress } from "@heroui/progress";
import { SetStateAction, Dispatch } from "react";

export default function DataTransfer(props: { open: boolean, transferring: boolean, result: string, success: boolean | null }) {

    const NewModelOrDashboard = () => {
        return (
            <div className="flex w-full justify-around mb-8">
                <div>
                    <Button color="primary" onPress={() => {
                        if (typeof window !== undefined) {
                            window.scrollTo(0, 0)
                            location.reload()
                        }
                    }}>
                        Submit New Model
                    </Button>
                </div>
                <div>
                    <a href="/dashboard"><Button color="primary">
                        Dashboard
                    </Button>
                    </a>
                </div>
            </div>
        )
    }

    return (
        <>
            <Modal isOpen={props.open} isDismissable={false} hideCloseButton isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="text-center">
                                {
                                    props.transferring &&
                                    <>
                                        <Spinner label="Uploading 3D Model" />
                                    </>
                                }
                                {
                                    !props.transferring &&
                                    <p className="mt-6">{props.result}</p>
                                }
                            </ModalBody>
                            <ModalFooter className="flex justify-center">
                                {
                                    props.success === false &&
                                    <NewModelOrDashboard />
                                }
                                {props.success === true &&
                                        <section className="flex flex-col">
                                            <div className="mb-12">
                                                <br></br>
                                                <p>Thank you for contributing!</p><br></br>
                                                <p>You will receive an email with a link to your model when it&apos;s published on the site. You can also check its status in your <a href='/dashboard'><u>dashboard</u></a></p>
                                                <br></br>
                                                <p>(It may take a few moments before your model is available in your dashboard)</p>
                                            </div>
                                            <NewModelOrDashboard />
                                        </section>
                                }
                                {/* {
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
                                } */}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}