/**
 * @file src/components/Home/Client.tsx
 * 
 * @fileoverview home page client
 */
'use client'

// Typical imports
import { isMobileOrTablet } from '@/functions/client/utils/isMobile'
import { useRouter } from 'next/navigation'

// Default imports
import dynamic from 'next/dynamic'

// Dynamic imports
const HomeModel = dynamic(() => import('@/components/Home/model'), { ssr: false })

// Main JSX
export default function HomePageClient() {

    const router = useRouter()
    if (isMobileOrTablet()) router.push('/collections/search')

    return <HomeModel />
}