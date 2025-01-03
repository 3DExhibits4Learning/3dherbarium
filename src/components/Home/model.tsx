'use client';
import Sketchfab from '@sketchfab/viewer-api';
import { useEffect, useState } from 'react';

export default function HomeModel() {
  var [rangeValue, setRangeValue] = useState<number>(300);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val: string = event.target.value;
    setRangeValue(parseInt(val));
  }

  const homeModel = () => {
    var iframe = document.getElementById('homeModel');
    var uid = '611560e2f07e436ca7eef747b77968ce';
    var client = new Sketchfab(iframe);

    client.init(uid, {
      success: function onSuccess(api: any) {
        api.start();
        api.addEventListener('viewerready', function () {
          api.getMaterialList(function (err: any, materials: any) {
            const xylem = materials[0]
            const phloem = materials[3]
            const bark = materials[1]
            const needles = materials[4]

            var slider = document.getElementById('opacitySlider');

            var setOpacity = function setOpacity(opacity: any, material: any) {
              material.channels.Opacity.enable = true;
              material.channels.Opacity.type = 'alphaBlend';
              material.channels.Opacity.factor = opacity;
              api.setMaterial(material, function () {
              });
            }

            if (slider) {
              var barkSection = document.getElementById('barkSection');
              var phloemSection = document.getElementById('phloemSection');
              var xylemSection = document.getElementById('xylemSection');

              slider.addEventListener("input", (event: any) => {

                const val = event.target?.value

                if (val > 200 && barkSection && phloemSection && xylemSection) {
                  const opacity = (val - 200) / 100;
                  setOpacity(1, xylem);
                  setOpacity(1, phloem);
                  setOpacity(opacity, bark);
                  setOpacity(opacity, needles);
                  barkSection.style.opacity = "" + opacity;
                  phloemSection.style.opacity = "" + (1 - opacity);
                  xylemSection.style.opacity = "0"
                }
                else if (val == 200 && barkSection && phloemSection && xylemSection) {
                  setOpacity(1, xylem);
                  setOpacity(1, phloem);
                  setOpacity(0, bark);
                  setOpacity(0, needles);
                  barkSection.style.opacity = "0";
                  phloemSection.style.opacity = "1";
                  xylemSection.style.opacity = "0";
                }
                else if (val < 200 && val > 100 && barkSection && phloemSection && xylemSection) {
                  const opacity = (val - 100) / 100;
                  setOpacity(1, xylem);
                  setOpacity(opacity, phloem);
                  setOpacity(0, bark);
                  setOpacity(0, needles);
                  barkSection.style.opacity = "0";
                  phloemSection.style.opacity = "" + opacity;
                  xylemSection.style.opacity = "" + (1 - opacity);
                }
                else if (val == 100 && barkSection && phloemSection && xylemSection) {
                  setOpacity(1, xylem);
                  setOpacity(0, phloem);
                  setOpacity(0, bark);
                  setOpacity(0, needles);
                  barkSection.style.opacity = "0";
                  phloemSection.style.opacity = "0";
                  xylemSection.style.opacity = "1"
                }
                else {
                  if (barkSection && phloemSection && xylemSection) {
                    const opacity = val / 100;
                    setOpacity(opacity, xylem);
                    setOpacity(0, phloem);
                    setOpacity(0, bark);
                    setOpacity(0, needles);
                    barkSection.style.opacity = "0";
                    phloemSection.style.opacity = "0";
                    xylemSection.style.opacity = "" + opacity;
                  }
                }
              })
            }
          });
        });
      },
      error: function onError() {
      },
      ui_stop: 0,
      ui_infos: 0,
      ui_inspector: 0,
      ui_settings: 0,
      ui_watermark: 0,
      ui_annotations: 0,
      ui_color: "004C46",
      ui_fadeout: 0
    })
  };

  useEffect(() => {
    homeModel()
  }, []);

  return (
    <>
      <iframe src="" frameBorder="0" id="homeModel" title={"Model Viewer for " + ''}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking="true"
        execution-while-out-of-viewport="true"
        execution-while-not-rendered="true" web-share="true"
        allowFullScreen
        style={{ transition: "width 1.5s", zIndex: "2" }}
        className='h-full w-full lg:w-3/5'
      />
      <div id='sliderDiv' className='hidden overflow-x-auto lg:flex flex-col w-2/5 h-full pr-[4] bg-black items-center pt-[1%] text-white overflow-y-auto' style={{ transition: "width 1.5s", zIndex: "1" }}>
        <p className='text-xl pb-8' >Welcome to the <span className='text-[#FFC72C]'>3D</span> Digital Herbarium</p>
        <p className='border-b border-solid pb-[2.5%]'>Check out our 3D Models on the Collections page, identify an unknown specimen with Plant.id or see what's new in the Feed. You can also see interior components of a pine tree below with our newest, experimental feature!</p><br></br>
        <div className='grid h-1/2 grid-cols-1 grid-rows-3 fade'>
          <div id='barkSection' className='height-[15%] w-full'>
            <p className='text-xl'><i>Pinus</i> (Pine)</p>
            Pinus is a genus of gymnosperms in the family Pinaceae. There are many living representatives of this genus in California and throughout the world.
          </div>
          <div id='phloemSection' className='height-[15%] w-full opacity-0'>
            <p className='text-xl'>Phloem (100x magnified)</p>
            In Pinus wood, we also have phloem cells that make up a portion of the vascular tissue that is located outside of the xylem.
          </div>
          <div id='xylemSection' className='height-[15%] w-full opacity-0'>
            <p className='text-xl'>Xylem (40x magnified)</p>
            In Pinus wood, there are specialized cells known as xylem which are responsible for transporting water and minerals throughout the plant body.
          </div>
        </div>
        <div className='w-full pt-[5%] text-center fade'>
        <input id='opacitySlider' type='range' min='0' max='300' step='1' value={rangeValue} onChange={handleValueChange}></input><br></br><br></br>
          <p>Annotated by: Heather Davis</p>
          <p>Model by: AJ Bealum</p>
        </div>
      </div>
    </>
  )
}