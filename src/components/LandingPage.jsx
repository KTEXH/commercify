import { useEffect, useRef, useState } from "react";
import Group from "./assets/Group";
import Groop3 from './assets/Group3'
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
import introducing from '../components/assets/introducing.mp4'
import medium from '../components/assets/Medium.svg'
import yelp from '../components/assets/Yelp.svg'
import zoom from '../components/assets/Zoom.svg'
import behance from '../components/assets/Behance.svg'
import dribble from '../components/assets/Dribble.svg'
import googlemeet from '../components/assets/GoogleMeets.svg'
import dropbox from '../components/assets/Dropbox.svg'
import truth from '../components/assets/TruthSocial.svg'
import notion from '../components/assets/Notion.svg'
import github from '../components/assets/GitHub.svg'
import reddit from '../components/assets/Reddit.svg'
import patreon from '../components/assets/Patreon.svg'
import twitch from '../components/assets/twitch.svg'
import { Dialog, DialogPanel } from "@headlessui/react";
import pinterest from '../components/assets/pinterest.svg'
import { ArrowRightIcon, Bars3Icon, PlayIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Group3 from "./assets/Group3";
import { Header } from "./LandingHeader";
const platforms = [
  { name: "Twitter", icon: "🐦", image: twitter },
  { name: "Twitch", icon: "🤷‍♀️", image: twitch },
  { name: "Youtube", icon: "📘", image: youtube },
  { name: "LinkedIn", icon: "🔗", image: linkden },
  { name: "Pinterest", icon: "📸", image: pinterest },
  { name: 'Patreon', icon: '', image: patreon },
  { name: 'spotify', image: spotify },
  { name: 'medium', image: medium },
  { name: 'dh', image: reddit }
];

function shuffleArray(array) {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}
const images1 = shuffleArray([
  { name: 'Twitch', image: twitch },
  { name: 'Pinterest', image: pinterest },
  { name: 'Reddit', image: reddit },
  { name: 'Medium', image: medium },
  { name: 'Patreon', image: patreon },
  { name: 'Spotify', image: spotify },
  { name: 'Github', image: github },
  { name: 'LinkedIn', image: linkden },
  { name: 'Zoom', image: zoom },
  { name: 'Truth', image: truth },
  { name: 'Yelp', image: yelp },
  { name: 'Google Meets', image: googlemeet },
]);

const images2 = shuffleArray([
  { name: 'Dribble', image: dribble },
  { name: 'Notion', image: notion },
  { name: 'Dropbox', image: dropbox },
  { name: 'Behance', image: behance },
  { name: 'Spotify', image: spotify },
  { name: 'Github', image: github },
  { name: 'Patreon', image: patreon },
  { name: 'Medium', image: medium },
  { name: 'Reddit', image: reddit },
  { name: 'Pinterest', image: pinterest },
  { name: 'Twitch', image: twitch },
]);

const images3 = shuffleArray([
  { name: 'Google Meets', image: googlemeet },
  { name: 'Yelp', image: yelp },
  { name: 'Truth', image: truth },
  { name: 'Zoom', image: zoom },
  { name: 'LinkedIn', image: linkden },
  { name: 'Github', image: github },
  { name: 'Spotify', image: spotify },
  { name: 'Patreon', image: patreon },
  { name: 'Medium', image: medium },
  { name: 'Reddit', image: reddit },
  { name: 'Pinterest', image: pinterest },
  { name: 'Twitch', image: twitch },
]);





const Tabs = [
  'Storefronts',
  'Link-in-bios',
  'Workshops'
]

export default function LandingPage({ className = "", duration = 3000 }) {


  const [positions, setPositions] = useState([]);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

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
        <Header />
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
          <div className="md:my-10 my-16 max-w-screen-lg py-5 space-y-5 relative h-[300px] overflow-hidden mx-auto w-full border rounded-2xl">
            {/* Video Container */}
            <div className="relative h-full">
              <video
                ref={videoRef}
                onClick={handlePlayPause}
                className="w-full h-full object-cover rounded-2xl"
                src={introducing} // Pass the video source as a prop
              />
              {!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold rounded-lg transition-opacity duration-300 hover:opacity-75"
                >
                  <div class='bg-black h-14 justify-center flex items-center rounded-full w-14'>
                       <PlayIcon class='w-5 h-5 text-white' />
                  </div>
                </button>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="absolute bg-white bottom-0 h-12 px-3 flex justify-between items-center border-t w-full">
              <div className="font-semibold text-sm">Start Growing Today</div>
              <div className="rounded-full flex gap-2 items-center p-2 text-white border">
                <ArrowRightIcon className="h-4 w-4 text-black" />
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

            <div className='h-[700px] relative w-full my-7 sm:flex md:hidden'>
              {/* Centered Text */}
              <div class="relative w-full h-full flex items-center justify-center">
                <img src={youtube} alt="Logo 1" class="absolute w-16 h-16 top-2 left-20 animate-float" />
                <img src={twitch} alt="Logo 2" class="absolute w-12 h-12 top-5 right-36 animate-float" />
                <img src={linkden} alt="Logo 3" class="absolute w-16 h-16 bottom-32 right-28 transform -translate-x-1/2 animate-float" />
                <img src={pinterest} alt="Logo 4" class="absolute w-12 h-12 bottom-12 left-32 animate-float" />
                <img src={twitter} alt="Logo 5" class="absolute w-14 h-14 bottom-8 right-16 animate-float" />
                <img src={patreon} alt="Logo 6" class="absolute w-16 h-16 bottom-60 left-8 animate-float" />
                <img src={spotify} alt="Logo 7" class="absolute w-16 h-16 top-28 right-5 animate-float" />
                <img src={medium} alt="Logo 8" class="absolute w-16 h-16 top-52 right-2 animate-float" />
                <img src={reddit} alt="Logo 3" class="absolute w-12 h-12 top-28 left-7 transform -translate-x-1/2 animate-float" />
                <img src={truth} alt="Logo 6" class="absolute w-16 h-16 bottom-28 left-4 animate-float" />
                <img src={github} alt="Logo 7" class="absolute w-12 h-12 top-28 right-36 animate-float" />
                <img src={googlemeet} alt="Logo 8" class="absolute w-16 h-16 top-40 left-28 animate-float" />
                <img src={yelp} alt="Logo 3" class="absolute w-12 h-12 bottom-64 right-10 transform -translate-x-1/2 animate-float" />
                <img src={zoom} alt="Logo 8" class="absolute w-12 h-12 top-60 left-2 animate-float" />

                <div class="text-center">
                  <h1 class="text-3xl font-['Semibold'] max-w-72 mb-4">Use Commercify with a variety of apps</h1>

                </div>
              </div>
            </div>
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
      <div class='my-20 flex flex-col w-full space-y-4'>
        <div className="relative w-full overflow-hidden">
          <div
            className="flex w-max md:gap-12 gap-4 animate-float"
            style={{
              animationDuration: `165s`, // Control speed
            }}
          >
            {/* Repeat the array to ensure infinite loop */}
            {[...images1, ...images1].map((image, index) => (
              <div key={index} className="flex items-center gap-2">
                <img src={image.image} alt={image.name} className="md:w-16 md:h-16 w-12 h-12" />
                <div className="text-2xl font-['Semibold']">{image.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <div
            className="flex w-max md:gap-12 gap-4 animate-float"
            style={{
              animationDuration: `165s`, // Control speed
            }}
          >
            {/* Repeat the array to ensure infinite loop */}
            {[...images2, ...images2].map((image, index) => (
              <div key={index} className="flex items-center gap-2">
                <img src={image.image} alt={image.name} className="md:w-16 md:h-16 w-12 h-12" />
                <div className="text-2xl font-['Semibold']">{image.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <div
            className="flex w-max md:gap-12 gap-4 animate-float"
            style={{
              animationDuration: `165s`, // Control speed
            }}
          >
            {/* Repeat the array to ensure infinite loop */}
            {[...images3, ...images3].map((image, index) => (
              <div key={index} className="flex items-center gap-2">
                <img src={image.image} alt={image.name} className="md:w-16 md:h-16 w-12 h-12" />
                <div className="text-2xl font-['Semibold']">{image.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <div
            className="flex w-max md:gap-12 gap-4 animate-float"
            style={{
              animationDuration: `165s`, // Control speed
            }}
          >
            {/* Repeat the array to ensure infinite loop */}
            {[...images1, ...images1].map((image, index) => (
              <div key={index} className="flex items-center gap-2">
                <img src={image.image} alt={image.name} className="md:w-16 md:h-16 w-12 h-12" />
                <div className="text-2xl font-['Semibold']">{image.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div class="relative">
        <div class="absolute h-20 w-full bg-white rounded-b-[50px] z-10"></div>
        <img src='/Browser.svg' />
        <div class="bg-black relative h-96 w-full z-0">
          <div class='flex items-center w-full justify-between p-8'>
            <div class='mt-16'>
              <Group3 />
              <div clas>
                <div class='text-lg font-["Semibold"] text-white'>Commercify HQ</div>

              </div>
            </div>
            <div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
