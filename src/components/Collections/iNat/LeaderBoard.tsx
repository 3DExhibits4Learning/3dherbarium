/**
 * @file src/app/components/map/LeaderBoard.tsx
 * 
 * @fileoverview Displays the top observers and identifiers of the species
 * 
 * @todo
 */

"use client"

import { iNatLeadingUser, userPageUrl } from "@/functions/client/collections/iNat"
import React from "react"

/**
 * @description this component displays the top observers and identifiers for a specific species, 
 * based on data passed in as props.
 * 
 * @param props.identifiers - An array of top identifiers for the species. Each entry in the array
 *                                     contains data about an individual identifier.
 * @param props.observers - An array of top observers for the species. Each entry in the array
 *                                   contains data about an individual observer.
 * 
 * @returns a JSX element representing the LeaderBoard component.
 */
export function LeaderBoard(props: { identifiers: iNatLeadingUser[], observers: iNatLeadingUser[] }): JSX.Element {

    return (
        <>
            {props.observers &&
                <div className="bg-dune-grass dark:bg-[#212121] grid grid-cols-3 w-[100%] h-full my-4 rounded-lg">
                    <div className="flex border-b justify-center items-center">#</div>
                    <div className="flex border-b justify-center items-center">Observer</div>
                    <div className="flex border-b justify-center items-center">Observations</div>

                    {props.observers.map((observer, index) => (
                        <React.Fragment key={index}>
                            <div className="flex justify-center items-center">{index + 1}</div>
                            <div className="flex justify-center items-center">
                                <a href={userPageUrl + observer.user.userName}
                                    target="_blank">{observer.user.userName}</a></div>
                            <div className="flex justify-center items-center">{observer.count}</div>
                        </React.Fragment>
                    ))}

                </div>
            }
            {props.identifiers &&
                <div className="bg-dune-grass dark:bg-[#212121] grid grid-cols-3 w-[100%] h-full my-4 rounded-lg">
                    <div className="flex border-b justify-center items-center">#</div>
                    <div className="flex border-b justify-center items-center">Identifier</div>
                    <div className="flex border-b justify-center items-center">Identifications</div>


                    {props.identifiers.map((identifier, index) => (
                        <React.Fragment key={index}>
                            <div className="flex justify-center items-center">{index + 1}</div>
                            <div className="flex justify-center items-center"> <a href={userPageUrl + identifier.user.userName}
                                target="_blank">{identifier.user.userName}</a></div>
                            <div className="flex justify-center items-center">{identifier.count}</div>
                        </React.Fragment>
                    ))}
                </div>
            }
        </>
    )
}