/**
 * @file /components/Map/Map.tsx
 * @fileoverview react leaflet map component implementation for nextJS.
 */

import dynamic from 'next/dynamic';
import { memo } from 'react';

const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false
});

const DEFAULT_WIDTH: string = '100%';
const DEFAULT_HEIGHT: string = '100%';
const MAX_HEIGHT: string = '';

const Map = (props: any) => {
  const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, maxHeight = MAX_HEIGHT } = props;
  const setIsLoading = props.setIsLoading;
  return (
    <div style={{ width, height, maxHeight }}>
      <DynamicMap {...props} setIsLoading={setIsLoading} />
    </div>
  )
}

export default memo(Map);
