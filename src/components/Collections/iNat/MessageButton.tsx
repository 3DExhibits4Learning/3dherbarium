"use client"

import { Button } from "@nextui-org/react"
import { useState } from "react"
import { sendMessageToObserver } from "@/functions/client/iNat"

export function MessageButton(props: {userToMessage : string}) {
    const [showForum, setShowForum] = useState<boolean>(false)

    const handleClick = () => {
        setShowForum(!showForum)
        
        //todo remove the user name sleepy kat and add userToMessage back
      sendMessageToObserver(
        "sleepykat",
        "Hello! From Cal Poly Humboldt 3D Herbarium",
        "This is a sample message sent via your integration.")
    }

    return(
        <>
        {showForum && (
            <MessageButton userToMessage="sleepykat"/>
        )}
        <Button className="text-white dark:bg-[#004C46]" onClick={handleClick}>Message User</Button>
        </>
    )








}