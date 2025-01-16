import { useEffect, useState } from "react";
import Group from "./assets/Group";
import { motion, AnimatePresence } from "framer-motion";
import dribbble from '../components/assets/dribbble.svg'
import facebookLong from '../components/assets/Facebook.svg'
import youtubeLong from '../components/assets/youtubeLong.svg'
import twitter from '../components/assets/twitter.svg'
import linkedin from '../components/assets/Linkedin.svg'
import pintrest from '../components/assets/Pintrest.svg'
import linkden from '../components/assets/linkden.svg'
import youtube from '../components/assets/youtube.svg'
import spotify from '../components/assets/Spotify.svg'
import medium from '../components/assets/Medium.svg'
import reddit from '../components/assets/Reddit.svg'
import patreon from '../components/assets/Patreon.svg'
import twitch from '../components/assets/twitch.svg'
import { Dialog, DialogPanel } from "@headlessui/react";
import pinterest from '../components/assets/pinterest.svg'
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
const platforms = [
  { name: "Twitter", icon: "🐦", image: twitter },
  { name: "Twitch", icon: "🤷‍♀️", image: twitch },
  { name: "Youtube", icon: "📘", image: youtube },
  { name: "LinkedIn", icon: "🔗", image: linkden },
  { name: "Pinterest", icon: "📸", image: pinterest },
  { name: 'Patreon', icon: '', image: patreon },
  { name: 'spotify', image: spotify },
  { name: 'medium', image: medium },
  { name: 'dh', image: reddit}
];

const images = [
  twitter,
  twitch,
  youtube,
  linkden,
  pintrest,
];


const Tabs = [
  'Storefronts',
  'Link-in-bios',
  'Workshops'
]

export default function LandingPage({ className = "" }) {

  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const generateRandomPositions = () => {
      const minDistanceFromCenter = 200; // Minimum distance from the center (to avoid images near the text)
      const newPositions = images.map(() => {
        let top, left;
        // Ensure images are placed away from the center
        do {
          top = Math.floor(Math.random() * window.innerHeight);
          left = Math.floor(Math.random() * window.innerWidth);
        } while (
          Math.abs(top - window.innerHeight / 2) < minDistanceFromCenter &&
          Math.abs(left - window.innerWidth / 2) < minDistanceFromCenter
        );
        return { top, left };
      });
      setPositions(newPositions);
    };

    generateRandomPositions();

    // Optionally, regenerate random positions on window resize
    window.addEventListener('resize', generateRandomPositions);
    return () => {
      window.removeEventListener('resize', generateRandomPositions);
    };
  }, []);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cycle through platforms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % platforms.length);
    }, 3000); // Changes platform every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const nextIndex = (currentIndex + 1) % platforms.length; // Get the next platform index

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div
      className={`font-general-sans self-stretch font-medium tracking-[0px] ${className}`}
    >
      <div class='lg:max-w-screen-lg lg:mx-auto mx-5 flex items-center justif0fy-center flex-col'>
      <div class="bg-gray-200 overflow-hidden z-10 bg-opacity-65 backdrop-blur-md md:w-full w-96 sm:max-w-xl fixed top-6 sm:left-1/2 sm:transform sm:-translate-x-1/2 mx-2 sm:mx-auto flex items-center justify-between rounded-full px-4 sm:px-6 p-4 overflow-x-auto">
      <div class='flex items-center gap-2'>
            <Group className='w-7 h-7' />
            <div class='font-["Semibold"]'>Commercify</div>
          </div>
          <div class='items-center gap-7 md:flex hidden font-["Semibold"] text-sm'>
            <a href='/pricing'>Pricing</a>
            <a href='/signin'>Login</a>
          </div>
          <div class='sm:flex md:hidden'>
            <Bars3Icon onClick={() => setMobileMenuOpen(true)} class='text-black h-5' />
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
              <div className="fixed inset-0 z-10" />
              <DialogPanel className="fixed inset-y-0 top-10 rounded-t-2xl flex flex-col justify-center items-center right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-between">
                  <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>

                  </a>
            
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6">
            

                      <a
                        href="#"
                        className="-mx-3 block rounded-lg px-3 py-2 text-center text-xl font-['Semibold'] text-gray-900 hover:bg-gray-50"
                      >
                        Plans
                      </a>

                      <a
                        href="#"
                        className="-mx-3 block rounded-lg px-3 py-2 text-center text-xl font-['Semibold'] text-gray-900 hover:bg-gray-50"
                      >
                        Socials
                      </a>
                    <div className="pb-3 flex flex-col gap-2">
                      <a
                        href="#"
                        className="-mx-3 block rounded-lg text-xl text-center px-3 py-2  font-['Semibold'] text-gray-900 hover:bg-gray-50"
                      >
                        Login
                      </a>
                      <a
                        href="#"
                        className="-mx-3 inline-block rounded-full text-white bg-black px-5 py-3 text-lg font-['Semibold']"
                      >
                        Get started with beta
                      </a>
                      <a
                        href="#"
                        className="-mx-3 inline-block rounded-full text-black bg-gray-100 text-center px-5 py-3 text-lg font-['Semibold']"
                      >
                        Close
                      </a>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </Dialog>
          </div>
        </div>
        <div class='w-full justify-center flex-col flex items-center mt-32 md:mt-36'>
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
                  className="absolute w-full h-full flex justify-center items-center rounded-xl z-1"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.8, ease: "backInOut" }}
                >
                  <img src={platforms[currentIndex].image} class='h-full bg-transparent w-full' />
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
          <div class='max-w-screen-xl mx-auto mt-10'>
            <div class='font-["Medium"] text-xs text-center text-gray-400'>Use to sale and grow on multiple platforms</div>
            <div class='max-w-screen-lg mx-auto mt-8 justify-center w-full flex flex-wrap items-center lg:gap-14 gap-5'>
              <img class='h-10' src={pintrest} />
              <img class='h-10' src={youtubeLong} />
              <img class='h-10' src={linkedin} />
              <img class='h-10' src={dribbble} />
              <img class='h-10' src={facebookLong} />
            </div>
          </div>
          <div class='my-10 max-w-screen-lg mx-auto w-full bg-black p-10 rounded-2xl'>
            <div class='bg-black h-96 rounded-2xl w-full'>

            </div>
          </div>
          <div className='h-96 relative w-full sm:flex md:hidden'>
            {/* Centered Text */}
            <div class="relative w-full h-full flex items-center justify-center">
              <img src={youtube} alt="Logo 1" class="absolute w-16 h-16 top-12 left-20 animate-float" />
              <img src={twitch} alt="Logo 2" class="absolute w-12 h-12 top-8 right-36 animate-float" />
              <img src={linkden} alt="Logo 3" class="absolute w-16 h-16 bottom-20 left-1/2 transform -translate-x-1/2 animate-float" />
              <img src={pinterest} alt="Logo 4" class="absolute w-16 h-16 bottom-12 left-16 animate-float" />
              <img src={twitter} alt="Logo 5" class="absolute w-14 h-14 bottom-12 right-16 animate-float" />
              <img src={patreon} alt="Logo 6" class="absolute w-16 h-16 bottom-32 left-2 animate-float"/>
                <img src={spotify} alt="Logo 7" class="absolute w-16 h-16 top-20 right-5 animate-float"/>
                <img src={medium} alt="Logo 8" class="absolute w-16 h-16 top-48 right-2 animate-float" />
                <img src={reddit} alt="Logo 3" class="absolute w-12 h-12 top-20 left-7 transform -translate-x-1/2 animate-float" />

                  <div class="text-center">
                    <h1 class="text-2xl font-['Semibold'] max-w-72 mb-4">Use Commercify with a variety of apps</h1>

                  </div>
                </div>
            </div>
            <div class='max-w-screen-lg mx-auto w-full rounded-2xl'>
              <div class='text-center font-["Semibold"] max-w-lg mx-auto text-4xl'>
                Design straightforward single-page layouts</div>
              <TabGroup className='flex flex-col justify-center items-center w-full'>
                <TabList class='inline-flex items-center justify-center bg-gray-200 mt-5 p-1 rounded-full space-x-2 '>
                  {Tabs.map((item) => (
                    <Tab
                      key={item}
                      className="rounded-full py-2 px-5 font-['Semibold'] text-xs md:text-sm text-gray-500 data-[selected]:text-black data-[selected]:bg-white data-[hover]:bg-white/5 outline-0 data-[focus]:outline-1 data-[focus]:outline-white"
                    >
                      {item}
                    </Tab>
                  ))}
                </TabList>
                <TabPanels className='mt-10 w-full'>
                  <TabPanel class='grid md:grid-cols-2 w-full gap-4'>
                    <div class='flex flex-col'>
                      <div class='h-96 bg-gray-100 w-full rounded-xl'>

                      </div>
                      <div class='mt-5'>
                        <div class='text-xl font-["Semibold"]'>Custom Branding</div>
                        <div class='font-["Medium"] text-gray-300'>Create a storefront that reflects your brand with customizable templates and design tools.</div>
                      </div>
                    </div>
                    <div class='flex flex-col'>
                      <div class='h-96 bg-gray-100 w-full rounded-xl'>

                      </div>
                      <div class='mt-5'>
                        <div class='text-xl font-["Semibold"]'>Sales Analytics</div>
                        <div class='font-["Medium"] text-gray-300'>Track your sales in real-time with integrated analytics.</div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel class='grid md:grid-cols-2 w-full gap-4'>
                    <div class='flex flex-col'>
                      <div class='h-96 bg-gray-100 w-full rounded-xl'>

                      </div>
                      <div class='mt-5'>
                        <div class='text-xl font-["Semibold"]'>Simple Link Management</div>
                        <div class='font-["Medium"] text-gray-300'>Easily organize and manage all your important links in one location for seamless access.</div>
                      </div>
                    </div>
                    <div class='flex flex-col'>
                      <div class='h-96 bg-gray-100 w-full rounded-xl'>

                      </div>
                      <div class='mt-5'>
                        <div class='text-xl font-["Semibold"]'>QR Generation</div>
                        <div class='font-["Medium"] text-gray-300'>Generate a QR code for your link page, perfect for offline marketing.</div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel class='grid md:grid-cols-2 w-full gap-4'>
                    <div class='flex flex-col'>
                      <div class='h-96 bg-gray-100 w-full rounded-xl'>

                      </div>
                      <div class='mt-5'>
                        <div class='text-xl font-["Semibold"]'>Payment Integration</div>
                        <div class='font-["Medium"] text-gray-300'>Connect various payment methods such as PayPal, Stripe, or credit cards to easily process payments.</div>
                      </div>
                    </div>
                    <div class='flex flex-col'>
                      <div class='h-96 bg-gray-100 w-full rounded-xl'>

                      </div>
                      <div class='mt-5'>
                        <div class='text-xl font-["Semibold"]'>Custom Payment Forms</div>
                        <div class='font-["Medium"] text-gray-300'>Create custom forms that suit your business needs, whether for donations, subscriptions, or one-time orders.</div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel class='grid md:grid-cols-2 w-full gap-4'>
                    <div class='flex flex-col'>
                      <div class='h-96 bg-gray-100 w-full rounded-xl'>
                      </div>
                      <div class='mt-5'>
                        <div class='text-xl font-["Semibold"]'>Event Scheduling</div>
                        <div class='font-["Medium"] text-gray-300'>Allow users to register for your events and receive personalized tickets.</div>
                      </div>
                    </div>
                    <div class='flex flex-col'>
                      <div class='h-96 bg-gray-100 w-full rounded-xl'>

                      </div>
                      <div class='mt-5'>
                        <div class='text-xl font-["Semibold"]'>Registrations & Tickets</div>
                        <div class='font-["Medium"] text-gray-300'>Allow users to register for your events and receive personalized tickets.</div>

                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
              <div class='text-center font-["Semibold"] max-w-lg mx-auto my-16 mt-10 md:mt-40 text-3xl md:text-5xl'>
                Use Commercify for its simplicity</div>
              <div class='grid md:grid-cols-3 w-full gap-8'>
                <div class='flex flex-col'>
                  <div class='h-72 bg-gray-100 w-full rounded-lg'>
                  </div>
                  <div class='mt-5'>
                    <div class='text-xl font-["Semibold"]'>Event Scheduling</div>
                    <div class='font-["Medium"] text-gray-300'>Allow users to register for your events and receive personalized tickets.</div>
                  </div>
                </div>
                <div class='flex flex-col'>
                  <div class='h-72 bg-gray-100 w-full rounded-lg'>

                  </div>
                  <div class='mt-5'>
                    <div class='text-xl font-["Semibold"]'>Registrations & Tickets</div>
                    <div class='font-["Medium"] text-gray-300'>Allow users to register for your events and receive personalized tickets.</div>

                  </div>
                </div>
                <div class='flex flex-col'>
                  <div class='h-72 bg-gray-100 w-full rounded-lg'>

                  </div>
                  <div class='mt-5'>
                    <div class='text-xl font-["Semibold"]'>Registrations & Tickets</div>
                    <div class='font-["Medium"] text-gray-300'>Allow users to register for your events and receive personalized tickets.</div>

                  </div>
                </div>
              </div>
            </div>
            <div class='text-center font-["Semibold"] max-w-lg mx-auto mt-40 text-3xl md:text-4xl'>
              Simplify the way your selling with commercify</div>
            <div class='text-gray-400 max-w-md mt-1 text-center font-["Medium"]'>Start using Commercify for free or upgrade to a plan for added features</div>
            <div class='w-full flex mt-4 items-center justify-center space-x-3'>
              <button class='px-4 py-3 text-xs text-white rounded-full bg-black font-["Semibold"]'>Join for free</button>
              <button class='px-4 py-3 text-xs text-black rounded-full border font-["Semibold"]'>See our plans</button>
            </div>
          </div>

        </div>
      </div>
      );
}
