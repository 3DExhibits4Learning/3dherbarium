/**
 * @file /app/about/page.tsx
 * 
 * @fileoverview the About page containing a video from the Cal Poly Humboldt Youtube video,
 * a non-flora model, and paragraphical information about the project.
 */

// Default imports
import Header from '@/components/Header/Header'
import Foot from '@/components/Shared/Foot'

// Main component
const About = async () => <>

  <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1'></meta>
  <title>3D Herbarium About</title>

  <Header pageRoute='collections' headerTitle='About' />

  <h1 className='text-2xl dark:text-white xl:ml-[12.5%] my-5 font-medium text-center xl:text-left'>About the 3D Digital Herbarium</h1>

  <article className='flex flex-col w-full'>

    <section className='flex flex-col xl:flex-row xl:w-[75%] w-full items-center justify-between m-auto xl:mb-12'>

      <section id='humboldt-now-video' className='flex flex-col justify-center items-center rounded h-[75vh] w-full max-h-[900px] xl:mr-20'>
        <div className='w-full h-full rounded'>
          <iframe className='w-full h-full rounded' src='https://www.youtube.com/embed/kUW6duHD2e8?si=n7gDhKkDOyMdbGac&autoplay=1&mute=1' title='YouTube video player' frameBorder='0' allowFullScreen></iframe>
        </div>
        <cite className='italic text-center mt-2 text-black dark:text-white z-10'>Source: <span className='text-[#004C46] dark:text-[#C3D5D1]'><a href='https://www.youtube.com/@CalPolyHumboldt' target='_blank' rel='noopener noreferrer'>@CalPolyHumboldt</a></span> on YouTube</cite>
      </section>

      <section className='flex justify-center h-[400px] w-full max-w-[400px] my-12 xl:my-0'>
        <img className='object-fill rounded' src='/emergingTechAward.png' alt='ALA RUSA Best Emerging Tech Award 2024'></img>
      </section>

    </section>

    <section className='flex items-center pb-10 text-lg dark:text-white w-[90%] sm:w-[75%] m-auto'>
      <p>
        The 3D Digital Herbarium is an innovative educational platform created by the Cal Poly Humboldt
        Library dedicated to bringing the intricate world of botany to life through state-of-the-art 3D modeling.
        At the heart of our mission is the desire to transform how students learn about flora, transcending traditional boundaries by offering an immersive,
        interactive experience. Our 3D Digital Herbarium is a unique resource, meticulously designed for botany students and enthusiasts alike.
        It features a diverse collection of flora, each represented in stunning three-dimensional detail.
        These models offer an unparalleled opportunity to study and appreciate the intricate structures and characteristics of various plant species,
        providing a level of detail that far surpasses what&apos;s available in textbooks or two-dimensional images.
      </p>
    </section>

    <section className='flex items-center text-lg pb-10 dark:text-white w-[90%] sm:w-[75%] m-auto'>
      <p>
        The Library 3D digital herbarium came about through a collaboration with a computer science student&apos;s capstone project and the Cal Poly Humboldt library.
        After undertaking a project involving plants, they began hiring botany student assistants to help.
      </p>
    </section>

    <section className='flex items-center text-lg dark:text-white w-[90%] sm:w-[75%] m-auto'>
      <p>Beyond merely viewing, our platform allows users to interact with these models, rotating and examining plants from every angle.
        This hands-on approach facilitates a deeper understanding of plant morphology and taxonomy, making it an invaluable tool for education and research.
        Looking towards the future, our vision extends beyond botany.
        We plan to evolve the Cal Poly Humboldt 3D Digital Herbarium into a general comprehensive 3D learning platform.
        This expansion will encompass an array of subjects, offering 3D models that cater to a wide spectrum of academic fields and interests.
        Find below a 3D model of a mushroom.
      </p>
    </section>

    <section className='text-lg'>
      <section id='basket-model' className='flex flex-col justify-center items-center rounded h-[75vh] w-[100%] max-h-[900px]'>
        <div className='w-[95%] sm:w-[75%] h-[85%] rounded'>
          <iframe className='w-full h-full rounded' title="Mushroom" frameBorder="0" allow="autoplay; fullscreen; xr-spatial-tracking" src="https://sketchfab.com/models/34d0564f4d664fc1afa982975662ce5c/embed"> </iframe>
        </div>
      </section>
    </section>

    <section className='flex items-center text-lg dark:text-white w-[90%] sm:w-[75%] m-auto pb-10'>
      <p>Join us in exploring this new dimension of learning, where curiosity meets innovation, fostering a deeper appreciation and understanding of the natural and designed world!</p>
    </section>

    <section className='flex-col items-center text-lg dark:text-white w-[90%] sm:w-[75%] m-auto pb-10'>
      <p>This work was supported in part by NSF awards OAC-2346701, CNS-1730158, ACI-1540112, ACI-1541349, OAC-1826967, OAC-2112167, CNS-2120019,
        the University of California Office of the President, and the University of California San Diego’s California Institute for Telecommunications and Information Technology/Qualcomm Institute.
      </p>
      <br></br>
      <p>This work used resources available through the National Research Platform (NRP) at the
        University of California, San Diego. NRP has been developed, and is supported in part, by funding
        from National Science Foundation, from awards 1730158, 1540112, 1541349, 1826967,
        2112167, 2100237, and 2120019, as well as additional funding from community partners
      </p>
      <br></br>
      <p>We thank the High Performance Computing Center team at Cal Poly Humboldt, especially Ravi Chalasani, Brian Campbell and John Gerving for their support with NRP installation and application.</p>
    </section>

  </article>

  <Foot />
</>

// Export
export default About