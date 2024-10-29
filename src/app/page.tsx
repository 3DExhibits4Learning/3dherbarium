import Header from '@/components/Header/Header';
import Footer from '@/components/Shared/Foot';
import dynamic from 'next/dynamic';
const HomeModel = dynamic(() => import('@/components/Home/model'), { ssr: false })
import HomePageClient from '@/components/Home/Client';
import { isMobileOrTablet } from '@/utils/isMobile';

export default function Page() {

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <meta name="description" content="Cal Poly Humboldt 3D Digital Herbarium"></meta>
      
      <title>3D Digital Herbarium</title>
      
      <Header headerTitle='Home' pageRoute='collections' page="home" />
      
      <div className='flex flex-col h-auto w-full'>
        
        <div className='flex h-[calc(100vh-177px)]'>
          <HomePageClient />
        </div>
      
      </div>
      
      <Footer />
    </>
  );
}

