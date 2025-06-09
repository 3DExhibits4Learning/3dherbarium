/**
 * @file src/components/Search/LazyLoader.tsx
 * 
 * @fileoverview thumbnail lazy for model search
 */

// Typical imports
import { model } from '@prisma/client'
import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { fullUserSubmittal } from '@/ts/types'

// Lazy imports
const ThumbnailSection = lazy(() => import('./ThumbnailSection'))

// Main JSX
export default function LazyLoader(props: { filteredModels: (model | fullUserSubmittal)[] }) {
    
    // Declarations
    const [isVisible, setIsVisible] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const minHeight = props.filteredModels.length < 12 ? '200px' : '1200px' // Variable min height for last thumbnail section (which could have as little as one thumbnail)

    // Observation effect
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )
        
        // Observer div wrapper
        if (containerRef.current) observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    return <div ref={containerRef} style={{ minHeight: minHeight }}>{isVisible && <ThumbnailSection filteredModels={props.filteredModels} />}</div>
}