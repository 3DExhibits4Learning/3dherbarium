/**
 * @file /app/collections/search/loading.tsx
 * @fileoverview the loading component for when users visit /collections/search
 */

import Header from '@/components/Header/Header'
import { Spinner } from "@nextui-org/react"
import Foot from '@/components/Shared/Foot'


const Loading = () => {
  return (
    <>
      <Header headerTitle="Model Search" pageRoute='collections' />
      <div className="flex justify-center items-center h-[calc(100vh-176px)] w-full">
        <Spinner label="Loading..." />
      </div>
      <Foot />
    </>
  )
};

export default Loading;