'use client'

import { SetStateAction, Dispatch } from "react"
import { NavbarMenuItem, Switch, Divider, cn } from "@heroui/react";

export default function MobileModelOptions(props: { isSelected: boolean | undefined, setIsSelected: Dispatch<SetStateAction<boolean>>, hasModel: boolean | undefined }) {
    return (
        <>
            {
                props.hasModel &&
                <NavbarMenuItem>
                    <h1 className="text-center">Settings</h1>
                    <Divider className="mb-2" />
                </NavbarMenuItem>
            }

            {
                props.hasModel &&
                <NavbarMenuItem>
                    <Switch defaultSelected
                        id="annotationSwitchMobile"
                        color='secondary'
                        isSelected={props.isSelected}
                        onValueChange={() => { props.setIsSelected; document.getElementById("annotationSwitchMobileHidden")?.click() }}
                        classNames={{
                            base: cn(
                                "inline-flex flex-row-reverse items-center gap-2",
                                "justify-between"
                            ),
                        }}
                    >
                        <p className="text-[18px] text-[#004C46] dark:text-white">Annotations</p>
                    </Switch>
                </NavbarMenuItem>
            }
        </>
    )
}