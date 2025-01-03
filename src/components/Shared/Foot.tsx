import { Divider } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link';

function Foot() {
  return (
    <footer>
      
      {/***** Large screen footer *****/}
      
      <section className='w-full h-28 bg-[#004C46] dark:bg-[#212121] flex-col hidden md:flex'>

        {/* Top part of the footer (above the divider) */}
        <section className="w-full h-3/5 flex justify-between">

          {/* Logos in lower left hand corner*/}
          <section className='flex'>

            {/* IMLS Logo*/}
            <section className='ml-8'>
              <Link href="https://www.imls.gov/" rel="noopener" target="_blank">
                <div className="h-full relative w-[164px]">
                  <Image src="/imls_logo_white.svg" alt='IMLS Logo' fill />
                </div>
              </Link>
            </section>

            {/* CPH Logo*/}
            <section className="ml-8 mt-6">
              <Link href="https://humboldt.edu" rel="noopener" target="_blank">
                <div className="h-8 relative w-[164px] bottom-[5px]">
                  <Image src="/humSvg.svg" alt='Cal Poly Humboldt Logo' fill />
                </div>
              </Link>
            </section>

          </section>

          {/* Links in lower right hand corner on large screens */}
          <section className="text-white flex mx-8 justify-around items-center mt-5">
            <p className='mx-4'><Link href="/about">About</Link></p>
            <p className='mx-4'><Link href="/contribute">Contribute</Link></p>
            <p className='mx-4'><Link href="/licensing">License</Link></p>
            <p className='ml-4'><Link href="/contact">Contact</Link></p>
          </section>

        </section>

        {/* Lower footer div (with divider and copyright) */}
        <div className='flex w-full justify-center'>
          <Divider className='bg-white w-[calc(100%-64px)]' />
        </div>

        {/*Copyright*/}
        <p className='text-white text-center mt-2'>&#169; 2025 Cal Poly Humboldt Library</p>

      </section>

      {/***** small-medium screen footer *****/}
      
      <section className='w-full h-fit bg-[#004C46] dark:bg-[#212121] flex flex-col md:hidden justify-center items-center'>

        {/*Logos AND Links*/}
        <section className='flex flex-col w-full'>

          {/*Logos*/}
          <div className='w-full flex justify-between my-4'>

            {/* IMLS Logo*/}
            <section className='h-16 w-1/2'>
              <Link href="https://www.imls.gov/" rel="noopener" target="_blank">
                <div className="h-full relative w-full">
                  <Image src="/imls_logo_white.svg" alt='IMLS Logo' fill />
                </div>
              </Link>
            </section>

            {/* CPH Logo*/}
            <div className="flex items-center w-1/2">
              <div className="h-8 w-full relative">
                <Image src="/humSvg.svg" alt='Cal Poly Humboldt Logo' fill />
              </div>
            </div>

          </div>

          {/* Links */}
          <div className="text-white flex justify-between mx-2">
            <p className='mx-2 text-center'><Link href="/about">About</Link></p>
            <p className='mx-2 text-center'><Link href="/contribute">Contribute</Link></p>
            <p className='mx-2 text-center'><Link href="/licensing">License</Link></p>
            <p className='mx-2 text-center'><Link href="/contact">Contact</Link></p>
          </div>

        </section>

        {/*Divider*/}
        <div className='flex w-full justify-center'>
          <Divider className='bg-white w-full mt-2' />
        </div>

        {/*Copyright*/}
        <p className='text-white text-center mt-2'>&#169; 2025 Cal Poly Humboldt Library</p>

      </section>

    </footer>
  )
}

export default Foot;