'use client'

import { NavbarMenuItem } from "@nextui-org/react"

export default function MobileMenuOptions(props:{menuItems: string[]}) {
    return (
        <>
            {
                props.menuItems.map((item, index) =>
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <a
                            className="w-full text-[#004C46] dark:text-white"
                            href={index === 0 ? "/" : index === 1 ? `/collections/search` : index === 2 ? `/plantid` : index === 3 ? "/feed" : index === 4 ? "https://libguides.humboldt.edu/accessibility/3dherbarium" : "#"}
                        >
                            {item}
                        </a>
                    </NavbarMenuItem>
                )
            }
        </>
    )
}