'use client'

import { forwardRef, SetStateAction, Dispatch } from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react"
import AutoComplete from "./Autocomplete"

export const MobileSearch = forwardRef((props: { autocompleteOptions: any[], fetchAutoCompleteOptions: Function, isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>> }, ref) => {

    return (
        <>
            <Modal className="lg:hidden bg-[#F5F3E7]" size={'full'} placement="top" isOpen={props.isOpen} scrollBehavior={"inside"} hideCloseButton={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col">
                                <AutoComplete autocompleteOptions={props.autocompleteOptions}
                                    fetchAutoCompleteOptions={props.fetchAutoCompleteOptions}
                                    ref={ref}
                                    width='max-w-[calc(100vw-78px)] w-[80vw] sm:max-w-[400px]'
                                    listWidth="max-w-[calc(100vw-78px)] w-[80vw] sm:max-w-[400px]"
                                />
                            </ModalHeader>
                            <ModalBody>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={() => props.setIsOpen(false)}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
})

MobileSearch.displayName = 'mobileSearch'
export default MobileSearch
