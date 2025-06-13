/**
 * @file src\app\loading.tsx
 * 
 * @fileoverview loading page for the home page
 */

'use client'

// Typical imports
import { Spinner } from "@heroui/react"

// Default imports
import Header from '@/components/Header/Header'
import Foot from '@/components/Shared/Foot'

// Main JSX
export default function LoadingComponent() {
  return <>
    <Header headerTitle="Home" pageRoute='collections' />
    <br />
    <div className="flex justify-center items-center h-[calc(100vh-201px)]">
      <Spinner label="Loading..." size='lg'/>
    </div>
    <Foot />
  </>
}