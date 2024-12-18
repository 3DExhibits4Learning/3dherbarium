/**
 * @file src/components/Header/LogoAndSignIn.tsx
 * 
 * @fileoverview header logo and sign in 
 * 
 * @todo extract isAdmin()
 */

'use client'

// Typical imports
import { NavbarContent, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from "@nextui-org/react"
import { signIn, signOut, useSession, } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Default imports
import Image from "next/image"
import Link from "next/link"

// Main JSX
export default function LogoAndSignIn() {

    // Variables
    const { data: session } = useSession();
    const router = useRouter()
    const [isAdministrator, setIsAdministrator] = useState<boolean>()

    useEffect(() => {
        const isAdmin = async () => {
            if (session?.user?.email) {
                const adminBoolRes = await fetch(`/api/admin?email=${session.user?.email}`).then(res => res.json()).then(json => json.response)
                setIsAdministrator(adminBoolRes)
            }
        }
        isAdmin()
    }, [])

    return (
        <NavbarContent className="hidden lg:flex pl-[0.5vw]" justify="end">
            <Link href='/'>
                <Image src="../../../libLogo.svg" width={70} height={70} alt="Logo" className="pt-[3px]" />
            </Link>
            {
                !session &&
                <Button variant='ghost' color='secondary' onClick={() => signIn()}>Sign In</Button>
            }
            {
                session &&
                <Dropdown>
                    <DropdownTrigger>
                        <Avatar className="cursor-pointer" isFocusable={true} src={session?.user?.image!} name={session?.user?.name!} />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="dashboard" onClick={() => router.push('/dashboard')}>Dashboard</DropdownItem>
                        <DropdownItem key="modelSubmit" onClick={() => router.push('/modelSubmit')}>Submit 3D Model</DropdownItem>
                        {
                            <>
                                {
                                    isAdministrator && process.env.NEXT_PUBLIC_LOCAL_ENV === 'development' && session.user?.email !== 'ab632@humboldt.edu' &&
                                    <DropdownItem key="modelSubmit" onClick={() => router.push('/admin')}>Admin</DropdownItem>
                                }
                            </>
                        }
                        {
                            <>
                                {
                                    session.user?.email === 'ab632@humboldt.edu' &&
                                    <DropdownItem key="modelSubmit" onClick={() => router.push('/admin')}>Admin</DropdownItem>
                                }
                            </>
                        }
                        <DropdownItem key="signOut" onClick={() => signOut()}>Sign Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            }
        </NavbarContent>
    )
}