'use client'

import { CollectionsWrapperProps } from '@/ts/collections'
import dynamic from 'next/dynamic'
const CollectionsWrapper = dynamic(() => import('@/components/Collections/CollectionsWrapper/CollectionsWrapper'), { ssr: false })

export default function CollectionsClient(props: CollectionsWrapperProps) { return <CollectionsWrapper {...props} /> }