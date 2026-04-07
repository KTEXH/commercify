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
  { name: 'Twitch', image: twitch }, { name: 'Pinterest', image: pinterest },
  { name: 'Reddit', image: reddit }, { name: 'Medium', image: medium },
  { name: 'Patreon', image: patreon }, { name: 'Spotify', image: spotify },
  { name: 'Github', image: github }, { name: 'LinkedIn', image: linkden },
  { name: 'Zoom', image: zoom }, { name: 'Truth', image: truth },
  { name: 'Yelp', image: yelp }, { name: 'Google Meets', image: googlemeet },
]);

const images2 = shuffleArray([
  { name: 'Dribble', image: dribble }, { name: 'Notion', image: notion },
  { name: 'Dropbox', image: dropbox }, { name: 'Behance', image: behance },
  { name: 'Spotify', image: spotify }, { name: 'Github', image: github },
  { name: 'Patreon', image: patreon }, { name: 'Medium', image: medium },
  { name: 'Reddit', image: reddit }, { name: 'Pinterest', image: pinterest },
  { name: 'Twitch', image: twitch },
]);

const images3 = shuffleArray([
  { name: 'Google Meets', image: googlemeet }, { name: 'Yelp', image: yelp },
  { name: 'Truth', image: truth }, { name: 'Zoom', image: zoom },
  { name: 'LinkedIn', image: linkden }, { name: 'Github', image: github },
  { name: 'Spotify', image: spotify }, { name: 'Patreon', image: patreon },
  { name: 'Medium', image: medium }, { name: 'Reddit', image: reddit },
  { name: 'Pinterest', image: pinterest }, { name: 'Twitch', image: twitch },
]);

const FeatureCard = ({ badge, image, title, description, href }) => (
  <div className='border border-zinc-100 rounded-2xl overflow-hidden bg-white hover:shadow-lg hover:border-zinc-200 transition-all duration-300 group'>
    <div className='relative'>
      <div className='absolute top-4 left-4 z-10'>
        <span className='font-["Semibold"] text-xs bg-zinc-950 text-white px-3 py-1.5 rounded-lg'>{badge}</span>
      </div>
      <div className='w-full h-52 bg-white border-b border-zinc-100 flex justify-center items-center overflow-hidden'>
        <img src={image} className='h-32 object-contain group-hover:scale-105 transition-transform duration-500' />
      </div>
    </div>
    <div className='p-7'>
      <div className='font-["Semibold"] text-zinc-900 text-base leading-snug mb-2'>{title}</div>
      <div className='text-zinc-500 font-["Medium"] text-sm leading-relaxed mb-5'>{description}</div>
      <a href={href} className='inline-flex items-center gap-1.5 bg-zinc-950 text-white rounded-xl px-4 py-2 text-xs font-["Semibold"] hover:bg-zinc-800 transition-colors'>
        Get started <ArrowRightIcon className='w-3.5 h-3.5' />
      </a>
    </div>
  </div>
);

const SectionCard = ({ image, title, description, tall }) => (
  <div className='border border-zinc-100 rounded-2xl overflow-hidden bg-white hover:shadow-md hover:border-zinc-200 transition-all duration-300 group'>
    <div className={`w-full ${tall ? 'h-80' : 'h-60'} bg-white border-b border-zinc-100 flex items-center justify-center overflow-hidden`}>
      <img src={image} className='object-contain group-hover:scale-105 transition-transform duration-500' style={{ maxHeight: '85%', maxWidth: '80%' }} />
    </div>
    <div className='p-7'>
      <div className='font-["Semibold"] text-zinc-900 text-base mb-1.5'>{title}</div>
      <div className='text-zinc-500 font-["Medium"] text-sm leading-relaxed'>{description}</div>
    </div>
  </div>
);

export default function LandingPage({ className = "", duration = 3000 }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePlayPause = () => {
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % platforms.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`font-general-sans font-medium tracking-[0px] ${className}`}>
      {/* ── Hero ── */}
      <div className='min-h-screen bg-white relative flex flex-col overflow-hidden'>
        {/* subtle grid texture */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px]' />

        <div className='relative z-10 flex-1 flex flex-col'>
          <Header />

          <div className='flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 max-w-5xl mx-auto w-full'>
            {/* Animated platform icon */}
            <div className="relative w-16 h-16 mb-8">
              <div className="absolute top-[-10px] left-2 w-[calc(100%-14px)] h-[calc(100%-14px)] bg-zinc-100 rounded-xl z-0" />
              <AnimatePresence>
                <motion.div
                  key={platforms[currentIndex].name}
                  className="absolute w-full h-full flex justify-center items-center rounded-xl z-10"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.7, ease: "backInOut" }}
                >
                  <img src={platforms[currentIndex].image} className='h-full w-full' />
                </motion.div>
              </AnimatePresence>
            </div>

            <h1 className='text-5xl md:text-7xl text-center font-["Semibold"] text-zinc-950 leading-[1.08] tracking-tight max-w-4xl'>
              Simplifying E-commerce{' '}
              <span className='text-zinc-400'>one page at a time.</span>
            </h1>

            <p className='text-zinc-500 mt-6 text-base md:text-lg font-["Medium"] max-w-2xl text-center leading-relaxed'>
              Create and scale your brand with storefronts, workshops, link-in-bios, forms, and payments — all in one place.
            </p>

            <div className='flex mt-8 items-center gap-3'>
              <a href='/beta' className='px-6 py-3 text-sm text-white bg-zinc-950 rounded-xl font-["Semibold"] hover:bg-zinc-800 transition-colors flex items-center gap-2'>
                Start for free <ArrowRightIcon className='w-4 h-4' />
              </a>
              <a href='/pricing' className='px-6 py-3 text-sm text-zinc-600 rounded-xl border border-zinc-200 font-["Semibold"] hover:bg-zinc-50 hover:border-zinc-300 transition-all'>
                See pricing
              </a>
            </div>

            {/* Social proof logos */}
            <div className='mt-16 flex flex-col items-center gap-5 w-full'>
              <div className='font-["Medium"] text-xs text-zinc-400 tracking-widest uppercase'>Sell across platforms</div>
              <div className='flex flex-wrap items-center justify-center gap-8 opacity-30'>
                <img className='h-7' src={pintrest} />
                <img className='h-7' src={youtubeLong} />
                <img className='h-7' src={linkedin} />
                <img className='h-7' src={dribbble} />
                <img className='h-7' src={facebookLong} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── What we offer ── */}
      <div className='bg-white py-24 px-6'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-col items-center mb-14'>
            <div className='flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-950 mb-5'>
              <CursorArrowRaysIcon className='text-white w-4 h-4' />
            </div>
            <h2 className='font-["Semibold"] text-center text-3xl md:text-4xl text-zinc-950 max-w-lg leading-snug'>
              All-in-one tools for your business
            </h2>
            <p className='font-["Medium"] text-center text-zinc-500 mt-3 max-w-xl text-sm md:text-base leading-relaxed'>
              Storefronts, link pages, forms, and payments — built for creators and small businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              badge="Digital Storefront"
              image={more}
              title="Storefronts — launch a store in minutes"
              description="Fully customizable online stores with seamless setup, beautiful design, and optimized sales features."
              href="/beta"
            />
            <FeatureCard
              badge="Link-in-bio"
              image={exa}
              title="Link-in-bios — link management made easy"
              description="Everything in one place — your socials, store, and content. Customizable and mobile-first."
              href="/beta"
            />
            <FeatureCard
              badge="Forms & Payments"
              image={example3}
              title="Forms — collect info and get paid"
              description="Customizable forms with secure payment integrations. No friction, just results."
              href="/beta"
            />
          </div>
        </div>
      </div>

      {/* ── Storefronts section ── */}
      <div className='bg-white py-24 px-6 border-t border-zinc-100'>
        <div className='max-w-5xl mx-auto'>
          <div className='mb-4 text-xs font-["Semibold"] text-zinc-500 uppercase tracking-widest'>Storefronts</div>
          <h2 className='text-3xl md:text-4xl font-["Semibold"] text-zinc-950 max-w-xl leading-snug mb-10'>
            Start selling smarter, not harder.
          </h2>
          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            <SectionCard image={lll} title="Easy Setup" description="No coding required. Launch your store with just a few clicks and start selling immediately." />
            <SectionCard image={ColorPicker} title="Seamless Customization" description="Design your storefront to match your brand's identity with powerful style controls." />
          </div>
          <SectionCard image={DatePicker} title="Book & Sell" description="Let customers buy products and book sessions — no platform fees eating your revenue." tall />
        </div>
      </div>

      {/* ── Link-in-bio section ── */}
      <div className='bg-white py-24 px-6 border-t border-zinc-100'>
        <div className='max-w-5xl mx-auto'>
          <div className='mb-4 text-xs font-["Semibold"] text-zinc-500 uppercase tracking-widest'>Link-in-bios</div>
          <h2 className='text-3xl md:text-4xl font-["Semibold"] text-zinc-950 max-w-xl leading-snug mb-10'>
            Turn your followers into customers.
          </h2>
          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            <SectionCard image={jn} title="Seamless Integrations" description="Connect your shop, socials, and content in one beautifully organized page." />
            <SectionCard image={lpsd} title="Boost Engagement" description="Drive traffic to your most important links with a conversion-focused layout." />
          </div>
          <SectionCard image={ghg} title="SEO & Custom Domains" description="Improve discoverability with SEO settings and a branded URL that's yours." tall />
        </div>
      </div>

      {/* ── Forms & Payments section ── */}
      <div className='bg-white py-24 px-6 border-t border-zinc-100'>
        <div className='max-w-5xl mx-auto'>
          <div className='mb-4 text-xs font-["Semibold"] text-zinc-500 uppercase tracking-widest'>Forms & Payments</div>
          <h2 className='text-3xl md:text-4xl font-["Semibold"] text-zinc-950 max-w-xl leading-snug mb-10'>
            Get paid and gather insights — without the hassle.
          </h2>
          <div className='grid md:grid-cols-2 gap-6 mb-6'>
            <SectionCard image={vv} title="Seamless Payment Integration" description="Accept payments via Stripe securely, with instant payouts to your account." />
            <SectionCard image={mai} title="Automated Responses" description="Send confirmation emails and notifications the moment a form is submitted." />
          </div>
          <SectionCard image={files} title="File Uploads" description="Let users upload documents, images, or files directly through your forms." tall />
        </div>
      </div>

      {/* ── CTA banner ── */}
      <div className='bg-zinc-950 py-24 px-6'>
        <div className='max-w-2xl mx-auto text-center'>
          <h2 className='font-["Semibold"] text-3xl md:text-5xl text-white leading-tight mb-4'>
            Ready to simplify how you sell?
          </h2>
          <p className='text-zinc-400 font-["Medium"] mb-8 text-sm md:text-base'>
            Start using Commercify for free or upgrade for more power.
          </p>
          <div className='flex items-center justify-center gap-3'>
            <a href='/beta' className='px-6 py-3 text-sm text-black bg-white rounded-xl font-["Semibold"] hover:bg-zinc-100 transition-colors'>
              Join for free
            </a>
            <a href='/pricing' className='px-6 py-3 text-sm text-zinc-300 rounded-xl border border-white/10 font-["Semibold"] hover:bg-white/5 transition-all'>
              See plans
            </a>
          </div>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className='bg-white py-12 flex flex-col gap-4 overflow-hidden border-y border-zinc-200'>
        {[images3, images1].map((imgs, rowIdx) => (
          <div key={rowIdx} className="relative w-full overflow-hidden">
            <div className="flex w-max gap-10 animate-float" style={{ animationDuration: '165s' }}>
              {[...imgs, ...imgs].map((image, index) => (
                <div key={index} className="flex items-center gap-2.5">
                  <img src={image.image} alt={image.name} className="w-8 h-8 opacity-60" />
                  <div className="text-base font-['Semibold'] text-zinc-400">{image.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <footer className='bg-zinc-950 px-6 py-16'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex flex-col md:flex-row md:items-start justify-between gap-12'>
            <div className='max-w-xs'>
              <div className='flex items-center gap-2 mb-4'>
                <Group3 className='w-7 h-7' />
                <span className='font-["Semibold"] text-white text-sm'>Commercify HQ</span>
              </div>
              <p className='text-zinc-500 font-["Medium"] text-sm leading-relaxed'>
                Simplify your e-commerce experience. One page at a time.
              </p>
            </div>
            <div className='flex gap-16'>
              <div>
                <div className='text-zinc-600 font-["Semibold"] text-xs uppercase tracking-widest mb-4'>Product</div>
                <div className='flex flex-col gap-3'>
                  <a href='/beta' className='text-zinc-400 font-["Semibold"] text-sm hover:text-white transition-colors'>Beta</a>
                  <a href='/pricing' className='text-zinc-400 font-["Semibold"] text-sm hover:text-white transition-colors'>Pricing</a>
                </div>
              </div>
              <div>
                <div className='text-zinc-600 font-["Semibold"] text-xs uppercase tracking-widest mb-4'>Account</div>
                <div className='flex flex-col gap-3'>
                  <a href='/register' className='text-zinc-400 font-["Semibold"] text-sm hover:text-white transition-colors'>Create account</a>
                  <a href='/login' className='text-zinc-400 font-["Semibold"] text-sm hover:text-white transition-colors'>Login</a>
                </div>
              </div>
              <div>
                <div className='text-zinc-600 font-["Semibold"] text-xs uppercase tracking-widest mb-4'>Social</div>
                <div className='flex flex-col gap-3'>
                  <a className='text-zinc-400 font-["Semibold"] text-sm hover:text-white transition-colors'>Instagram</a>
                  <a className='text-zinc-400 font-["Semibold"] text-sm hover:text-white transition-colors'>Twitter</a>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-16 pt-8 border-t border-white/5 flex items-center justify-between'>
            <span className='text-zinc-600 font-["Medium"] text-xs'>© 2025 Commercify HQ. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
