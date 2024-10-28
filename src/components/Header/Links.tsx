'use client'

import { NavbarItem } from "@nextui-org/react"
import Link from "next/link"

export default function Links(props: {page?: string}) {
    return(
        <>
            <NavbarItem className="pr-[2vw]">
                <Link className="text-white dark:text-[#F5F3E7]" href={`/collections/search`}>
                    Collections
                </Link>
            </NavbarItem>
            <NavbarItem className="pr-[2vw]">
                <Link className="text-white dark:text-[#F5F3E7]" href={`/plantid`}>
                    Plant.id
                </Link>
            </NavbarItem>
            <NavbarItem className="pr-[2vw]">
                <Link className="text-white dark:text-[#F5F3E7]" href={`/feed`}>
                    Feed
                </Link>
            </NavbarItem>
            {props.page && props.page == 'home' &&
                <NavbarItem>
                    <Link className="text-white dark:text-[#F5F3E7]" href={'https://libguides.humboldt.edu/accessibility/3dherbarium'} target="_blank">
                        Accessibility
                    </Link>
                </NavbarItem>
            }
        </>
    )
}

