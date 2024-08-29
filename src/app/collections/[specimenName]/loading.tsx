/**
 * @file /app/collections/[specimenName]/loading.tsx
 * @fileoverview the loading component for when users visit /collections/[specimenName]
 */

import React from 'react';

import Header from '@/components/Header/Header';
import { Spinner } from "@nextui-org/react";
import Foot from '@/components/Shared/Foot';

const Loading = () => {
  return (
    <>
      <Header pageRoute="" headerTitle="Collections" />
      <div className="flex justify-center items-center h-[calc(100vh-176px)]">
        <Spinner label="Loading..." />
      </div>
      <Foot />
    </>
  )
}

export default Loading;