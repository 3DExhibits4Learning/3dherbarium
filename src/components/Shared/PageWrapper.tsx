/**
 * @file /components/Shared/PageWrapper.tsx
 * @fileoverview general wrapper for the site; used to control how pages scale when zooming in and out.
 */

'use client';

import { useIsClient } from '@/functions/client/utils/isClient';
import { useState, useEffect } from 'react';


type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {

  const isClient = useIsClient();

  const [viewWidthInPx, setViewWidthInPx] = useState<number>(0);

  const updateDimensions = (): void => {
    if (!isClient) return;
    setViewWidthInPx(window.outerWidth);
  };

  useEffect(() => {
    if (isClient) {
      window.addEventListener('resize', updateDimensions);
      setViewWidthInPx(window.outerWidth);

      return () => {
        window.removeEventListener('resize', updateDimensions);
      };
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const wrapperStyle: React.CSSProperties | undefined = {
    width: '100vw',
    maxWidth: viewWidthInPx,
    margin: '0 auto',
  };

  if (isClient) {
    return (
      <div className='flex flex-col m-auto' style={wrapperStyle}>
        {children}
      </div>
    );
  }
  return <></>;
};

export default PageWrapper;