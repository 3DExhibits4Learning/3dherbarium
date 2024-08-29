'use client'

import { NavbarItem } from "@nextui-org/react"

export default function Links(props: {page?: string}) {
    return(
        <>
            <NavbarItem className="pr-[2vw]">
                <a className="text-white dark:text-[#F5F3E7]" href={`/collections/search`}>
                    Collections
                </a>
            </NavbarItem>
            <NavbarItem className="pr-[2vw]">
                <a className="text-white dark:text-[#F5F3E7]" href={`/plantid`}>
                    Plant.id
                </a>
            </NavbarItem>
            <NavbarItem className="pr-[2vw]">
                <a className="text-white dark:text-[#F5F3E7]" href={`/feed`}>
                    Feed
                </a>
            </NavbarItem>
            {props.page && props.page == 'home' &&
                <NavbarItem>
                    <a className="text-white dark:text-[#F5F3E7]" href={'https://libguides.humboldt.edu/accessibility/3dherbarium'} target="_blank">
                        Accessibility
                    </a>
                </NavbarItem>
            }
        </>
    )
}

