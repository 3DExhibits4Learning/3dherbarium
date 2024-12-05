/**
 * @file src/components/Error/FullPageError.tsx
 * 
 * @fileoverview typical catch component for pages when critical data can't be obtained
 */
'use client'

// Imports
import dynamic from "next/dynamic"
import Foot from "../Shared/Foot"

// Dynamic imports
const Header = dynamic(() => import('@/components/Header/Header'))

/**
 * 
 * @param {Object} props - the props object
 * @param {string} props.errorMessage - the error message
 * @returns full page component with Header, Footer and client error message
 */
export default function FullPageError(props: { clientErrorMessage: string }) {
    return (
        <>
            <Header pageRoute="collections" headerTitle='Management' />
            <main className="flex flex-col !min-h-[calc(100vh-177px)]">
                {`Critical error: ${props.clientErrorMessage}`}
            </main>
            <Foot />
        </>
    )
}