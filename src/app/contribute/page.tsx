/**
 * @file /app/contribute/page.tsx
 * @fileoverview page containing information on how to contribute to the 3D Digital Herbarium project.
 */

import Header from '@/components/Header/Header'
import Footer from '@/components/Shared/Foot'

const Contribute = () => {
  return (
    <>
      <Header headerTitle="contribute" pageRoute="collections" />
      <div className="h-[calc(100vh-177px)] pl-8">
        <br></br>
        <p>Thank you for considering contribution!</p>
        <br></br>
        <p>For financial contributions, click <a href='https://www.justgiving.com/campaign/3dherbarium2024' target='_blank'><u>here</u></a></p>
        <br></br>
        <p>For code contributions, check out our <a href='https://github.com/CPH3DH/3dHerbarium' target='_blank'><u>github</u></a></p>
      </div>
      <Footer />
    </>
  )
}
export default Contribute;