/**
 * @file ObservationsMap.tsx
 * @fileoverview Client component which provides the Leaflet map. The map displays the GBIF and iNAT tiles for the specimen.
 */

'use client';

import Map from '@/components/Map';
import { TileLayer, LayersControl } from 'react-leaflet';

type CollectionsMapProps = {
  specimenName: string;
  gbifUsageKey: number | undefined;
}

const CollectionsMap: React.FC<CollectionsMapProps> = (props) => {

  const specimenName: string = props.specimenName || '';

  const gbifUsageKey: number | undefined = props.gbifUsageKey || 0;

  const iNatTileUrl: string = 'https://api.inaturalist.org/v1/points/{z}/{x}/{y}.png?has[]=photos&taxon_name=' + specimenName;
  const gbifTileUrl: string = 'https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@1x.png?taxonKey=' + gbifUsageKey + '&bin=hex&hexPerTile=30&style=classic-noborder.poly';

  const lightModeTiles: string = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
  const darkModeTiles: string = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
  const prefersDarkMode: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const tileUrl = prefersDarkMode ? darkModeTiles : lightModeTiles

  return (
    <>
      <div className='relative w-full h-full flex flex-col '>
        <div className="relative w-full h-full">
          <Map className='collections-map w-full h-full m-auto min-h-[100px]' center={[40, -95]} zoom={3} scrollWheelZoom={false}>
            {() => (
              <>
                <TileLayer
                  url={tileUrl}
                  attribution="Powered by <a href='https://www.esri.com/en-us/home' rel='noopener noreferrer'>Esri</a>"
                />
                <LayersControl position='topleft'>
                  <LayersControl.Overlay checked name={`<span style={{ fontFamily: 'Times, Times New Roman, serif', fontWeight: 'bold', fontSize: '110%' }}>GBIF</span>`}>
                    <TileLayer url={gbifTileUrl}
                      attribution="<a href='gbif.org' rel='noopener noreferrer'>gbif.org</a>" />
                  </LayersControl.Overlay>

                  <LayersControl.Overlay checked={false} name={`<span style={{ fontFamily: 'Times, Times New Roman, serif', fontWeight: 'bold', fontSize: '110%' }}>iNAT</span>`}>
                    <TileLayer url={iNatTileUrl}
                      attribution="<a href='iNaturalist.org' rel='noopener noreferrer'>iNaturalist.org</a>" />
                  </LayersControl.Overlay>
                </LayersControl>
              </>
            )}
          </Map>
        </div>
      </div>
    </>
  );
};

export default CollectionsMap;