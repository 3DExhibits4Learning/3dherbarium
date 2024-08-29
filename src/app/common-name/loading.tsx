/**
 * @file /app/common-name/loading.tsx
 * @fileoverview loading component for when users visit /common-name
 */

'use client';

import React from 'react';

import Header from '@/components/Header/Header';

import { Spinner } from "@nextui-org/react";
import Foot from '@/components/Shared/Foot';


const Loading = () => {
  return (
    <>
      <Header headerTitle="Common Name Search" pageRoute='inaturalist' />
      <div className="flex justify-center items-center" style={{ height: `calc(100vh - 64px - 112px)` }}>
        <Spinner label="Loading Common Name Results..." />
      </div>
      <Foot />
    </>
  )
};

export default Loading;