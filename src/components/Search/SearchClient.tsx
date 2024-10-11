'use client'

import Header from "../Header/Header"
import SearchPageContent from "./SearchPageContent"
import { useState, createContext, SetStateAction, Dispatch} from "react"

export const QueryContext = createContext<any>('');

export default function SearchClient() {

    const [query, setQuery] = useState<string>('')

    return (
        <>
            <QueryContext.Provider value={{ query, setQuery }}>
                <Header headerTitle="Model Search" pageRoute="collections"/>
                <section className="min-h-[calc(100vh-177px)]">
                    <SearchPageContent />
                </section>
            </QueryContext.Provider>
        </>
    )
}