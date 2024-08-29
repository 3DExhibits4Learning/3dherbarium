/**
 * @file /app/plantid/loading.tsx
 * @fileoverview loading component for when users visit /plantid
 */

'use client';

import React from 'react';

import SearchHeader from '@/components/Header/Header';

import { Spinner } from "@nextui-org/react";


const Loading = () => {
  return (
    <>
      {/* <SearchHeader headerTitle="iNaturalist" pageRoute='inaturalist' /> */}
      <br />
      <div className="flex justify-center items-center" style={{ height: `calc(100vh - 64px)` }}>
        <Spinner label="Loading PlantID Page..."/>
      </div>
    </>
  )
};

export default Loading;