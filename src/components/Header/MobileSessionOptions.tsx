'use client'

import { signIn, signOut } from "next-auth/react"
import { NavbarMenuItem, Avatar, Button, } from "@heroui/react"
import Link from "next/link"

export default function MobileSessionOptions(props: { session: any, userItems: string[] }) {
    return (
        <>
            {
                !props.session &&
                <NavbarMenuItem>
                    <Button className='w-3/5 my-6' color='primary' onClick={() => signIn()}>Sign In</Button>
                </NavbarMenuItem>
            }

            {
                props.session &&
                <NavbarMenuItem>
                    <Avatar className="cursor-pointer" isFocusable={true} src={props.session?.user?.image!} name={props.session?.user?.name!} />
                </NavbarMenuItem>
            }

            {
                props.session &&
                props.userItems.map((item, index) =>
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full text-[#004C46] dark:text-white   "
                            href={index === 0 ? "/dashboard" : index === 1 ? `/modelSubmit` : '#'}
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                )
            }

            {
                props.session &&
                <NavbarMenuItem>
                    <Button className='w-3/5 my-6' color='primary' onClick={() => signOut()}>Sign Out</Button>
                </NavbarMenuItem>
            }
        </>
    )
}