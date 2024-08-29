'use client';
import React from 'react';
import Header from '@/components/Header/Header';
import { Spinner } from "@nextui-org/react";
import Foot from '@/components/Shared/Foot';

const Loading = () => {
  return (
    <>
      <Header headerTitle="Home" pageRoute='inaturalist' />
      <br />
      <div className="flex justify-center items-center min-h-[calc(100vh-192px)]">
        <Spinner label="Loading..." />
      </div>
      <Foot />
    </>
  )
};

export default Loading;