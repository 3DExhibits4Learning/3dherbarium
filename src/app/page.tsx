'use client';
import Header from '@/components/Header/Header';
import Footer from '@/components/Shared/Foot';
import dynamic from 'next/dynamic';
import { useIsClient } from "@/utils/isClient";

const HomeModel = dynamic(() => import('@/components/Home/model'),
  { ssr: false });

export default function App() {

  const isClient: boolean = useIsClient();
  var screenSize: boolean = isClient ? window.matchMedia(("(max-width: 768px)")).matches : false;
  var txtSize: string = screenSize ? "1rem" : "1.4rem";
  var modelHeight = "calc(100vh - 177px)"

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <meta name="description" content="Cal Poly Humboldt 3D Digital Herbarium"></meta>
      <title>3D Digital Herbarium</title>
      <Header headerTitle='Home' pageRoute='collections' page="home" />
      <div className='flex flex-col h-auto w-full'>
        <div className='flex' style={{ height: modelHeight }}>
          <HomeModel />
        </div>
      </div>
      <Footer />
    </>
  );
}

