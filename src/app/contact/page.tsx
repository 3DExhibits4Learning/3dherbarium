/**
 * @file /app/contact/page.tsx
 * @fileoverview contains information on how to contact Cyril and AJ :)
 */

import Header from '@/components/Header/Header'
import Footer from '@/components/Shared/Foot'

const Contribute = () => {
  return (
    <>
      <Header headerTitle="contribute" pageRoute="collections" />
      <div className="h-[calc(100vh-177px)] pl-8">
        <br></br>
        <p>Project Sponsor, Library Dean Cyril Oberlander: cyril.oberlander@humboldt.edu</p>
        <br></br>
        <p>Analyst, Programmer and Project Manager AJ Bealum: ab632@humboldt.edu</p>
      </div>
      <Footer />
    </>
  )
}
export default Contribute;