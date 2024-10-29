'use client'

import dynamic from 'next/dynamic';
const HomeModel = dynamic(() => import('@/components/Home/model'), { ssr: false })
import { isMobileOrTablet } from '@/utils/isMobile';
import { useRouter } from 'next/navigation';

export default function HomePageClient() {

    const router = useRouter()
    if (isMobileOrTablet()) router.push('/collections/search')

    return (<HomeModel />)
}