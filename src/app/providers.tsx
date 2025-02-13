'use client'

import { IsClientCtxProvider } from '@/functions/client/utils/isClient'
import { NextUIProvider } from '@nextui-org/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IsClientCtxProvider>
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </IsClientCtxProvider>
  )
}