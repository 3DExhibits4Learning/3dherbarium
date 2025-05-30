'use client'

// Typical imports
import { forwardRef, lazy, Suspense } from "react"

// Lazy imports
const BotanistModelViewer = lazy(() => import("./BotanistModelViewer"))

// Main JSX
const BotanistRefWrapper = forwardRef((props: any, ref: any) => {
    return <Suspense fallback={<div>Loading...</div>}><BotanistModelViewer {...props} ref={ref} /></Suspense>
})

// Export & display name
BotanistRefWrapper.displayName = 'BotanistRefWrapper'
export default BotanistRefWrapper