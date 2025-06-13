/**
 * @file src/app/page.tsx
 * 
 * @fileoverview home page server component
 */

// Default imports
import dynamic from 'next/dynamic'

// Dynamic imports
const HomePageClient = dynamic(() => import('@/components/Home/Client'))

// Main JSX
export default async function Page() {

  return <>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1"></meta>
    <meta name="description" content="A digital herbarium featuring collections of annotated 3D models of plants, viewable in both augmented and virtual reality"></meta>

    <title>3D Digital Herbarium</title>

    <section className='h-[100vh]'>
        <HomePageClient />
    </section>
  </>
}

