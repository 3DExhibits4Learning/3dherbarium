'use client'

import { NavbarItem } from "@heroui/react"
import { useEffect, useState } from "react";
import { isBotanyTouchscreen } from "@/functions/client/touchScreen";

import Link from "next/link"

export default function Links(props: { page?: string }) {

    const [isBotanyTouchscreenState, setIsBotanyTouchscreenState] = useState<boolean>(false)

    useEffect(() => { const setIsTouchscreen = async () => { setIsBotanyTouchscreenState(await isBotanyTouchscreen()); setIsTouchscreen() } }, [])

    return (
        <>
            <NavbarItem className="pr-[2vw]">
                <Link className="text-white dark:text-[#F5F3E7]" href={`/collections/search`} aria-label="Go to the collections page">
                    Collections
                </Link>
            </NavbarItem>
            <NavbarItem className="pr-[2vw]">
                <Link className="text-white dark:text-[#F5F3E7]" href={`/plantid`} aria-label="Go to the plant.id page">
                    Plant.id
                </Link>
            </NavbarItem>
            <NavbarItem className="pr-[2vw]">
                <Link className="text-white dark:text-[#F5F3E7]" href={`/feed`} aria-label="Go to the feed page">
                    Feed
                </Link>
            </NavbarItem>
            {
                props.page && props.page == 'home' && isBotanyTouchscreenState &&
                <NavbarItem>
                    <Link className="text-white dark:text-[#F5F3E7]" href={'https://libguides.humboldt.edu/accessibility/3dherbarium'} target="_blank" aria-label="Find out more about accessibility">
                        Accessibility
                    </Link>
                </NavbarItem>
            }
        </>
    )
}

