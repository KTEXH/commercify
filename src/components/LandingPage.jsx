import { useEffect, useRef, useState } from "react";
import Group from "./assets/Group";
import Groop3 from './assets/Group3'
import { motion, AnimatePresence } from "framer-motion";
import dribbble from '../components/assets/dribbble.svg'
import files from '../components/assets/file.svg'
import facebookLong from '../components/assets/Facebook.svg'
import youtubeLong from '../components/assets/youtubeLong.svg'
import lll from '../components/assets/lll.svg'
import twitter from '../components/assets/twitter.svg'
import example3 from '../components/assets/lpd.svg'
import ghg from '../components/assets/ghg.svg'
import mai from '../components/assets/mail.svg'
import ColorPicker from '../components/assets/ColorPicker.svg'
import lpsd from '../components/assets/hvf.svg'
import vv from '../components/assets/VV.svg'
import exa from '../components/assets/FloatingSheet.svg'
import more from '../components/assets/plgg.svg'
import linkedin from '../components/assets/Linkedin.svg'
import DatePicker from '../components/assets/DatePicker.svg'
import pintrest from '../components/assets/Pintrest.svg'
import linkden from '../components/assets/linkden.svg'
import jn from '../components/assets/jn.svg'
import youtube from '../components/assets/youtube.svg'
import spotify from '../components/assets/Spotify.svg'
import introducing from '../components/assets/ad.mp4'
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
import { ArrowRightIcon, Bars3Icon, CursorArrowRaysIcon, PlayIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Group3 from "./assets/Group3";
import { Header } from "./LandingHeader";
import { RiCursorFill } from "@remixicon/react";
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
      <div class='lg:max-w-screen-lg lg:mx-auto mx-5 flex items-center justify-center flex-col'>
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
            <a href='/beta' class='px-4 py-3 text-sm text-white rounded-full bg-black font-["Semibold"]'>Join for free</a>
            <a href='/pricing' class='px-4 py-3 text-sm text-black rounded-full border font-["Semibold"]'>See our plans</a>
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
          <div class='mt-20 w-full flex flex-col justify-center items-center mb-7'>
            <div class='w-9 flex items-center justify-center h-9 rounded-full bg-black mb-5'>
                 <CursorArrowRaysIcon class='text-white w-5 h-5' />
            </div>
            <div class='font-["Semibold"] text-center md:w-[600px] md:text-3xl text-xl  mb-2'>Unlock the Power of Simple, All-in-One Solutions for Your Business</div>
            <div class='font-["Medium"] text-center text-gray-400   md:w-[700px]'>Streamline your online presence with Commercify’s easy-to-use tools—perfect for storefronts, links, forms, and payments.</div>
          </div>
          <div className="mb-10 mt-7 max-w-screen-lg  grid md:grid-cols-3 md:gap-5 gap-12 mx-5">
            <div class='border relative rounded-xl w-full'>
              <div class='absolute top-[-20px] left-[-15px] overflow-hidden font-["Semibold"] z-50 border text-xs bg-white rounded-lg p-2'>Digital Storefront</div>
              <div class='w-full h-48 bg-gradient-to-b flex justify-center items-center from-gray-100 to-transparent rounded-t-lg'>
                <img src={more} class='h-32' />
              </div>
              <div class='p-6 px-8'>
                <div class='font-["Semibold"]'>Digital Storefronts - create storefronts with ease</div>
                <div class='text-gray-400 font-["Medium"] mt-2 mb-5'>Create a fully customizable online store in minutes with easy setup, seamless design, and optimized sales features.</div>
                <a href='/beta' class='bg-black rounded-full px-3 py-2 text-sm font-["Semibold"] text-white'>Get started with storefronts</a>
              </div>
            </div>
            <div class='border relative  rounded-xl w-full'>
              <div class='absolute top-[-20px] left-[-15px] overflow-hidden font-["Semibold"] z-50 border text-xs bg-white rounded-lg p-2'>Lin-in-bios</div>
              <div class='w-full h-48 bg-gradient-to-b flex items-center justify-center from-gray-100 to-transparent rounded-t-lg'>
                <img src={exa} class='h-36' />
              </div>
              <div class='p-6 px-8'>
                <div class='font-["Semibold"]'>Link-in-bios - link management never been easier</div>
                <div class='text-gray-400 font-["Medium"] mt-2 mb-5'>Boost engagement by linking everything in one place—socials, store, and content. Customizable and mobile-friendly.</div>
                <a href='/beta' class='bg-black rounded-full px-3 py-2 text-sm font-["Semibold"] text-white'>Get started with link-in-bios</a>

              </div>
            </div>
            <div class='border relative rounded-xl w-full'>
              <div class='absolute top-[-20px] left-[-15px] overflow-hidden font-["Semibold"] z-50 border text-xs bg-white rounded-lg p-2'>Forms & Payments</div>
              <div class='w-full h-48 flex items-center justify-center bg-gradient-to-b from-gray-100 to-transparent rounded-t-lg'>
                <img src={example3} class='w-44' />
              </div>
              <div class='p-6 px-8'>
                <div class='font-["Semibold"]'>Forms & Payments- Create seamless forms for your users</div>
                <div class='text-gray-400 font-["Medium"] mt-2 mb-5'>Easily collect information and accept payments with customizable forms and secure payment integrations.</div>
                <a href='/beta' class='bg-black rounded-full px-3 py-2 text-sm font-["Semibold"] text-white'>Get started with forms</a>

              </div>
            </div>

          </div>
          <div class='flex flex-col w-full px-5'>
            <div class='mb-2 md:text-lg font-["Semibold"] mt-10'>Digital Storefronts</div>
            <div class='md:text-4xl text-xl md:mt-5 font-["Semibold"] w-full md:w-2/3'>Start selling smarter, not harder. Get your Commercify Storefront today! </div>
            <div class='grid md:grid-cols-2 gap-10 mt-7'>
              <div class='w-full border rounded-xl'>
                <div class='w-full h-72 flex items-center justify-center bg-gradient-to-b from-gray-100 to-transparent rounded-t-lg'>
                <img src={lll} class='w-40' />
                </div>
                <div class='p-6 px-8'>
                  <div class='font-["Semibold"] text-lg'>Easy Setup</div>
                  <div class='text-gray-400 font-["Medium"] mt-2'>No coding required! Launch your store with just a few clicks.</div>
                </div>
              </div>
              <div class='w-full border rounded-xl'>
                <div class='w-full h-72 flex items-center justify-center bg-gradient-to-b from-gray-100 to-transparent rounded-t-lg'>
                      <img src={ColorPicker} class='w-48' />
                </div>
                <div class='p-6 px-8'>
                  <div class='font-["Semibold"] text-lg'>Seamless Customization</div>
                  <div class='text-gray-400 font-["Medium"] mt-2'>Design your storefront to match your brand’s identity.</div>
                </div>
              </div>
            </div>
            <div class='w-full border mt-6 rounded-xl'>
              <div class='w-full h-96 flex items-center justify-center bg-gradient-to-b from-gray-100 to-transparent rounded-t-lg'>
              <img src={DatePicker} class='w-96' />
              </div>
              <div class='p-6 px-8'>
                <div class='font-["Semibold"] text-lg'>Book & Sell</div>
                <div class='text-gray-400 font-["Medium"] mt-2'>Let people buy and book sessions from you with no platform charges.</div>
              </div>
            </div>
          </div>
          <div class='flex flex-col w-full px-5'>
          <div class='mb-2 md:text-lg font-["Semibold"] mt-10'>Link-in-bios</div>
            <div class='md:text-4xl text-xl md:mt-5 font-["Semibold"] w-full md:w-2/3'>Stop losing clicks—turn your followers into customers today!</div>
            <div class='grid md:grid-cols-2 gap-10 mt-7'>
              <div class='w-full border rounded-xl'>
                <div class='w-full h-72 flex items-center justify-center bg-gradient-to-b from-gray-100 to-transparent rounded-t-lg'>
                <img src={jn} class='w-60' />
                </div>
                <div class='p-6 px-8'>
                  <div class='font-["Semibold"] text-lg'>Seamless Integrations </div>
                  <div class='text-gray-400 font-["Medium"] mt-2'>Connect your shop, social media, and content in one place.</div>
                </div>
              </div>
              <div class='w-full border rounded-xl'>
                <div class='w-full h-72 flex items-center justify-center bg-gradient-to-b from-gray-100 to-transparent rounded-t-lg'>
                <div class='w-full flex items-center justify-center bg-gradient-to-b from-gray-100 to-transparent rounded-t-lg'>
              <img src={lpsd} class='w-72' />
              </div>
                </div>
                <div class='p-6 px-8'>
                  <div class='font-["Semibold"] text-lg'>Boost Engagement </div>
                  <div class='text-gray-400 font-["Medium"] mt-2'>Drive traffic to your most important links with ease</div>
                </div>
              </div>
            </div>
            <div class='w-full border mt-6 rounded-xl'>
              <div class='w-full h-72 flex items-center justify-center bg-gradient-to-b from-gray-100 to-transparent rounded-t-lg'>
              <img src={ghg} class='w-72' />

              </div>
              <div class='p-6 px-8'>
                <div class='font-["Semibold"] text-lg'>SEO & Custom Domains</div>
                <div class='text-gray-400 font-["Medium"] mt-2'>Improve discoverability with SEO settings and a branded URL.</div>
              </div>
            </div>
          </div>
          <div class='flex flex-col w-full px-5'>
          <div class='mb-2 md:text-lg font-["Semibold"] mt-10'>Forms & Payments</div>
            <div class='md:text-4xl text-xl md:mt-5 font-["Semibold"] w-full md:w-2/3'>Get paid and gather insights—without the hassle! </div>
            <div class='grid md:grid-cols-2 gap-10 mt-7'>
              <div class='w-full border rounded-xl'>
                <div class='w-full h-72 flex items-center justify-center bg-gradient-to-b from-gray-100 to-transparent rounded-t-lg'>
                <img src={vv} class='w-44' />

                </div>
                <div class='p-6 px-8'>
                  <div class='font-["Semibold"] text-lg'>Seamless Payment Integration </div>
                  <div class='text-gray-400 font-["Medium"] mt-2'>Accept payments via Stripe, PayPal, and more.</div>
                </div>
              </div>
              <div class='w-full border rounded-xl'>
                <div class='w-full h-72 flex items-center justify-center bg-gradient-to-b from-gray-100 to-transparent rounded-t-lg'>
                <img src={mai} class='w-60' />

                </div>
                <div class='p-6 px-8'>
                  <div class='font-["Semibold"] text-lg'>Automated Responses</div>
                  <div class='text-gray-400 font-["Medium"] mt-2'> Send confirmation emails and notifications instantly.</div>
                </div>
              </div>
            </div>
            <div class='w-full border mt-6 rounded-xl'>
              <div class='w-full h-72 flex items-center justify-center bg-gradient-to-b from-gray-100 to-transparent rounded-t-lg'>
              <img src={files} class='w-60' />

              </div>
              <div class='p-6 px-8'>
                <div class='font-["Semibold"] text-lg'>File Uploads </div>
                <div class='text-gray-400 font-["Medium"] mt-2'>Allow users to upload documents, images, or other files directly in forms.</div>
              </div>
            </div>
          </div>
          <div class='text-center font-["Semibold"] max-w-lg mx-auto mt-10 text-3xl md:text-4xl'>
            Simplify the way your selling with commercify</div>
          <div class='text-gray-400 max-w-md mt-1 text-center font-["Medium"]'>Start using Commercify for free or upgrade to a plan for added features</div>
          <div class='w-full flex mt-4 items-center justify-center space-x-3'>
            <a href='/beta' class='px-4 py-3 text-xs text-white rounded-full bg-black font-["Semibold"]'>Join for free</a>
            <a href='/pricing' class='px-4 py-3 text-xs text-black rounded-full border font-["Semibold"]'>See our plans</a>
          </div>
        </div>
      </div>
      <div class='my-10 mt-20 flex flex-col w-full space-y-4'>


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
        <div class="absolute h-16 w-full bg-white rounded-b-[50px] z-10"></div>
        <img src='/Browser.svg' />
        <div class="bg-black relative h-96 w-full z-0">
          <div class='md:flex items-center w-full justify-between p-8 max-w-screen-xl mx-auto'>
            <div class='mt-16'>
              <Group3 className='w-10 h-10' />
              <div clas>
                <div class='text-md font-["Medium"] mt-5 text-white'>Simplify your ecommerce expirence</div>

              </div>
            </div>
            <div class='flex gap-8 xs:justify-between w-full md:justify-center'>
              <div class='text-white text-sm mt-16 font-["Semibold"] flex flex-col gap-2'>
                <div>Instagram</div>
                <div>Twitter</div>
                <div>Get started with beta</div>
              </div>
              <div class='text-white text-sm mt-16 font-["Semibold"] flex flex-col gap-2'>
                <div>Create account</div>
                <div>Login</div>
                <div>Pricing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
