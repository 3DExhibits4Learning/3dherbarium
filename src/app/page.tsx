import Footer from '@/components/Shared/Foot';
import dynamic from 'next/dynamic';
const Header = dynamic(() => import('@/components/Header/Header'), { ssr: false })
const HomePageClient = dynamic(() => import('@/components/Home/Client'), { ssr: false })

export default function Page() {

  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
      <meta name="description" content="A digital herbarium featuring collections of annotated 3D models of plants, viewable in both augmented and virtual reality"></meta>
      
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

