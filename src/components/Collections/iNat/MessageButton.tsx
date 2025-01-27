"use client"

import { Button } from "@nextui-org/react"
import { useState } from "react"

export function MessageButton(props: {userToMessage : string}) {
    const [showForum, setShowForum] = useState<boolean>(false)

    const handleClick = () => {
        setShowForum(!showForum)
        

    //   sendMessageToObserver(
    //     props.userToMessage,
    //     "Hello! From Cal Poly Humboldt 3D Herbarium",
    //     "This is a sample message sent via your integration.")
    }

    return(
        <>
        {showForum && (
            <MessageButton userToMessage={props.userToMessage}/>
        )}
        <Button className="text-white dark:bg-[#004C46]" onClick={handleClick}>Message User</Button>
        </>
    )








}