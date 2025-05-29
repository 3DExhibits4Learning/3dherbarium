/**
 * @file src/components/Search/SearchClient.tsx
 * 
 * @fileoverview search content client
 */

'use client'

// Typical imports
import { useState, createContext } from "react"

// Default imports
import Header from "../Header/Header"
import SearchPageContent from "./SearchPageContent"

// Exported context
export const QueryContext = createContext<any>('')

// Main JSX
export default function SearchClient() {

    // Query state for context
    const [query, setQuery] = useState<string>('')

    // Context for Header and SearchPageContent
    return <QueryContext.Provider value={{ query, setQuery }}>
        <Header headerTitle="Model Search" pageRoute="collections" />
        <section className="min-h-[calc(100vh-177px)]"><SearchPageContent /></section>
    </QueryContext.Provider>
}