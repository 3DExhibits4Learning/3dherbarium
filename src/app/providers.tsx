'use client'

import { IsClientCtxProvider } from '@/functions/client/utils/isClient'
import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <IsClientCtxProvider>
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </IsClientCtxProvider>
}