import { useEffect, useState } from "react";
import Group from "./assets/Group";
import { motion, AnimatePresence } from "framer-motion";
import instagram from '../components/assets/instagram.svg'
import twitter from '../components/assets/twitter.svg'
import linkden from '../components/assets/linkden.svg'
import youtube from '../components/assets/youtube.svg'
import { Bars3Icon } from "@heroicons/react/20/solid";
const platforms = [
  { name: "Twitter", icon: "🐦", image:  twitter},
  { name: "Youtube", icon: "📘" , image: youtube },
  { name: "Instagram", icon: "📸", image:  instagram},
  { name: "LinkedIn", icon: "🔗", image: linkden},
];

export default function LandingPage({ className = "" }) {

  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle through platforms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % platforms.length);
    }, 3000); // Changes platform every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const nextIndex = (currentIndex + 1) % platforms.length; // Get the next platform index


  return (
    <div
      className={`font-general-sans w-full bg-white font-medium tracking-[0px] ${className}`}
    >
      <div class='lg:max-w-screen-lg lg:mx-auto mx-5 self-stretch'>
        <div class='bg-gray-100 max-w-xl flex items-center justify-between  mx-auto mt-6 rounded-full px-6 p-4'>
          <div class='flex items-center gap-2'>
            <Group className='w-7 h-7' />
            <div class='font-["Semibold"]'>Commercify</div>
          </div>
          <div class='items-center gap-7 md:flex hidden font-["Semibold"] text-sm'>
            <div>Pricing</div>
            <div>Login</div>
          </div>
          <div class='sm:flex md:hidden'>
            <Bars3Icon class='text-black h-5' />
          </div>
        </div>
        <div class='w-full justify-center flex-col flex items-center mt-12 md:mt-20'>
          <div class='flex justify-center items-center'>
            <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-2xl">
              {/* Back File: Hovering Grey Box Representing "Up Next" */}
              <div
                className="absolute top-[-15px] left-3 w-[calc(100%-27px)] h-[calc(100%-27px)] bg-gray-300 rounded-2xl z-0 shadow-lg"
              >
             
              </div>

              {/* Current File: Platform Being Animated */}
              <AnimatePresence>
                <motion.div
                  key={platforms[currentIndex].name}
                  className="absolute w-full h-full flex justify-center items-center rounded-xl z-10"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <img src={platforms[currentIndex].image} class='h-full bg-transparent w-full'/>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div class='md:text-7xl text-4xl text-center mt-5 md:mt-6 md:mx-auto md:max-w-4xl font-["Semibold"]'>
            Simplifying E-commerce one page at a time.
          </div>
          <div class='text-gray-400 mt-6 text-md lg:text-xl font-["Medium"] max-w-3xl text-center mx-auto'>
            Create and scale your brand, business, and platforms featuring forms, workshops, storefronts, link-in-bios, and much more.
          </div>
          <div class='w-full flex mt-6 items-center justify-center space-x-3'>
            <button class='px-4 py-3 text-sm text-white rounded-full bg-black font-["Semibold"]'>Join for free</button>
            <button class='px-4 py-3 text-sm text-black rounded-full border font-["Semibold"]'>See our plans</button>
          </div>
          <div class='max-w-screen-lg mx-auto mt-10'>
               <div class='font-["Medium"] text-xs text-gray-400'>Use to sale and grow on multiple platforms</div>
        </div>
        </div>
       
      </div>
    </div>
  );
}
