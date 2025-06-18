/**
 * @file isClient.tsx
 * @fileoverview removes hydration errors (and window not defined errors) by making a context that 
 * sets a boolean using useEffect, telling us we are safe to execute client code. 
 */

'use client'

import { createContext, useContext, useEffect, useState } from "react";

const IsClientContext = createContext(false)

export const IsClientCtxProvider = ({ children }: any) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return (
    <IsClientContext.Provider value={isClient}>{children}</IsClientContext.Provider>
  );
};

export function useIsClient() {
  return useContext(IsClientContext);
}